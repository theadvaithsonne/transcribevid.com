@echo off
cd /d "%~dp0"
if not exist .venv (
  echo Creating virtual environment...
  python -m venv .venv || (echo Python 3.9+ is required. Install from https://www.python.org/downloads/ and tick "Add to PATH". & pause & exit /b 1)
  call .venv\Scripts\activate.bat
  echo Installing dependencies (one-time, a few minutes)...
  python -m pip install --upgrade pip
  pip install -r requirements.txt
) else (
  call .venv\Scripts\activate.bat
)
python app.py
pause
