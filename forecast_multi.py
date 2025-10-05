"""
Multi-date and Multi-species Bloom Forecasting
Du bao nhieu ngay cho nhieu loai hoa
"""
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta
import webbrowser

# Python executable
PYTHON = r"C:\Users\Admin\anaconda3\envs\plantgpu\python.exe"

# Species configuration
SPECIES = {
    '1': {
        'name': 'Tam Giác Mạch',
        'aoi': 'Ha_Giang_TamGiacMach',
        'season': 'Tháng 10-12',
        'suggest_dates': ['2025-10-15', '2025-11-01', '2025-11-15', '2025-12-01']
    },
    '2': {
        'name': 'Hoa Đào/Mận',
        'aoi': 'Moc_Chau_Prunus', 
        'season': 'Tháng 1-3',
        'suggest_dates': ['2026-01-15', '2026-02-01', '2026-02-15', '2026-03-01']
    }
}

def run_forecast(aoi, date=None, models=['random_forest', 'lstm'], threshold=0.5):
    """Run forecast for specific AOI and date"""
    cmd = [
        PYTHON, 'main.py',
        '--aoi', aoi,
        '--models'] + models + [
        '--threshold', str(threshold)
    ]
    
    if date:
        cmd.extend(['--date', date])
    
    print(f"\n🚀 Running forecast for {aoi} on {date or 'today'}...")
    print(f"Command: {' '.join(cmd)}\n")
    
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0

def open_results(aoi):
    """Open HTML visualization in browser"""
    html_path = Path(f"outputs/visualizations/{aoi}/{aoi}_hotspots_map.html")
    if html_path.exists():
        print(f"✅ Opening map: {html_path}")
        webbrowser.open(str(html_path))
    else:
        print(f"⚠️  Map not found: {html_path}")

def main():
    print("=" * 60)
    print("  BLOOM FORECASTING - MULTI-SPECIES")
    print("  Dự báo nở hoa - Nhiều loài")
    print("=" * 60)
    print()
    
    # Select species
    print("Chọn loài hoa / Select species:")
    for key, spec in SPECIES.items():
        print(f"  {key}. {spec['name']} ({spec['season']})")
    print("  3. ALL - Tất cả loài")
    print()
    
    choice = input("Nhập lựa chọn (1/2/3): ").strip()
    
    if choice not in ['1', '2', '3']:
        print("❌ Invalid choice!")
        return
    
    # Select date mode
    print("\nChọn chế độ / Select mode:")
    print("  1. Single date - Một ngày cụ thể")
    print("  2. Date range - Khoảng thời gian (mỗi tuần)")
    print("  3. Suggested dates - Ngày đề xuất (optimal bloom time)")
    print()
    
    mode = input("Nhập lựa chọn (1/2/3): ").strip()
    
    # Prepare species list
    if choice == '3':
        species_list = list(SPECIES.values())
    else:
        species_list = [SPECIES[choice]]
    
    # Process each species
    for spec in species_list:
        print(f"\n{'='*60}")
        print(f"  {spec['name'].upper()}")
        print(f"{'='*60}")
        
        if mode == '1':
            # Single date
            date = input(f"Nhập ngày (YYYY-MM-DD) hoặc Enter cho hôm nay: ").strip()
            if not date:
                date = datetime.now().strftime('%Y-%m-%d')
            
            success = run_forecast(spec['aoi'], date)
            if success:
                open_results(spec['aoi'])
        
        elif mode == '2':
            # Date range
            start_date = input("Ngày bắt đầu (YYYY-MM-DD): ").strip()
            end_date = input("Ngày kết thúc (YYYY-MM-DD): ").strip()
            
            start = datetime.strptime(start_date, '%Y-%m-%d')
            end = datetime.strptime(end_date, '%Y-%m-%d')
            
            current = start
            count = 0
            while current <= end:
                date_str = current.strftime('%Y-%m-%d')
                success = run_forecast(spec['aoi'], date_str, models=['random_forest'])
                if success:
                    count += 1
                current += timedelta(days=7)  # Weekly
            
            print(f"\n✅ Completed {count} forecasts for {spec['name']}")
            open_results(spec['aoi'])
        
        elif mode == '3':
            # Suggested dates
            print(f"\nNgày đề xuất cho {spec['name']}:")
            for i, date in enumerate(spec['suggest_dates'], 1):
                print(f"  {i}. {date}")
            
            print("\nChạy tất cả ngày đề xuất? (y/n): ", end='')
            confirm = input().strip().lower()
            
            if confirm == 'y':
                for date in spec['suggest_dates']:
                    run_forecast(spec['aoi'], date, models=['random_forest'])
                
                print(f"\n✅ Completed all suggested dates for {spec['name']}")
                open_results(spec['aoi'])
    
    # Final summary
    print("\n" + "="*60)
    print("  HOÀN THÀNH / COMPLETED")
    print("="*60)
    print("\n📁 Kết quả / Results:")
    print("  - HTML maps:  outputs/visualizations/[AOI]/*_hotspots_map.html")
    print("  - CSV data:   outputs/hotspots/[AOI]/*_hotspots.csv")
    print("  - GeoJSON:    outputs/hotspots/[AOI]/*_hotspots.geojson")
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
