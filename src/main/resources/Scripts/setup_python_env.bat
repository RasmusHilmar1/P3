@echo off
echo Setting up Python environment...

REM Check if venv folder exists in the root directory; if not, create it
if not exist "..\..\..\..\venv" (
    echo Creating virtual environment...
    python -m venv ..\..\..\..\venv
) else (
    echo Virtual environment already exists.
)

REM Activate the virtual environment
call ..\..\..\..\venv\Scripts\activate

REM Install dependencies from requirements.txt in the Scripts folder
echo Installing dependencies...
pip install -r requirements.txt

echo Python environment setup complete.
pause
