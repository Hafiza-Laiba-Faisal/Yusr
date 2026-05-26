"""
Database setup — async SQLAlchemy engine, sessions table, and CRUD helpers.
"""

import uuid
import json
import logging
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    DateTime,
    text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

logger = logging.getLogger(__name__)

engine = None
async_session_factory = None


class Base(DeclarativeBase):
    pass


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String(255), nullable=False, index=True)
    surah_name = Column(String(255), nullable=False)
    start_ayah = Column(Integer, nullable=False)
    end_ayah = Column(Integer, nullable=False)
    transcribed_text = Column(Text, nullable=True)
    original_text = Column(Text, nullable=True)
    similarity_score = Column(Float, nullable=True)
    overall_score = Column(Integer, nullable=True)
    feedback_json = Column(JSONB, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("NOW()"),
    )


async def init_db(database_url: str) -> None:
    """Create engine, session factory, and ensure tables exist."""
    global engine, async_session_factory

    engine = create_async_engine(database_url, echo=False)
    async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database initialised — tables created.")


async def save_session(
    student_id: str,
    surah_name: str,
    start_ayah: int,
    end_ayah: int,
    transcribed_text: str | None,
    original_text: str | None,
    similarity_score: float | None,
    overall_score: int | None,
    feedback_json: dict | None,
) -> str:
    """Insert a new session record and return its UUID."""
    session_id = uuid.uuid4()

    async with async_session_factory() as db:
        row = Session(
            id=session_id,
            student_id=student_id,
            surah_name=surah_name,
            start_ayah=start_ayah,
            end_ayah=end_ayah,
            transcribed_text=transcribed_text,
            original_text=original_text,
            similarity_score=similarity_score,
            overall_score=overall_score,
            feedback_json=feedback_json,
        )
        db.add(row)
        await db.commit()

    logger.info("Saved session %s for student %s", session_id, student_id)
    return str(session_id)


async def get_progress(student_id: str) -> list[dict]:
    """Return session history for a student, ordered by date desc."""
    async with async_session_factory() as db:
        result = await db.execute(
            text(
                """
                SELECT surah_name, overall_score, created_at, transcribed_text
                FROM sessions
                WHERE student_id = :sid
                ORDER BY created_at DESC
                """
            ),
            {"sid": student_id},
        )
        rows = result.fetchall()

    return [
        {
            "surah_name": r.surah_name,
            "score": r.overall_score,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "transcribed_text": r.transcribed_text,
        }
        for r in rows
    ]


async def get_stats(student_id: str) -> dict:
    """Return aggregated stats for a student: totals, averages, streak, weekly."""
    from datetime import date, timedelta

    async with async_session_factory() as db:
        # Aggregate stats
        agg = await db.execute(
            text("""
                SELECT COUNT(*) as total_sessions,
                       COALESCE(AVG(overall_score), 0) as avg_score,
                       COALESCE(MAX(overall_score), 0) as best_score
                FROM sessions WHERE student_id = :sid
            """),
            {"sid": student_id},
        )
        row = agg.fetchone()

        # Weekly breakdown
        weekly_res = await db.execute(
            text("""
                SELECT DATE(created_at) as day, COUNT(*) as sessions,
                       COALESCE(AVG(overall_score), 0) as avg_score
                FROM sessions
                WHERE student_id = :sid AND created_at > NOW() - INTERVAL '7 days'
                GROUP BY DATE(created_at) ORDER BY day
            """),
            {"sid": student_id},
        )
        weekly = [
            {"day": r.day.isoformat(), "sessions": r.sessions, "avg_score": round(r.avg_score)}
            for r in weekly_res.fetchall()
        ]

        # Streak calculation
        streak_res = await db.execute(
            text("""
                SELECT DISTINCT DATE(created_at) as day
                FROM sessions WHERE student_id = :sid
                ORDER BY day DESC
            """),
            {"sid": student_id},
        )
        days = [r.day for r in streak_res.fetchall()]
        streak = 0
        today = date.today()
        for i, d in enumerate(days):
            expected = today - timedelta(days=i)
            if d == expected:
                streak += 1
            else:
                break

    return {
        "total_sessions": row.total_sessions,
        "avg_score": round(row.avg_score),
        "best_score": row.best_score,
        "streak": streak,
        "weekly": weekly,
    }
