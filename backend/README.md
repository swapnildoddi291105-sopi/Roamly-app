# CitySmart Pune Backend

FastAPI backend server for the CitySmart Pune application.

## Prerequisites
- Python 3.9+
- pip

## Quick Start

### 1. Set up Virtual Environment & Install Dependencies
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if not already present:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` and `GEMINI_MODEL` are configured in `backend/.env`.

### 3. Run the Development Server
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
The API server will run at `http://127.0.0.1:8000`.

### 4. Run Smoke Tests
In a separate terminal (with the backend server running):
```bash
python smoke_test.py
```
