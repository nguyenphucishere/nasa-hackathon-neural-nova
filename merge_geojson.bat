@echo off
REM ============================================================================
REM Merge Daily GeoJSON Files
REM ============================================================================
REM Gộp 30 files GeoJSON riêng lẻ thành 1 meta file duy nhất
REM
REM Usage:
REM   .\merge_geojson.bat
REM   (sẽ prompt chọn AOI)
REM ============================================================================

echo.
echo ================================================================================
echo MERGE DAILY GEOJSON FILES
echo ================================================================================
echo.

REM Check if Python environment is activated
echo Checking Python environment...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe --version
if %errorlevel% neq 0 (
    echo ERROR: Python environment not found!
    pause
    exit /b 1
)
echo.

REM Prompt for AOI selection
echo Select AOI:
echo   1. Ha_Giang_TamGiacMach
echo   2. Moc_Chau_Prunus
echo   3. Hoang_Lien_Rhododendron
echo   4. Lao_Cai_Rhododendron
echo   5. TAT CA - Merge all species
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    set AOI=Ha_Giang_TamGiacMach
) else if "%choice%"=="2" (
    set AOI=Moc_Chau_Prunus
) else if "%choice%"=="3" (
    set AOI=Hoang_Lien_Rhododendron
) else if "%choice%"=="4" (
    set AOI=Lao_Cai_Rhododendron
) else if "%choice%"=="5" (
    goto merge_all
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo Selected AOI: %AOI%
echo.

REM Run merge script
echo Running merge script...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe merge_daily_geojson.py --aoi %AOI%

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Merge failed!
    pause
    exit /b 1
)

echo.
echo ================================================================================
echo MERGE COMPLETED!
echo ================================================================================
echo.
echo Output file: outputs\hotspots\%AOI%\%AOI%_hotspots_timeseries.geojson
echo.
echo Next steps:
echo   1. Load in QGIS: Drag and drop the file
echo   2. Filter by date: Properties ^> date field
echo   3. Create animation: Temporal Controller
echo.

goto end

:merge_all
echo.
echo ================================================================================
echo MERGING ALL SPECIES
echo ================================================================================
echo.

REM Merge Ha_Giang_TamGiacMach
echo [1/4] Merging Ha_Giang_TamGiacMach...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
if %errorlevel% neq 0 (
    echo ❌ Failed: Ha_Giang_TamGiacMach
) else (
    echo ✅ Success: Ha_Giang_TamGiacMach
)
echo.

REM Merge Moc_Chau_Prunus
echo [2/4] Merging Moc_Chau_Prunus...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe merge_daily_geojson.py --aoi Moc_Chau_Prunus
if %errorlevel% neq 0 (
    echo ❌ Failed: Moc_Chau_Prunus
) else (
    echo ✅ Success: Moc_Chau_Prunus
)
echo.

REM Merge Hoang_Lien_Rhododendron
echo [3/4] Merging Hoang_Lien_Rhododendron...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
if %errorlevel% neq 0 (
    echo ❌ Failed: Hoang_Lien_Rhododendron
) else (
    echo ✅ Success: Hoang_Lien_Rhododendron
)
echo.

REM Merge Lao_Cai_Rhododendron
echo [4/4] Merging Lao_Cai_Rhododendron...
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
if %errorlevel% neq 0 (
    echo ❌ Failed: Lao_Cai_Rhododendron
) else (
    echo ✅ Success: Lao_Cai_Rhododendron
)
echo.

echo.
echo ================================================================================
echo ALL SPECIES MERGED!
echo ================================================================================
echo.
echo Output files:
echo   - outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson
echo   - outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_timeseries.geojson
echo   - outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_timeseries.geojson
echo   - outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_timeseries.geojson
echo.
echo Next: Run setup_web.bat to copy files to web folder
echo.

goto end

:end
pause
