#!/bin/bash

PYTHON=$(which python3)
TODAY=$(date +%Y-%m-%d)

echo ""
echo "================================================"
echo "   GPU-OPTIMIZED PREDICTION STARTING"
echo "================================================"
echo ""

start_prediction() {
    echo "Start time: $(date +%T)"
    echo "Date: $TODAY"

    echo ""
    echo "================================================"
    echo "   [1/4] TAM GIAC MACH - HA GIANG"
    echo "================================================"
    $PYTHON main.py \
      --aoi Ha_Giang_TamGiacMach \
      --date-start $TODAY \
      --models lstm gru \
      --top-n 50 \
      --threshold 0.5

    if [ $? -eq 0 ]; then
        echo "✅ Success - Merging..."
        $PYTHON merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
    else
        echo "❌ Failed"
    fi
    echo ""

    echo ""
    echo "================================================"
    echo "   [2/4] HOA MAN - MOC CHAU"
    echo "================================================"
    $PYTHON main.py \
      --aoi Moc_Chau_Prunus \
      --date-start $TODAY \
      --models lstm gru \
      --top-n 50 \
      --threshold 0.5

    if [ $? -eq 0 ]; then
        echo "✅ Success - Merging..."
        $PYTHON merge_daily_geojson.py --aoi Moc_Chau_Prunus
    else
        echo "❌ Failed"
    fi
    echo ""

    echo ""
    echo "================================================"
    echo "   [3/4] DO QUYEN - FANSIPAN"
    echo "================================================"
    $PYTHON main.py \
      --aoi Hoang_Lien_Rhododendron \
      --date-start $TODAY \
      --models lstm gru \
      --top-n 50 \
      --threshold 0.6

    if [ $? -eq 0 ]; then
        echo "✅ Success - Merging..."
        $PYTHON merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
    else
        echo "❌ Failed"
    fi
    echo ""

    echo ""
    echo "================================================"
    echo "   [4/4] DO QUYEN - LAO CAI"
    echo "================================================"
    $PYTHON main.py \
      --aoi Lao_Cai_Rhododendron \
      --date-start $TODAY \
      --models lstm gru \
      --top-n 50 \
      --threshold 0.6

    if [ $? -eq 0 ]; then
        echo "✅ Success - Merging..."
        $PYTHON merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
    else
        echo "❌ Failed"
    fi
    echo ""

    echo "   ALL COMPLETE!"
    echo "End time: $(date +%T)"
    echo ""
    echo "All species predicted and merged!"
    echo "Run: ./setup_web.sh"
    echo ""
}

# For continuous loop:
while true; do
    start_prediction
    echo "Waiting 60 seconds before next run..."
    sleep 60
done
