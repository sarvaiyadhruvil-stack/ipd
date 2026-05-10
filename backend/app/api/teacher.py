from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.core import security
from sqlalchemy import func

router = APIRouter()

def verify_teacher(current_user: models.User = Depends(security.get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access this.")
    return current_user

@router.get("/dashboard")
def get_teacher_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(verify_teacher)):
    total_submissions = db.query(models.Submission).count()
    
    avg_ai_prob = db.query(func.avg(models.Submission.ai_probability)).scalar() or 0
    
    high_risk_count = db.query(models.Submission).filter(models.Submission.ai_probability >= 70).count()
    
    return {
        "total_submissions": total_submissions,
        "average_ai_probability": round(avg_ai_prob, 2),
        "high_risk_submissions_count": high_risk_count
    }

@router.get("/submissions")
def get_all_submissions(db: Session = Depends(get_db), current_user: models.User = Depends(verify_teacher)):
    submissions = db.query(models.Submission).order_by(models.Submission.created_at.desc()).all()
    
    result = []
    for sub in submissions:
        student = db.query(models.User).filter(models.User.id == sub.user_id).first()
        result.append({
            "id": sub.id,
            "student_name": student.name if student else "Unknown",
            "file_name": sub.file_name,
            "ai_probability": sub.ai_probability,
            "human_probability": sub.human_probability,
            "confidence_level": sub.confidence_level,
            "created_at": sub.created_at
        })
        
    return result
