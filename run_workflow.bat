@echo off
REM Quick start script for Bloom Forecasting System
REM Run this after installing dependencies

echo ================================================
echo   Bloom Forecasting System - Quick Start
echo ================================================
echo.

REM Check if conda environment exists
conda env list | findstr "plantgpu" >nul
if %errorlevel% neq 0 (
    echo ERROR: Conda environment 'plantgpu' not found!
    echo Please create it first: conda create -n plantgpu python=3.10
    pause
    exit /b 1
)

echo [1/3] Activating conda environment...
call conda activate plantgpu

echo.
echo [2/3] Checking Earth Engine authentication...
earthengine authenticate --quiet
if %errorlevel% neq 0 (
    echo.
    echo Please authenticate Earth Engine when prompted.
    earthengine authenticate
)

echo.
echo [3/3] Running bloom forecasting workflow...
echo.
echo Available AOIs:
echo   - Ha_Giang_TamGiacMach
echo   - Moc_Chau_Prunus
echo.

set /p aoi_name="Enter AOI name (default: Ha_Giang_TamGiacMach): "
if "%aoi_name%"=="" set aoi_name=Ha_Giang_TamGiacMach

echo.
echo Running workflow for: %aoi_name%
echo.

python main.py --aoi %aoi_name% --models random_forest lstm

echo.
echo ================================================
echo   Workflow Complete!
echo ================================================
echo.
echo Check outputs in the 'outputs' folder:
dir outputs /s /b
echo.
pause
