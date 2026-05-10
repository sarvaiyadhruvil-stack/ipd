# AI Score Detector for PDF and Image Files

A robust 40% MVP of an AI detection system designed to analyze student submissions (PDFs and Images) and provide a heuristic probability score of AI generation.

## Features Implemented in 40% MVP

- **Authentication System**: Role-based access for students and teachers (JWT protected).
- **Dashboard**: Unique dashboards for students (history) and teachers (all submissions overview).
- **File Uploads**: Drag-and-drop file uploader supporting `.pdf`, `.png`, `.jpg`, `.jpeg`.
- **Text Extraction**: Automatic text extraction via `pdfplumber` (PDFs) and `pytesseract` (Images).
- **AI Detection Engine (Heuristic)**: 
  - Sentence length consistency (burstiness).
  - Common AI transition phrase detection.
  - Prompt leakage identification.
  - Vocabulary diversity calculations.
- **Sentence-Level Analysis**: Color-coded sentence highlighting based on risk (Low/Medium/High).
- **Report Generation**: Instant downloadable PDF reports built with `ReportLab`.
- **Local Database**: SQLite setup without external database dependencies for easy local testing.

## Future Features (Pending 60%)

- [ ] Real BERT/RoBERTa machine learning model for accurate pattern recognition.
- [ ] MongoDB migration for scalable data storage.
- [ ] Writing Fingerprint Engine (comparing student's previous writing styles).
- [ ] Citation Hallucination Checker.
- [ ] Advanced Humanizer / Evasion Detection.
- [ ] LMS Integration & Cloud Deployment.

## Tech Stack

**Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Dropzone, Lucide
**Backend**: Python, FastAPI, Uvicorn, SQLAlchemy, SQLite, JWT Auth
**File Processing**: pdfplumber, PyPDF2, Pillow, pytesseract, ReportLab

---

## Folder Structure

```
project-root/
│
├── frontend/         # React Application
│   ├── src/          # Source code
│   └── package.json  # NPM Dependencies
│
├── backend/          # FastAPI Application
│   ├── app/          # App modules (api, core, models, schemas, services)
│   ├── requirements.txt # Python Dependencies
│   └── .env.example  # Environment variables
│
└── README.md
```

---

## Setup & Run Instructions

### 1. Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
5. Seed the database with demo users:
   ```bash
   python -m app.seed
   ```
6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at the local URL provided by Vite (usually `http://localhost:5173`)*

---

## System Requirements for Image OCR (Important)

If you plan to test image uploads (`.png`, `.jpg`), you must install **Tesseract OCR** on your system.

- **Windows**: Download the installer from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and ensure the installation path is added to your System's PATH environment variables.
- **macOS**: `brew install tesseract`
- **Linux (Ubuntu/Debian)**: `sudo apt install tesseract-ocr`

*Note: If Tesseract is not installed, PDF uploads will still work perfectly. If an image is uploaded without Tesseract, the app will gracefully return a friendly error message without crashing.*

---

## Demo Credentials

You can use the following credentials to test the application after running the `seed` command:

**Student Account:**
- **Email**: `student@example.com`
- **Password**: `Student@123`

**Teacher Account:**
- **Email**: `teacher@example.com`
- **Password**: `Teacher@123`

## Disclaimer

This MVP uses a heuristic AI scoring engine, not a trained transformer model. It is built for academic demonstration and can later be upgraded with RoBERTa/BERT. It provides probability-based writing pattern analysis and should not be treated as absolute proof. Human review is always recommended.
"# ipd" 
