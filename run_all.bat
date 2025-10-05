@echo off
REM ========================================
REM FULL WORKFLOW: Predict All + Merge + Web
REM Quy trình đầy đủ: Dự báo tất cả + Gộp + Web
REM ========================================

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   FULL BLOOM PREDICTION WORKFLOW
echo   Quy trinh du bao day du
echo ================================================
echo.
echo This will:
echo   1. Run predictions for ALL 4 flower species
echo   2. Merge daily files into timeseries
echo   3. Copy files to web folder
echo   4. Start web server
echo.
echo Estimated time: 30-60 minutes
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" goto end

REM Get current date
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TODAY=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

echo.
echo ================================================
echo   STEP 1/4: TAM GIAC MACH (HA GIANG)
echo ================================================
echo Start time: %TIME%
%PYTHON% main.py ^
  --aoi Ha_Giang_TamGiacMach ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Failed: Tam Giac Mach
    goto end
)
echo ✅ Prediction completed
echo Merging files...
%PYTHON% merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
echo ✅ Merged: Ha_Giang_TamGiacMach
echo.

echo.
echo ================================================
echo   STEP 2/4: HOA MAN (MOC CHAU)
echo ================================================
echo Start time: %TIME%
%PYTHON% main.py ^
  --aoi Moc_Chau_Prunus ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Failed: Hoa Man
    goto end
)
echo ✅ Prediction completed
echo Merging files...
%PYTHON% merge_daily_geojson.py --aoi Moc_Chau_Prunus
echo ✅ Merged: Moc_Chau_Prunus
echo.

echo.
echo ================================================
echo   STEP 3/4: DO QUYEN (FANSIPAN)
echo ================================================
echo Start time: %TIME%
%PYTHON% main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Failed: Do Quyen Fansipan
    goto end
)
echo ✅ Prediction completed
echo Merging files...
%PYTHON% merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
echo ✅ Merged: Hoang_Lien_Rhododendron
echo.

echo.
echo ================================================
echo   STEP 4/4: DO QUYEN (LAO CAI)
echo ================================================
echo Start time: %TIME%
%PYTHON% main.py ^
  --aoi Lao_Cai_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Failed: Do Quyen Lao Cai
    goto end
)
echo ✅ Prediction completed
echo Merging files...
%PYTHON% merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
echo ✅ Merged: Lao_Cai_Rhododendron
echo.

echo.
echo ================================================
echo   SETTING UP WEB APPLICATION
echo ================================================
call setup_web.bat nopause

echo.
echo ================================================
echo   ✅ ALL COMPLETE! TAT CA HOAN THANH!
echo ================================================
echo.
echo Generated files:
echo   [1] Ha_Giang_TamGiacMach_hotspots_timeseries.geojson
echo   [2] Moc_Chau_Prunus_hotspots_timeseries.geojson
echo   [3] Hoang_Lien_Rhododendron_hotspots_timeseries.geojson
echo   [4] Lao_Cai_Rhododendron_hotspots_timeseries.geojson
echo.
echo All files copied to: web\
echo.
echo ================================================
echo   STARTING WEB SERVER...
echo ================================================
echo.
echo Opening browser at http://localhost:8000
echo Press Ctrl+C to stop server
echo.

REM Start web server
cd web
start http://localhost:8000
%PYTHON% -m http.server 8000

goto end

:end
echo.
echo Script ended.
pause
