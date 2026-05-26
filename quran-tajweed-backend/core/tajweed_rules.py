"""
Tajweed rule checker — simple regex-based detection
of Ghunnah, Madd, and Waqf markers in Arabic text.
"""

import re
import logging

logger = logging.getLogger(__name__)

# Arabic Unicode helpers
SHADDA = "\u0651"
FATHA = "\u064E"
DAMMA = "\u064F"
KASRA = "\u0650"

NOON = "\u0646"       # ن
MEEM = "\u0645"       # م
ALEF = "\u0627"       # ا
WAW = "\u0648"        # و
YA = "\u064A"         # ي


def check_tajweed_flags(original: str) -> list[dict]:
    """
    Run simple rule-based checks on Arabic text and return
    a list of tajweed hints for the feedback agent.

    Each item: {"rule": str, "word": str, "note_urdu": str}
    """
    flags: list[dict] = []
    words = original.split()

    for word in words:
        # --- Ghunnah: noon or meem followed by shadda (نّ / مّ) ---
        if re.search(f"[{NOON}{MEEM}]{SHADDA}", word):
            flags.append({
                "rule": "غنّہ (Ghunnah)",
                "word": word,
                "note_urdu": "اس لفظ میں غنّہ ہے — نون یا میم پر شدّہ ہے، دو حرکت تک ناک سے آواز نکالیں۔",
            })

        # --- Madd: alef after fatha, waw after damma, ya after kasra ---
        if re.search(f"{FATHA}{ALEF}", word):
            flags.append({
                "rule": "مدّ (Madd)",
                "word": word,
                "note_urdu": "اس لفظ میں مدّ ہے — فتحہ کے بعد الف آیا ہے، آواز کو کھینچیں۔",
            })
        if re.search(f"{DAMMA}{WAW}", word):
            flags.append({
                "rule": "مدّ (Madd)",
                "word": word,
                "note_urdu": "اس لفظ میں مدّ ہے — ضمّہ کے بعد واؤ آیا ہے، آواز کو کھینچیں۔",
            })
        if re.search(f"{KASRA}{YA}", word):
            flags.append({
                "rule": "مدّ (Madd)",
                "word": word,
                "note_urdu": "اس لفظ میں مدّ ہے — کسرہ کے بعد یاء آیا ہے، آواز کو کھینچیں۔",
            })

    # --- Waqf: end-of-ayah marker (۝ or similar) ---
    if original.strip().endswith(("\u06DD", "\u06D4", "۝")):
        flags.append({
            "rule": "وقف (Waqf)",
            "word": original.split()[-1] if words else "",
            "note_urdu": "آیت کے آخر میں وقف کریں — سانس روکیں اور رکیں۔",
        })

    return flags
