@echo off
REM ========================================
REM Setup Web Application
REM Copy GeoJSON files to web folder
REM ========================================

echo.
echo ========================================
echo   SETUP WEB APPLICATION
echo ========================================
echo.

REM Check if web folder exists
if not exist "web\" (
    echo ERROR: web folder not found!
    pause
    exit /b 1
)

REM Check if outputs folder exists
if not exist "outputs\hotspots\" (
    echo ERROR: outputs\hotspots folder not found!
    echo Please run predictions first.
    pause
    exit /b 1
)

echo Copying GeoJSON files to web folder...
echo.

REM Copy Ha Giang Tam Giac Mach
if exist "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson" (
    copy /Y "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson" "web\" >nul
    echo [OK] Ha_Giang_TamGiacMach
) else (
    echo [SKIP] Ha_Giang_TamGiacMach - File not found
)

REM Copy Moc Chau Prunus
if exist "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_timeseries.geojson" (
    copy /Y "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_timeseries.geojson" "web\" >nul
    echo [OK] Moc_Chau_Prunus
) else (
    echo [SKIP] Moc_Chau_Prunus - File not found
)

REM Copy Hoang Lien Rhododendron
if exist "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_timeseries.geojson" (
    copy /Y "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_timeseries.geojson" "web\" >nul
    echo [OK] Hoang_Lien_Rhododendron
) else (
    echo [SKIP] Hoang_Lien_Rhododendron - File not found
)

REM Copy Lao Cai Rhododendron
if exist "outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_timeseries.geojson" (
    copy /Y "outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_timeseries.geojson" "web\" >nul
    echo [OK] Lao_Cai_Rhododendron
) else (
    echo [SKIP] Lao_Cai_Rhododendron - File not found
)

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Files copied to web\ folder
echo.
echo To run the website:
echo   1. cd web
echo   2. python -m http.server 8000
echo   3. Open http://localhost:8000
echo.
echo Or use VS Code Live Server extension
echo.

REM Only pause if called directly (not from another script)
if "%1"=="" pause
