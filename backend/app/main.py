from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, uploads, reports, teacher
from app.core.database import Base, engine

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Score Detector API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(teacher.router, prefix="/api/teacher", tags=["Teacher"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "API is running."}
