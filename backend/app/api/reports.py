import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.core import security
from app.services.report_service import generate_pdf_report

router = APIRouter()

@router.get("/{submission_id}/pdf")
def get_report_pdf(submission_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(security.get_current_user)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission.user_id != current_user.id and current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")

    report_path = generate_pdf_report(submission)
    
    if not os.path.exists(report_path):
        raise HTTPException(status_code=500, detail="Report generation failed")

    return FileResponse(
        path=report_path, 
        filename=f"Report_{submission.file_name}.pdf",
        media_type="application/pdf"
    )
