@echo off
REM ========================================
REM ANALYZE 30-DAY FORECAST RESULTS
REM Phan tich ket qua du bao 30 ngay
REM ========================================

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   ANALYZE 30-DAY FORECAST RESULTS
echo   Phan tich ket qua du bao 30 ngay
echo ================================================
echo.

REM Check if analysis script exists
if not exist "analyze_30day_forecast.py" (
    echo ❌ Error: analyze_30day_forecast.py not found!
    pause
    exit
)

REM List available AOI directories
echo Cac AOI co san:
echo.
dir /b /ad outputs\hotspots 2>nul
echo.

set /p aoi="Nhap ten AOI (hoac Enter de dung mac dinh): "

if "%aoi%"=="" (
    REM Try to find most recent
    echo.
    echo Dang tim AOI moi nhat...
    
    REM Default to Ha Giang if exists
    if exist "outputs\hotspots\Ha_Giang_TamGiacMach" (
        set aoi=Ha_Giang_TamGiacMach
        echo Tim thay: %aoi%
    ) else if exist "outputs\hotspots\Hoang_Lien_Rhododendron" (
        set aoi=Hoang_Lien_Rhododendron
        echo Tim thay: %aoi%
    ) else (
        echo ❌ Khong tim thay AOI nao!
        echo    Chay predict_30days.bat truoc de tao data.
        pause
        exit
    )
)

set input_dir=outputs\hotspots\%aoi%

if not exist "%input_dir%" (
    echo ❌ Khong tim thay: %input_dir%
    pause
    exit
)

echo.
echo ================================================
echo   ANALYZING: %aoi%
echo   Input: %input_dir%
echo ================================================
echo.

%PYTHON% analyze_30day_forecast.py --input "%input_dir%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ PHAN TICH THANH CONG!
    echo.
    echo Xem ket qua tai: outputs\analysis\%aoi%\
    echo.
    
    REM Ask to open results
    set /p openresults="Mo ket qua? (Y/N): "
    if /i "%openresults%"=="Y" (
        if exist "outputs\analysis\%aoi%" (
            explorer "outputs\analysis\%aoi%"
        ) else (
            explorer "outputs\analysis"
        )
    )
) else (
    echo.
    echo ❌ CO LOI XAY RA!
    echo    Kiem tra lai AOI name va thu lai.
)

echo.
pause
