"""
Quran data loader — downloads and caches Quran JSON,
builds lookup dictionaries for ayahs and surah info.
"""

import json
import os
import logging
from pathlib import Path

import httpx

logger = logging.getLogger(__name__)

QURAN_JSON_URL = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json"
CACHE_PATH = Path(__file__).parent.parent / "quran_cache.json"

# Global dictionaries — populated on startup
quran_dict: dict[str, str] = {}        # "1:1" -> arabic text
surah_info: dict[str, dict] = {}       # "الفاتحة" -> {"id": 1, "total_verses": 7}
surah_id_to_name: dict[int, str] = {}  # 1 -> "الفاتحة"


async def load_quran_data() -> None:
    """Download Quran JSON (or load from cache) and build lookup dicts."""
    global quran_dict, surah_info, surah_id_to_name

    raw: list[dict]

    # Try cache first
    if CACHE_PATH.exists():
        logger.info("Loading Quran data from cache: %s", CACHE_PATH)
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
    else:
        logger.info("Downloading Quran JSON from CDN...")
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(QURAN_JSON_URL)
            resp.raise_for_status()
            raw = resp.json()

        # Cache to disk
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(raw, f, ensure_ascii=False)
        logger.info("Quran data cached to %s", CACHE_PATH)

    # Build dictionaries
    for surah in raw:
        surah_id = surah["id"]
        surah_name = surah["name"]
        verses = surah["verses"]

        surah_info[surah_name] = {
            "id": surah_id,
            "total_verses": len(verses),
        }
        surah_id_to_name[surah_id] = surah_name

        for verse in verses:
            ref = f"{surah_id}:{verse['id']}"
            quran_dict[ref] = verse["text"]

    # Post-process Al-Fatihah to match South Asian (Indo-Pak) numbering
    # which excludes Bismillah as Ayah 1 and instead counts Alhamdulillah as Ayah 1,
    # and splits the last ayah into two to maintain the 7 ayahs.
    fatihah = [quran_dict[f"1:{i}"] for i in range(1, 8)]
    quran_dict["1:1"] = fatihah[1]  # Alhamdulillah...
    quran_dict["1:2"] = fatihah[2]  # Ar-rahman...
    quran_dict["1:3"] = fatihah[3]  # Maliki...
    quran_dict["1:4"] = fatihah[4]  # Iyyaka...
    quran_dict["1:5"] = fatihah[5]  # Ihdina...
    
    v7 = fatihah[6]
    split_idx = v7.find("غَيۡرِ")
    if split_idx != -1:
        quran_dict["1:6"] = v7[:split_idx].strip()
        quran_dict["1:7"] = v7[split_idx:].strip()
    else:
        quran_dict["1:6"] = v7
        quran_dict["1:7"] = "وَلَا ٱلضَّآلِّينَ"

    logger.info(
        "Quran data loaded: %d surahs, %d ayahs",
        len(surah_info),
        len(quran_dict),
    )
