@echo off
REM ========================================
REM PARALLEL PREDICTION - GPU OPTIMIZED
REM Chạy song song 4 loài trên GPU
REM ========================================

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   GPU-OPTIMIZED PARALLEL PREDICTION
echo   Chay song song 4 loai hoa tren GPU
echo ================================================
echo.

REM Get current date
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TODAY=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

echo Start time: %TIME%
echo Date: %TODAY%
echo.
echo This will run ALL 4 species in parallel!
echo Using GPU for LSTM/GRU models
echo Estimated time: 10-15 minutes (with GPU)
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" goto end

echo.
echo ================================================
echo   STARTING PARALLEL PREDICTIONS...
echo ================================================
echo.

REM Start all 4 predictions in parallel using PowerShell jobs
powershell -Command "& {$jobs = @(); $jobs += Start-Job -ScriptBlock {C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --date-start %TODAY% --models random_forest lstm gru --top-n 50 --threshold 0.5}; $jobs += Start-Job -ScriptBlock {C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Moc_Chau_Prunus --date-start %TODAY% --models random_forest lstm gru --top-n 50 --threshold 0.5}; $jobs += Start-Job -ScriptBlock {C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Hoang_Lien_Rhododendron --date-start %TODAY% --models random_forest lstm gru --top-n 50 --threshold 0.6}; $jobs += Start-Job -ScriptBlock {C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Lao_Cai_Rhododendron --date-start %TODAY% --models random_forest lstm gru --top-n 50 --threshold 0.6}; Write-Host 'All jobs started! Waiting for completion...'; $jobs | Wait-Job | Receive-Job; $jobs | Remove-Job}"

if errorlevel 1 (
    echo ❌ Some predictions failed!
    goto end
)

echo.
echo ================================================
echo   MERGING FILES...
echo ================================================
echo.

REM Merge all species
echo Merging Ha_Giang_TamGiacMach...
%PYTHON% merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
echo.

echo Merging Moc_Chau_Prunus...
%PYTHON% merge_daily_geojson.py --aoi Moc_Chau_Prunus
echo.

echo Merging Hoang_Lien_Rhododendron...
%PYTHON% merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
echo.

echo Merging Lao_Cai_Rhododendron...
%PYTHON% merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
echo.

echo.
echo ================================================
echo   ✅ ALL COMPLETE!
echo ================================================
echo.
echo End time: %TIME%
echo.
echo All 4 species predicted and merged!
echo.
echo Output files:
echo   - Ha_Giang_TamGiacMach_hotspots_timeseries.geojson
echo   - Moc_Chau_Prunus_hotspots_timeseries.geojson
echo   - Hoang_Lien_Rhododendron_hotspots_timeseries.geojson
echo   - Lao_Cai_Rhododendron_hotspots_timeseries.geojson
echo.

:end
pause
