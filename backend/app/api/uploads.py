import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import schemas
from app.core import security
from app.core.config import settings
from app.services.file_service import validate_file, save_upload_file
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_from_image
from app.services.ai_detection_service import analyze_text
from typing import List

router = APIRouter()

@router.post("/analyze", response_model=schemas.SubmissionResult)
async def analyze_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    ext = validate_file(file)
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    save_upload_file(file, file_path)
    file_size = os.path.getsize(file_path)

    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    # Extract Text
    if ext == "pdf":
        text = extract_text_from_pdf(file_path)
    else:
        text = extract_text_from_image(file_path)

    # Analyze Text
    analysis_result = analyze_text(text)
    if "error" in analysis_result:
        raise HTTPException(status_code=400, detail=analysis_result["error"])

    # Save to Database
    submission = models.Submission(
        user_id=current_user.id,
        file_name=file.filename,
        file_type=ext,
        file_size=file_size,
        extracted_text=text,
        ai_probability=analysis_result["ai_probability"],
        human_probability=analysis_result["human_probability"],
        confidence_level=analysis_result["confidence_level"],
        reliability_score=analysis_result["reliability_score"],
        explanation_json=json.dumps(analysis_result["explanations"]),
        sentence_analysis_json=json.dumps(analysis_result["sentence_analysis"]),
        prompt_leakage_json=json.dumps(analysis_result["prompt_leakage_flags"])
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return schemas.SubmissionResult(
        submission_id=submission.id,
        file_name=submission.file_name,
        ai_probability=submission.ai_probability,
        human_probability=submission.human_probability,
        confidence_level=submission.confidence_level,
        reliability_score=submission.reliability_score,
        explanations=analysis_result["explanations"],
        prompt_leakage_flags=analysis_result["prompt_leakage_flags"],
        sentence_analysis=analysis_result["sentence_analysis"]
    )

@router.get("/my", response_model=List[schemas.SubmissionHistoryResponse])
def get_my_submissions(db: Session = Depends(get_db), current_user: models.User = Depends(security.get_current_user)):
    submissions = db.query(models.Submission).filter(models.Submission.user_id == current_user.id).order_by(models.Submission.created_at.desc()).all()
    return submissions

@router.get("/{submission_id}")
def get_submission(submission_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(security.get_current_user)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    if submission.user_id != current_user.id and current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {
        "submission_id": submission.id,
        "file_name": submission.file_name,
        "ai_probability": submission.ai_probability,
        "human_probability": submission.human_probability,
        "confidence_level": submission.confidence_level,
        "reliability_score": submission.reliability_score,
        "extracted_text": submission.extracted_text,
        "explanations": json.loads(submission.explanation_json),
        "prompt_leakage_flags": json.loads(submission.prompt_leakage_json),
        "sentence_analysis": json.loads(submission.sentence_analysis_json)
    }
