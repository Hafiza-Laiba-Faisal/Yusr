"""
Analysis service — text comparison utilities for Quran recitation matching.
"""

import re
import logging
from difflib import SequenceMatcher

from core.quran_data import quran_dict

logger = logging.getLogger(__name__)

# Arabic diacritics (tashkeel) range
TASHKEEL_RE = re.compile(r"[\u0617-\u061A\u064B-\u0652]")

# Common ASR Hallucinations for Muqatta'at
MUQATTAAT_MAP = {
    "الف لامي": "الم",
    "الف لام ميم": "الم",
    "الم": "الم",
    "الف لامی": "الم",
    "Alif Lami": "الم",
    "Alif Lamy": "الم",
}

def normalize_phonetics(text: str) -> str:
    """Normalize common ASR errors into correct Quranic words."""
    for mistake, correct in MUQATTAAT_MAP.items():
        text = text.replace(mistake, correct)
    return text


def remove_tashkeel(text: str) -> str:
    """Strip Arabic diacritics (tashkeel) from text."""
    return TASHKEEL_RE.sub("", text)


def find_best_ayah(
    transcribed: str,
    surah_id: int,
    start: int,
    end: int,
) -> dict | None:
    """
    Compare transcribed text against the ENTIRE block of ayahs in the range.
    This allows students to recite multiple ayahs at once.
    """
    clean_transcribed = remove_tashkeel(transcribed)
    
    # 1. Combine all ayahs in the range into one string
    combined_original = ""
    combined_refs = []
    
    for ayah_num in range(start, end + 1):
        ref = f"{surah_id}:{ayah_num}"
        original = quran_dict.get(ref)
        if original:
            combined_original += " " + original
            combined_refs.append(ref)
    
    if not combined_original:
        return None
    
    combined_original = combined_original.strip()
    clean_original = remove_tashkeel(combined_original)
    
    # If the user recited Bismillah but the reference doesn't have it, ignore it 
    # so it doesn't penalize their score.
    bismillah_variants = ["بسم الله الرحمن الرحيم", "بسم الله"]
    for b in bismillah_variants:
        if clean_transcribed.startswith(b) and not clean_original.startswith(b):
            clean_transcribed = clean_transcribed[len(b):].strip()
            
    # 2. Calculate similarity for the whole block
    score = SequenceMatcher(None, clean_transcribed, clean_original).ratio()
    
    logger.info("Block match (Ayahs %d-%d): %.2f", start, end, score)
    
    # Even if similarity is low, we return it so the LLM can see the errors
    # but we only return None if there is absolutely no content or it's nonsensical (<0.1)
    if score < 0.1:
        return None

    return {
        "ref": f"{combined_refs[0]} to {combined_refs[-1]}" if len(combined_refs) > 1 else combined_refs[0],
        "original": combined_original,
        "similarity": round(score, 4),
    }


def word_diff(transcribed: str, original: str) -> list[dict]:
    """
    Compare transcribed vs original word-by-word (tashkeel-stripped).

    Returns list of:
        {"word": str, "status": "correct" | "missing" | "extra" | "wrong"}
    """
    t_clean = remove_tashkeel(transcribed)
    o_clean = remove_tashkeel(original)

    # If the user recited Bismillah but the reference doesn't have it, ignore it.
    bismillah_variants = ["بسم الله الرحمن الرحيم", "بسم الله"]
    for b in bismillah_variants:
        if t_clean.startswith(b) and not o_clean.startswith(b):
            t_clean = t_clean[len(b):].strip()

    trans_words = t_clean.split()
    orig_words = o_clean.split()

    matcher = SequenceMatcher(None, trans_words, orig_words)
    result: list[dict] = []

    for op, i1, i2, j1, j2 in matcher.get_opcodes():
        if op == "equal":
            for w in orig_words[j1:j2]:
                result.append({"word": w, "status": "correct"})
        elif op == "replace":
            for w in trans_words[i1:i2]:
                result.append({"word": w, "status": "wrong"})
            for w in orig_words[j1:j2]:
                result.append({"word": w, "status": "missing"})
        elif op == "insert":
            for w in orig_words[j1:j2]:
                result.append({"word": w, "status": "missing"})
        elif op == "delete":
            for w in trans_words[i1:i2]:
                result.append({"word": w, "status": "extra"})

    return result
