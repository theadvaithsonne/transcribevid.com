# Video Transcriber

Turns any video/audio file into a timestamped transcript (TXT or SRT subtitles).
Runs 100% locally on your computer using OpenAI Whisper (via faster-whisper).
No internet needed after the first run (the model downloads once, ~460 MB for "small").

## Quick start (Windows)
1. Install Python 3.9+ from https://www.python.org/downloads/ (tick **Add Python to PATH**).
2. Double-click **run.bat**. First run installs dependencies (a few minutes).
3. Your browser opens at http://127.0.0.1:5000 - drop a video, click **Transcribe**.

## Quick start (Mac / Linux)
    ./run.sh

## Build a Windows .exe
Double-click **build_exe.bat**. Output: `dist\VideoTranscriber\VideoTranscriber.exe`.
Zip and share that whole folder - the person receiving it does NOT need Python.

## Command line
    python cli.py V-5.mp4                 # print timestamped transcript
    python cli.py V-5.mp4 --srt -o V-5.srt
    python cli.py V-5.mp4 --model medium --lang en

## Models
tiny < base < small (default) < medium < large-v3 : accuracy up, speed down.
For a 5-minute video, "small" takes roughly 1-2 minutes on a normal laptop CPU.

## Files
- app.py           Flask web app (upload, progress, download TXT/SRT)
- transcriber.py   core logic (ffmpeg decode -> faster-whisper)
- cli.py           command-line version
- templates/index.html   the web page
- run.bat / run.sh       one-click launchers
- build_exe.bat          PyInstaller packaging
