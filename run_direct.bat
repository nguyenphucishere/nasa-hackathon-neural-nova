@echo off
REM Direct Python execution script using conda environment path
REM This script uses the direct Python path instead of conda run

SET PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo ================================================
echo   Bloom Forecasting System - Quick Start
echo   Using: %PYTHON_PATH%
echo ================================================
echo.

REM Check if Python exists
if not exist "%PYTHON_PATH%" (
    echo ERROR: Python not found at %PYTHON_PATH%
    echo Please check your conda environment path
    pause
    exit /b 1
)

echo [1/2] Checking Earth Engine authentication...
earthengine authenticate --quiet
if %errorlevel% neq 0 (
    echo.
    echo Please authenticate Earth Engine when prompted.
    earthengine authenticate
)

echo.
echo [2/2] Running workflow...
echo.

REM Get AOI name from user
set /p aoi_name="Enter AOI name (default: Ha_Giang_TamGiacMach): "
if "%aoi_name%"=="" set aoi_name=Ha_Giang_TamGiacMach

echo.
echo Running workflow for: %aoi_name%
echo.

%PYTHON_PATH% main.py --aoi %aoi_name% --models random_forest lstm

echo.
echo ================================================
echo   Workflow Complete!
echo ================================================
pause
