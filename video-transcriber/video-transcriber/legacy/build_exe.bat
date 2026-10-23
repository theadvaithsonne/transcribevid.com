@echo off
REM Builds a single-folder Windows app: dist\VideoTranscriber\VideoTranscriber.exe
cd /d "%~dp0"
if not exist .venv ( python -m venv .venv )
call .venv\Scripts\activate.bat
pip install -r requirements.txt pyinstaller
pyinstaller --noconfirm --clean --name VideoTranscriber ^
  --add-data "templates;templates" ^
  --collect-all faster_whisper ^
  --collect-all ctranslate2 ^
  --collect-all imageio_ffmpeg ^
  --collect-all tokenizers ^
  --collect-all huggingface_hub ^
  --hidden-import numpy ^
  app.py
echo.
echo Done. Your app is in dist\VideoTranscriber\ - run VideoTranscriber.exe
echo (You can zip that whole folder and share it; the Whisper model downloads on first run.)
pause
