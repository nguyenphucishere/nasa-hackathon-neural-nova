@echo off
REM ========================================
REM BLOOM FORECASTING FOR 4 SPECIES
REM Du bao hoa cho 4 loai hoa
REM ========================================

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   BLOOM FORECASTING SYSTEM - TAY BAC VIETNAM
echo   He thong du bao nho hoa - Tay Bac Viet Nam
echo ================================================
echo.
echo Chon loai hoa / Select flower species:
echo   1. Tam Giac Mach (Ha Giang) - October-December
echo   2. Hoa Man (Moc Chau) - Late January-February
echo   3. Hoa Do Quyen (Hoang Lien Son) - March-May
echo   4. Hoa Do Quyen (Lao Cai) - March-June
echo   5. ALL - Chay tat ca loai
echo.
set /p choice="Nhap lua chon (1/2/3/4/5): "

if "%choice%"=="1" goto tam_giac_mach
if "%choice%"=="2" goto hoa_man
if "%choice%"=="3" goto do_quyen_hoang_lien
if "%choice%"=="4" goto do_quyen_lao_cai
if "%choice%"=="5" goto run_all
echo Lua chon khong hop le!
pause
exit

:tam_giac_mach
echo.
echo ================================================
echo   TAM GIAC MACH - HA GIANG
echo   Bloom: October-December, Peak: November
echo ================================================
set /p date1="Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: "

if "%date1%"=="" (
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru --threshold 0.5
) else (
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date %date1% --models random_forest lstm gru --threshold 0.5
)

echo.
echo ✅ HOAN THANH! Xem ket qua:
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
goto end

:hoa_man
echo.
echo ================================================
echo   HOA MAN (PRUNUS MUME) - MOC CHAU
echo   Bloom: Late Jan-Feb, Peak: 7-10 days
echo   Scientific: Requires cold winter, agricultural orchards
echo ================================================
set /p date2="Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: "

if "%date2%"=="" (
    %PYTHON% main.py --aoi Moc_Chau_Prunus --models random_forest lstm cnn_lstm --threshold 0.7
) else (
    %PYTHON% main.py --aoi Moc_Chau_Prunus --date %date2% --models random_forest lstm cnn_lstm --threshold 0.7
)

echo.
echo ✅ HOAN THANH! Xem ket qua:
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
goto end

:do_quyen_hoang_lien
echo.
echo ================================================
echo   HOA DO QUYEN - HOANG LIEN SON (FANSIPAN)
echo   Bloom: March-May, Peak: April
echo   Scientific: Elevation 1500-3200m, acidic soil, shade-tolerant
echo ================================================
echo.
echo Note: cnn3d_lstm will fallback to lstm (full implementation coming soon)
echo.
set /p date3="Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: "

if "%date3%"=="" (
    %PYTHON% main.py --aoi Hoang_Lien_Rhododendron --models random_forest lstm cnn3d_lstm --threshold 0.6
) else (
    %PYTHON% main.py --aoi Hoang_Lien_Rhododendron --date %date3% --models random_forest lstm cnn3d_lstm --threshold 0.6
)

echo.
echo ✅ HOAN THANH! Xem ket qua:
Start-Process "outputs\visualizations\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_map.html"
goto end

:do_quyen_lao_cai
echo.
echo ================================================
echo   HOA DO QUYEN - LAO CAI (PUTALENG)
echo   Bloom: March-June, Peak: April
echo   Scientific: Elevation 2000-3400m, natural forest
echo ================================================
echo.
echo Note: cnn3d_lstm will fallback to lstm (full implementation coming soon)
echo.
set /p date4="Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: "

if "%date4%"=="" (
    %PYTHON% main.py --aoi Lao_Cai_Rhododendron --models random_forest lstm cnn3d_lstm --threshold 0.6
) else (
    %PYTHON% main.py --aoi Lao_Cai_Rhododendron --date %date4% --models random_forest lstm cnn3d_lstm --threshold 0.6
)

echo.
echo ✅ HOAN THANH! Xem ket qua:
Start-Process "outputs\visualizations\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_map.html"
goto end

:run_all
echo.
echo ================================================
echo   CHAY TAT CA 4 LOAI HOA
echo   Running all 4 flower species
echo ================================================
set /p date_all="Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: "

echo.
echo [1/4] Tam Giac Mach - Ha Giang...
if "%date_all%"=="" (
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm --threshold 0.5
) else (
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date %date_all% --models random_forest lstm --threshold 0.5
)

echo.
echo [2/4] Hoa Man - Moc Chau...
if "%date_all%"=="" (
    %PYTHON% main.py --aoi Moc_Chau_Prunus --models random_forest lstm --threshold 0.7
) else (
    %PYTHON% main.py --aoi Moc_Chau_Prunus --date %date_all% --models random_forest lstm --threshold 0.7
)

echo.
echo [3/4] Hoa Do Quyen - Hoang Lien Son...
if "%date_all%"=="" (
    %PYTHON% main.py --aoi Hoang_Lien_Rhododendron --models random_forest lstm --threshold 0.6
) else (
    %PYTHON% main.py --aoi Hoang_Lien_Rhododendron --date %date_all% --models random_forest lstm --threshold 0.6
)

echo.
echo [4/4] Hoa Do Quyen - Lao Cai...
if "%date_all%"==" " (
    %PYTHON% main.py --aoi Lao_Cai_Rhododendron --models random_forest lstm --threshold 0.6
) else (
    %PYTHON% main.py --aoi Lao_Cai_Rhododendron --date %date_all% --models random_forest lstm --threshold 0.6
)

echo.
echo ✅ HOAN THANH TAT CA 4 LOAI!
echo.
echo Mo tat ca ban do:
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
timeout /t 2
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
timeout /t 2
Start-Process "outputs\visualizations\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_map.html"
timeout /t 2
Start-Process "outputs\visualizations\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_map.html"
goto end

:end
echo.
echo ================================================
pause

echo.
echo ✅ HOAN THANH CA 2 LOAI!
echo.
echo Mo ban do:
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
timeout /t 2 /nobreak >nul
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"

:end
echo.
echo ================================================
echo   KET QUA
echo ================================================
echo.
echo 📁 Ban do HTML: outputs\visualizations\[AOI]\*_hotspots_map.html
echo 📊 Hotspots CSV: outputs\hotspots\[AOI]\*_hotspots.csv
echo 🗺️  GeoJSON:     outputs\hotspots\[AOI]\*_hotspots.geojson
echo.
pause
