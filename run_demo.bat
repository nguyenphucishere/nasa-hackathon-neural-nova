@echo off
REM Test script using direct Python path

SET PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo ================================================
echo   Running Demo Test
echo   Python: %PYTHON_PATH%
echo ================================================
echo.

if not exist "%PYTHON_PATH%" (
    echo ERROR: Python not found!
    pause
    exit /b 1
)

%PYTHON_PATH% demo.py

pause
