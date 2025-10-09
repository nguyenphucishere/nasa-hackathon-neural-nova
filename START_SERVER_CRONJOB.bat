@echo off

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo.
echo ================================================
echo   GPU-OPTIMIZED PREDICTION STARTING
echo ================================================
echo.

REM Get current date
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TODAY=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

:start_prediction

echo Start time: %TIME%
echo Date: %TODAY%

echo.
echo ================================================
echo   [1/4] TAM GIAC MACH - HA GIANG
echo ================================================
%PYTHON% main.py ^
  --aoi Ha_Giang_TamGiacMach ^
  --date-start %TODAY% ^
  --models lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Failed
) else (
    echo ✅ Success - Merging...
    %PYTHON% merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
)
echo.

echo.
echo ================================================
echo   [2/4] HOA MAN - MOC CHAU
echo ================================================
%PYTHON% main.py ^
  --aoi Moc_Chau_Prunus ^
  --date-start %TODAY% ^
  --models lstm gru ^
  --top-n 50 ^
  --threshold 0.5

if errorlevel 1 (
    echo ❌ Failed
) else (
    echo ✅ Success - Merging...
    %PYTHON% merge_daily_geojson.py --aoi Moc_Chau_Prunus
)
echo.

echo.
echo ================================================
echo   [3/4] DO QUYEN - FANSIPAN
echo ================================================
%PYTHON% main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date-start %TODAY% ^
  --models lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Failed
) else (
    echo ✅ Success - Merging...
    %PYTHON% merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
)
echo.

echo.
echo ================================================
echo   [4/4] DO QUYEN - LAO CAI
echo ================================================
%PYTHON% main.py ^
  --aoi Lao_Cai_Rhododendron ^
  --date-start %TODAY% ^
  --models lstm gru ^
  --top-n 50 ^
  --threshold 0.6

if errorlevel 1 (
    echo ❌ Failed
) else (
    echo ✅ Success - Merging...
    %PYTHON% merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
)
echo.

echo   ALL COMPLETE!
echo End time: %TIME%
echo.
echo All species predicted and merged!
echo Run: setup_web.bat
echo.

timeout /t 60 /nobreak
goto start_prediction

:end