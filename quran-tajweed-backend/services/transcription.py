"""
Transcription service — sends audio to Groq Whisper API for Arabic ASR.
"""

import os
import logging

import httpx

logger = logging.getLogger(__name__)

GROQ_ASR_URL = "https://api.groq.com/openai/v1/audio/transcriptions"


async def transcribe(audio_bytes: bytes, filename: str) -> str:
    """
    Send audio bytes to Groq Whisper API and return transcribed Arabic text.

    Raises:
        RuntimeError: if the API call fails.
    """
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set")

    headers = {"Authorization": f"Bearer {api_key}"}

    # Determine content type from filename
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "wav"
    mime_map = {
        "wav": "audio/wav",
        "mp3": "audio/mpeg",
        "m4a": "audio/mp4",
        "ogg": "audio/ogg",
        "webm": "audio/webm",
        "flac": "audio/flac",
    }
    content_type = mime_map.get(ext, "audio/wav")

    files = {
        "file": (filename, audio_bytes, content_type),
    }
    data = {
        "model": "whisper-large-v3",
        "language": "ar",
        "prompt": "القرآن الكريم",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            GROQ_ASR_URL,
            headers=headers,
            files=files,
            data=data,
        )

        if resp.status_code != 200:
            logger.error("Groq ASR failed: %s %s", resp.status_code, resp.text)
            raise RuntimeError(f"Groq ASR error: {resp.status_code}")

        result = resp.json()

    transcribed = result.get("text", "").strip()
    
    # --- Anti-Hallucination Filter ---
    # Whisper occasionally hallucinates during silence/low noise
    noise_patterns = [
        "ترجمة", "نانسي", "قنقر", "قنكر", "كراكر", "Kankar", "Ajram", 
        "Subtitles", "Transcribed by", "قناة", "مترجم", "Amara", "اشتركوا", 
        "الاشتراك", "Like and Share", "فيديو", "الفيديو", "نشر", "لنشارة", 
        "قناة", "اشترجوا", "اشترجوكوا", "نانا", "شكراً للمشاهدة", "موسيقا", "موسيقى", "Music"
    ]
    
    # If the transcription is just one of these patterns or contains them, clean up.
    # If the resulting text is just noise/hallucination, return empty string.
    for pattern in noise_patterns:
        if pattern in transcribed:
            transcribed = transcribed.replace(pattern, "").strip()
    
    # If transcription looks like a standard social media hallucination sentence
    # or is too short to be a valid Ayah, return empty string.
    if len(transcribed) < 3 or any(p in transcribed for p in ["للمشاركة", "برجاء الاشتراك", "اشترك", "فيديو"]):
        return ""

    logger.info("Transcribed (%d chars): %s...", len(transcribed), transcribed[:80])
    return transcribed
