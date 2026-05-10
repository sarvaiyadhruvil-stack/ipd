import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from app.core.config import settings
from app.models import models

def generate_pdf_report(submission: models.Submission) -> str:
    report_filename = f"report_{submission.id}.pdf"
    report_path = os.path.join(settings.REPORT_DIR, report_filename)

    c = canvas.Canvas(report_path, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "AI Score Detector - Analysis Report")

    # Details
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 90, f"Submission ID: {submission.id}")
    c.drawString(50, height - 110, f"File Name: {submission.file_name}")
    c.drawString(50, height - 130, f"Upload Date: {submission.created_at.strftime('%Y-%m-%d %H:%M:%S')}")

    # Scores
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 160, "Analysis Results")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 180, f"AI Probability: {submission.ai_probability}%")
    c.drawString(50, height - 200, f"Human Probability: {submission.human_probability}%")
    c.drawString(50, height - 220, f"Confidence Level: {submission.confidence_level}")
    c.drawString(50, height - 240, f"Reliability Score: {submission.reliability_score}/100")

    # Disclaimer
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(colors.red)
    disclaimer = "Disclaimer: This report provides probability-based writing pattern analysis. It should not be treated as absolute proof of AI-generated content. Human review is recommended before making academic or professional decisions."
    
    import textwrap
    wrapped_disclaimer = textwrap.wrap(disclaimer, width=80)
    y_pos = height - 280
    for line in wrapped_disclaimer:
        c.drawString(50, y_pos, line)
        y_pos -= 15

    c.save()
    return report_path
