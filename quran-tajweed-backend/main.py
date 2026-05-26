"""
Quran Tajweed Correction Backend — FastAPI Application

Endpoints:
  POST /analyze         — Full recitation analysis pipeline
  GET  /surahs          — List all surahs
  GET  /student/{id}/progress — Student progress history
  GET  /health          — Health check
"""

import os
import json
import logging
from typing import Optional, List, Dict
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.quran_data import load_quran_data, surah_info, surah_id_to_name, quran_dict
from core.tajweed_rules import check_tajweed_flags
from database.db import init_db, save_session, get_progress, get_stats
from services.transcription import transcribe
from services.analysis import find_best_ayah, word_diff
from services.feedback import FeedbackService

chat_service = FeedbackService()

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Load environment
# ---------------------------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------------------------
# Lifespan — startup / shutdown
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load Quran data + init DB. Shutdown: cleanup."""
    logger.info("🚀 Starting Quran Tajweed Backend...")

    # Load Quran data
    await load_quran_data()
    logger.info("✅ Quran data loaded: %d surahs", len(surah_info))

    # Init database
    db_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://radeon:@localhost:5432/quran_coach")
    try:
        await init_db(db_url)
        logger.info("✅ Database initialised")
    except Exception as e:
        logger.error("❌ Database init failed: %s", e)
        logger.warning("⚠️  Server will run but DB-dependent features may fail")

    yield

    logger.info("🛑 Shutting down...")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Quran Tajweed Correction API",
    description="Recitation analysis with Groq Whisper ASR + Ollama DeepSeek feedback",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok"}


# Global Cache for metadata
JUZ_DATA = {}
RUKU_DATA = {}
try:
    with open("quran_metadata.json", "r") as f:
        JUZ_DATA = json.load(f)
    with open("ruku_metadata.json", "r") as f:
        RUKU_DATA = json.load(f)
except FileNotFoundError:
    pass

@app.get("/juzs")
async def get_juzs():
    return JUZ_DATA.get("juzs", [])

@app.get("/rukus")
async def get_rukus(surah_id: int):
    surahs = RUKU_DATA.get("surahs", [])
    for s in surahs:
        if s["id"] == surah_id:
            return s["rukus"]
    return []

@app.post("/plan-with-ai")
async def plan_with_ai(data: dict):
    student_msg = data.get("message", "")
    context = data.get("context", {})
    
    system_prompt = """آپ 'یسر' (YUSR) کے ایک شفیق اور ماہر استاد ہیں۔ آپ کا کام طالب علم کے ساتھ بات چیت کر کے ان کا حفظ کا شیڈول بنانا ہے۔
    
    اصول:
    - اگر طالب علم نے پہلے حفظ کیا ہوا ہے (مثلاً 10 پارے) اور اب دوبارہ پختہ کر رہا ہے:
      1. سبقی: حالیہ پارہ (مثلاً اگر پارہ 4 پر ہے تو پارہ 3 اور 4 کا کچھ حصہ)۔
      2. منزل: گزشتہ پارے (مثلاً پارہ 1 اور 2)۔
    - عام طور پر روزانہ 1 پارہ سبقی اور 1 پارہ منزل کا مشورہ دیں، لیکن اگر طالب علم اپنی مرضی بتائے تو اسے قبول کریں۔
    - بات چیت کے آخر میں جب جُز اور آیات فائنل ہو جائیں، تو یہ JSON لازمی دیں:
    PLAN_JSON: {
      "sabak": {"surah": "...", "start": XY, "end": Z},
      "sabqi": {"surah": "...", "start": XY, "end": Z},
      "manzil": {"surah": "...", "start": XY, "end": Z}
    }
    پہلے طالب علم سے ان کا حال پوچھیں اور ان کی پچھلی پڑھائی کی تفصیل لیں۔"""

    response = await chat_service.generate_response(student_msg, system_prompt)
    
    # Extract JSON if present
    recommended_plan = None
    if "PLAN_JSON:" in response:
        try:
            parts = response.split("PLAN_JSON:")
            response_text = parts[0].strip()
            json_str = parts[1].strip()
            recommended_plan = json.loads(json_str)
        except:
            response_text = response
    else:
        response_text = response

    return {
        "reply": response_text,
        "recommended_plan": recommended_plan
    }


@app.get("/surahs")
async def list_surahs():
    """Return list of all surahs."""
    return [
        {"name": name, "id": info["id"], "total_verses": info["total_verses"]}
        for name, info in surah_info.items()
    ]


@app.get("/ayahs")
async def get_ayahs(surah_id: int, start: int, end: int):
    """Return a block of ayah texts."""
    result = []
    for i in range(start, end + 1):
        ref = f"{surah_id}:{i}"
        text = quran_dict.get(ref)
        if text:
            result.append({"ayah": i, "text": text})
    return result

@app.get("/student/{student_id}/progress")
async def student_progress(student_id: str):
    """Return session history for a student."""
    try:
        progress = await get_progress(student_id)
        return progress
    except Exception as e:
        logger.error("DB error fetching progress: %s", e)
        return []


@app.get("/student/{student_id}/stats")
async def student_stats(student_id: str):
    """Return aggregated stats for a student."""
    try:
        return await get_stats(student_id)
    except Exception as e:
        logger.error("Stats error: %s", e)
        return {"total_sessions": 0, "avg_score": 0, "best_score": 0, "streak": 0, "weekly": []}


@app.post("/analyze")
async def analyze(
    audio_file: Optional[UploadFile] = File(None),
    surah_name: str = Form(...),
    start_ayah: int = Form(...),
    end_ayah: int = Form(...),
    student_id: str = Form(...),
    student_message: str = Form(None),
    transcribed_text: str = Form(None),
):
    """Save audio, transcribe, compare, and generate LLM feedback."""
    # ... previous logic for saving and transcribing ...
    # (assuming logic inside analyze remains same, just passing student_message to generate_feedback)
    # I will simplify the replacement for the endpoint signature:
    """
    Full recitation analysis pipeline:
    1. Transcribe audio (Groq Whisper)
    2. Match best ayah in range
    3. Word-level diff
    4. Tajweed flag detection
    5. Generate Urdu feedback (Ollama DeepSeek)
    6. Save session to DB
    7. Return full result
    """

    # --- Resolve surah ---
    info = surah_info.get(surah_name)
    if info is None:
        return JSONResponse(
            status_code=400,
            content={
                "error": "invalid_surah",
                "message": "سورت کا نام صحیح نہیں ہے۔ براہ کرم درست نام درج کریں۔",
            },
        )
    surah_id = info["id"]

    # --- Step 1: Transcribe (if audio provided) ---
    if audio_file:
        try:
            audio_bytes = await audio_file.read()
            transcribed_text = await transcribe(audio_bytes, audio_file.filename or "audio.wav")
        except Exception as e:
            logger.error("Transcription failed: %s", e)
            return JSONResponse(status_code=500, content={"error": "transcription_failed", "message": "آڈیو پروسیس نہیں ہوئی"})
    else:
        # If no audio, use the text passed from frontend (for chat/interactive)
        if not transcribed_text:
            transcribed_text = ""

    if not transcribed_text:
        return JSONResponse(
            status_code=200,
            content={
                "error": "empty_transcription",
                "message": "آواز پہچانی نہیں گئی۔ واضح آواز میں دوبارہ پڑھیں۔",
                "score": 0,
                "feedback": "آواز پہچانی نہیں گئی۔ براہ کرم مائیک چیک کریں اور دوبارہ تلاوت کریں۔"
            },
        )

    # --- Step 2: Find best ayah ---
    match = find_best_ayah(transcribed_text, surah_id, start_ayah, end_ayah)

    if match is None:
        # Still try to save and return partial result
        try:
            session_id = await save_session(
                student_id=student_id,
                surah_name=surah_name,
                start_ayah=start_ayah,
                end_ayah=end_ayah,
                transcribed_text=transcribed_text,
                original_text=None,
                similarity_score=None,
                overall_score=None,
                feedback_json=None,
            )
        except Exception as e:
            logger.error("DB save failed: %s", e)
            session_id = "db_error"

        return JSONResponse(
            status_code=200,
            content={
                "error": "no_match",
                "message": "آیت پہچانی نہیں گئی، واضح آواز میں دوبارہ پڑھیں",
                "transcribed_text": transcribed_text,
                "session_id": session_id,
            },
        )

    original_text = match["original"]
    similarity = match["similarity"]

    # --- Step 3: Word diff ---
    diff = word_diff(transcribed_text, original_text)

    # --- Step 4: Tajweed flags ---
    tajweed_flags = check_tajweed_flags(original_text)

    # --- Step 5: Generate feedback ---
    try:
        feedback = await chat_service.generate_feedback(
            transcribed=transcribed_text,
            original=original_text,
            word_diff_list=diff,
            tajweed_flags=tajweed_flags,
            similarity=similarity,
            student_message=student_message,
        )
    except Exception as e:
        logger.error("Feedback generation failed: %s", e)
        feedback = {
            "overall_score": 0,
            "feedback_urdu": "فیڈبیک تیار نہیں ہو سکی۔",
            "errors": [],
            "encouragement_urdu": "ہمت نہ ہاریں!",
        }

    overall_score = feedback.get("overall_score", 0)

    # --- Step 6: Save to DB ---
    try:
        session_id = await save_session(
            student_id=student_id,
            surah_name=surah_name,
            start_ayah=start_ayah,
            end_ayah=end_ayah,
            transcribed_text=transcribed_text,
            original_text=original_text,
            similarity_score=similarity,
            overall_score=overall_score,
            feedback_json=feedback,
        )
    except Exception as e:
        logger.error("DB save failed (non-fatal): %s", e)
        session_id = "db_error"

    # --- Step 7: Return result ---
    return {
        "session_id": session_id,
        "transcribed_text": transcribed_text,
        "matched_ayah_ref": match["ref"],
        "original_text": original_text,
        "similarity": similarity,
        "word_diff": diff,
        "tajweed_flags": tajweed_flags,
        "feedback": feedback,
        "surah_name": surah_name,
        "start_ayah": start_ayah,
        "end_ayah": end_ayah,
        "student_id": student_id,
    }


@app.post("/analyze-stream")
async def analyze_stream(
    audio_file: UploadFile = File(...),
    surah_name: str = Form(...),
    start_ayah: int = Form(...),
    end_ayah: int = Form(...),
):
    """
    Fast endpoint for real-time tracking. 
    Skips DB and LLM feedback for low latency.
    """
    info = surah_info.get(surah_name)
    if not info:
        return {"error": "Invalid surah"}

    # 1. Transcribe chunk
    try:
        audio_bytes = await audio_file.read()
        transcribed_text = await transcribe(audio_bytes, "chunk.wav")
    except:
        return {"error": "transcription_failed"}

    if not transcribed_text:
        return {"transcribed_text": "", "matches": [], "word_diff": [], "original_text": ""}

    # 2. Match against full range block
    match = find_best_ayah(transcribed_text, info["id"], start_ayah, end_ayah)
    if not match or match.get("similarity", 0) < 0.2:
        return {"transcribed_text": transcribed_text, "matches": [], "word_diff": [], "original_text": ""}

    # 3. Word diff
    original_text = match["original"]
    diff = word_diff(transcribed_text, original_text)
    
    # 4. Tajweed (just per-word rules for live highlights)
    tajweed_flags = check_tajweed_flags(original_text)

    return {
        "transcribed_text": transcribed_text,
        "word_diff": diff,
        "tajweed_flags": tajweed_flags,
        "original_text": original_text,
    }


# ---------------------------------------------------------------------------
# Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000
# ---------------------------------------------------------------------------
