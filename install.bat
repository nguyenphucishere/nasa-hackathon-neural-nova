@echo off
REM Install dependencies using direct Python path

SET PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo ================================================
echo   Installing Dependencies
echo   Python: %PYTHON_PATH%
echo ================================================
echo.

if not exist "%PYTHON_PATH%" (
    echo ERROR: Python not found at %PYTHON_PATH%
    echo Please update PYTHON_PATH in this script
    pause
    exit /b 1
)

echo Installing packages from requirements.txt...
echo This may take 10-15 minutes...
echo.

%PYTHON_PATH% -m pip install -r requirements.txt --upgrade

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Installation Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Authenticate Earth Engine: earthengine authenticate
echo   2. Run demo: run_demo.bat
echo   3. Run workflow: run_direct.bat
echo.
pause
