"""
Pydantic models for API request / response shapes.
"""

from pydantic import BaseModel


class SurahInfo(BaseModel):
    name: str
    id: int
    total_verses: int


class ProgressItem(BaseModel):
    surah_name: str
    score: int | None
    created_at: str | None


class WordDiffItem(BaseModel):
    word: str
    status: str  # "correct" | "missing" | "extra" | "wrong"


class TajweedFlag(BaseModel):
    rule: str
    word: str
    note_urdu: str


class FeedbackError(BaseModel):
    word: str
    error_type: str  # "missing" | "wrong" | "tajweed"
    correction_urdu: str


class FeedbackResult(BaseModel):
    overall_score: int
    feedback_urdu: str
    errors: list[FeedbackError]
    encouragement_urdu: str


class AnalyzeResponse(BaseModel):
    session_id: str
    transcribed_text: str
    matched_ayah_ref: str | None
    original_text: str | None
    similarity: float | None
    word_diff: list[WordDiffItem]
    tajweed_flags: list[TajweedFlag]
    feedback: FeedbackResult | None
    surah_name: str
    start_ayah: int
    end_ayah: int
    student_id: str


class ErrorResponse(BaseModel):
    error: str
    message: str
