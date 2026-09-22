import json
import re
from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.database import get_db
from app.models.chapter import Chapter
from app.models.class_model import SchoolClass
from app.models.subject import Subject
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()


class QuizRequest(BaseModel):
    class_number: int = Field(..., ge=9, le=12)
    subject_name: str = Field(..., min_length=1, max_length=120)
    chapter_number: int = Field(..., ge=1)
    chapter_name: str = Field(..., min_length=1, max_length=200)
    question_count: int = Field(default=25, ge=25, le=25)
    difficulty: Literal["easy", "medium", "hard"] = "medium"


class QuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=4, max_length=4)
    answer: str
    explanation: str


class QuizResponse(BaseModel):
    chapter_name: str
    subject_name: str
    difficulty: str
    questions: list[QuizQuestion]


def _extract_json(response_data: dict) -> dict:
    try:
        text = response_data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail="Google returned an invalid quiz response.") from error


def _normalise_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


@router.post("/quizzes/generate", response_model=QuizResponse)
def generate_quiz(payload: QuizRequest, db: Session = Depends(get_db)):
    settings = get_settings()
    if not settings.google_gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Quiz generation is not configured. Add GOOGLE_GEMINI_API_KEY to backend/.env.",
        )

    school_class = db.query(SchoolClass).filter(SchoolClass.class_number == payload.class_number).first()
    subject = db.query(Subject).filter(
        Subject.class_id == school_class.id if school_class else False,
        Subject.subject_name == payload.subject_name,
    ).first()
    if not subject and school_class:
        subject = next(
            (
                candidate
                for candidate in db.query(Subject).filter(Subject.class_id == school_class.id).all()
                if _normalise_name(candidate.subject_name) == _normalise_name(payload.subject_name)
            ),
            None,
        )

    chapter = None
    if subject:
        chapter = db.query(Chapter).filter(
            Chapter.subject_id == subject.id,
            Chapter.chapter_number == payload.chapter_number,
        ).first()
        if not chapter:
            chapter = db.query(Chapter).filter(
                Chapter.subject_id == subject.id,
                Chapter.chapter_name == payload.chapter_name,
            ).first()
        if not chapter:
            chapter = next(
                (
                    candidate
                    for candidate in db.query(Chapter).filter(Chapter.subject_id == subject.id).all()
                    if _normalise_name(candidate.chapter_name) == _normalise_name(payload.chapter_name)
                ),
                None,
            )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found in the selected class and subject.")

    prompt = f"""Create exactly 25 multiple-choice questions for an Indian school student.
Class: {payload.class_number}
Subject: {payload.subject_name}
Chapter: {chapter.chapter_name}
Difficulty: {payload.difficulty}

Return only valid JSON with this exact shape:
{{"questions":[{{"question":"...","options":["A","B","C","D"],"answer":"the exact correct option text","explanation":"brief explanation"}}]}}
Every question must have exactly four distinct options, one correct answer, and an explanation grounded in the chapter. Cover different concepts from the chapter and avoid duplicate questions. Do not include markdown or extra keys."""

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.google_gemini_model}:generateContent"
    )
    request_body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.35,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = httpx.post(
            endpoint,
            params={"key": settings.google_gemini_api_key},
            json=request_body,
            timeout=45,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as error:
        raise HTTPException(status_code=502, detail="Google quiz generation failed.") from error
    except httpx.HTTPError as error:
        raise HTTPException(status_code=504, detail="Google quiz generation timed out.") from error

    generated = _extract_json(response.json())
    try:
        questions = [QuizQuestion.model_validate(question) for question in generated["questions"]]
    except (KeyError, TypeError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Google returned an invalid quiz format.") from error

    if len(questions) != payload.question_count:
        raise HTTPException(status_code=502, detail="Google returned an incomplete quiz.")
    if any(question.answer not in question.options for question in questions):
        raise HTTPException(status_code=502, detail="Google returned a quiz with an invalid answer.")

    return QuizResponse(
        chapter_name=chapter.chapter_name,
        subject_name=payload.subject_name,
        difficulty=payload.difficulty,
        questions=questions,
    )
