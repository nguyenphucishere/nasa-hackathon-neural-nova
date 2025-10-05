@echo off
REM ========================================
REM 30-DAY BLOOM CONDITION FORECAST
REM Dự báo điều kiện nở hoa 30 ngày
REM ========================================

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   30-DAY BLOOM CONDITION FORECAST
echo   Du bao dieu kien no hoa 30 ngay
echo ================================================
echo.
echo Chon loai hoa / Select flower species:
echo   1. Tam Giac Mach (Ha Giang)
echo   2. Hoa Man (Moc Chau)
echo   3. Hoa Do Quyen (Hoang Lien Son/Fansipan)
echo   4. Hoa Do Quyen (Lao Cai/Putaleng)
echo   5. TAT CA - Chay het tat ca loai (All species)
echo.
set /p choice="Nhap lua chon (1/2/3/4/5): "

REM Get current date in YYYY-MM-DD format
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TODAY=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

echo.
echo Ngay bat dau: %TODAY% (hom nay)
echo Se du bao: 30 ngay tiep theo
echo Top hotspots moi ngay: 50
echo.
set /p confirm="Tiep tuc? (Y/N): "
if /i not "%confirm%"=="Y" goto end

if "%choice%"=="1" goto tam_giac_mach
if "%choice%"=="2" goto hoa_man
if "%choice%"=="3" goto do_quyen_hoang_lien
if "%choice%"=="4" goto do_quyen_lao_cai
if "%choice%"=="5" goto all_species
echo Lua chon khong hop le!
pause
exit

:tam_giac_mach
echo.
echo ================================================
echo   TAM GIAC MACH - 30 DAY FORECAST
echo   Du bao 30 ngay
echo ================================================

%PYTHON% main.py ^
  --aoi Ha_Giang_TamGiacMach ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

echo.
echo ✅ HOAN THANH! Xem ket qua:
echo    Time-series: outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson
echo    Map (ngay cuoi): outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html
goto end

:hoa_man
echo.
echo ================================================
echo   HOA MAN - 30 DAY FORECAST
echo ================================================

%PYTHON% main.py ^
  --aoi Moc_Chau_Prunus ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

echo.
echo ✅ HOAN THANH!
goto end

:do_quyen_hoang_lien
echo.
echo ================================================
echo   HOA DO QUYEN (FANSIPAN) - 30 DAY FORECAST
echo ================================================

%PYTHON% main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

echo.
echo ✅ HOAN THANH!
goto end

:do_quyen_lao_cai
echo.
echo ================================================
echo   HOA DO QUYEN (LAO CAI) - 30 DAY FORECAST
echo ================================================

%PYTHON% main.py ^
  --aoi Lao_Cai_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

echo.
echo ✅ HOAN THANH!
goto end

:all_species
echo.
echo ================================================
echo   CHAY TAT CA LOAI HOA - RUN ALL SPECIES
echo   This will take 30-60 minutes...
echo ================================================
echo.

REM 1. Tam Giac Mach
echo.
echo [1/4] TAM GIAC MACH - HA GIANG
echo ================================================
%PYTHON% main.py ^
  --aoi Ha_Giang_TamGiacMach ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Error running Tam Giac Mach prediction
) else (
    echo ✅ Tam Giac Mach completed!
    echo Merging daily files...
    %PYTHON% merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
    echo ✅ Merged Ha_Giang_TamGiacMach
)

REM 2. Hoa Man
echo.
echo [2/4] HOA MAN - MOC CHAU
echo ================================================
%PYTHON% main.py ^
  --aoi Moc_Chau_Prunus ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Error running Hoa Man prediction
) else (
    echo ✅ Hoa Man completed!
    echo Merging daily files...
    %PYTHON% merge_daily_geojson.py --aoi Moc_Chau_Prunus
    echo ✅ Merged Moc_Chau_Prunus
)

REM 3. Do Quyen Fansipan
echo.
echo [3/4] DO QUYEN - FANSIPAN
echo ================================================
%PYTHON% main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Error running Do Quyen Fansipan prediction
) else (
    echo ✅ Do Quyen Fansipan completed!
    echo Merging daily files...
    %PYTHON% merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
    echo ✅ Merged Hoang_Lien_Rhododendron
)

REM 4. Do Quyen Lao Cai
echo.
echo [4/4] DO QUYEN - LAO CAI (PUTALENG)
echo ================================================
%PYTHON% main.py ^
  --aoi Lao_Cai_Rhododendron ^
  --date-start %TODAY% ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Error running Do Quyen Lao Cai prediction
) else (
    echo ✅ Do Quyen Lao Cai completed!
    echo Merging daily files...
    %PYTHON% merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
    echo ✅ Merged Lao_Cai_Rhododendron
)

echo.
echo ================================================
echo   ALL SPECIES COMPLETED!
echo ================================================
echo.
echo ✅ Tat ca 4 loai hoa da hoan thanh!
echo.
echo Ket qua:
echo   - outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson
echo   - outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_timeseries.geojson
echo   - outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_timeseries.geojson
echo   - outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_timeseries.geojson
echo.
echo Muon xem web? Chay: setup_web.bat
echo.
goto end

:end
pause
