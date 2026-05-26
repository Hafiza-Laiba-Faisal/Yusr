import json
import logging
import os
import httpx
from typing import Optional, List, Dict
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class FeedbackService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "arcee-ai/trinity-large-thinking:free"

    def _extract_json(self, text: str) -> Optional[dict]:
        if not text: return None
        import re
        text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
        try:
            return json.loads(text)
        except:
            pass
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end+1])
            except: pass
        return None

    async def generate_response(self, message: str, system_prompt: str) -> str:
        """
        Generic chat response generator for AI counseling.
        """
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7
        }
        try:
            async with httpx.AsyncClient(timeout=180) as client:
                resp = await client.post(
                    self.url,
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "YUSR Quran Counselor"
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Chat generation failed: {e}")
            return "معذرت، میں ابھی بات کرنے سے قاصر ہوں۔ برائے مہربانی دوبارہ کوشش کریں۔"

    async def generate_feedback(
        self,
        transcribed: str,
        original: str,
        word_diff_list: list,
        tajweed_flags: list,
        similarity: float,
        student_message: str = None,
    ):
        """
        Recitation feedback generator.
        """
        # Master System Prompt — Focus on Human-like empathy
        system_prompt = (
            "آپ قرآن کے ایک انتہائی مہربان اور عقل مند استاد ہیں۔ آپ کا کام طالب علم کی حوصلہ افزائی کرنا ہے۔\n\n"
            "صرف اور صرف JSON میں جواب دیں۔ کوئی دوسری بات نہ کریں۔ JSON کا فارمیٹ یہ ہونا چاہیے:\n"
            "{\n"
            '  "overall_score": 85,\n'
            '  "feedback_urdu": "ماشاء اللہ! بہت اچھی تلاوت ہے...",\n'
            '  "errors": [],\n'
            '  "encouragement_urdu": "سبحان اللہ! محنت جاری رکھیں"\n'
            "}"
        )

        diff_text = "\n".join([f"  - {d['word']}: {d['status']}" for d in word_diff_list[:15]])
        user_msg = f"طالب علم کی آواز: {transcribed}\nاصل متن: {original}\nمشابہت: {similarity:.0%}\n\nتقابل:\n{diff_text}"

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg}
            ],
            "temperature": 0.4
        }

        try:
            async with httpx.AsyncClient(timeout=180) as client:
                resp = await client.post(self.url, json=payload, headers={"Authorization": f"Bearer {self.api_key}"})
                resp.raise_for_status()
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                parsed = self._extract_json(content)
                if parsed:
                    return {
                        "overall_score": int(parsed.get("overall_score", 0)),
                        "feedback_urdu": parsed.get("feedback_urdu", "ماشاء اللہ! آپ کی تلاوت بہتر ہو رہی ہے۔"),
                        "errors": parsed.get("errors", []),
                        "encouragement_urdu": parsed.get("encouragement_urdu", "کوشش جاری رکھیں۔")
                    }
        except Exception as e:
            logger.error(f"Feedback generation failed: {e}")

        return {"overall_score": int(similarity*100), "feedback_urdu": "ماشاء اللہ، تلاوت ریکارڈ ہو گئی۔", "errors": [], "encouragement_urdu": "کوشش جاری رکھیں۔"}
