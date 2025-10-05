"""
Utility functions for Earth Engine initialization and common operations
"""
import os
import time
import subprocess
from typing import Optional, Dict, Any
import ee


def initialize_earth_engine(project_id: Optional[str] = None, max_retries: int = 3) -> bool:
    """
    Initialize Earth Engine with robust authentication handling
    
    Args:
        project_id: GEE project ID (defaults to env variable)
        max_retries: Maximum authentication attempts
        
    Returns:
        bool: True if initialization successful
    """
    if project_id is None:
        project_id = os.environ.get("EE_PROJECT_ID", "genial-upgrade-467713-n9")
    
    # Try 1: Use cached credentials
    try:
        ee.Initialize(project=project_id)
        print(f"✅ Earth Engine initialized with cached credentials (Project: {project_id})")
        return True
    except Exception as e:
        print(f"ℹ️ Cached init failed: {str(e)[:100]}")
    
    # Try 2: Authenticate and initialize
    for attempt in range(max_retries):
        try:
            print(f"Attempting authentication (attempt {attempt + 1}/{max_retries})...")
            ee.Authenticate()
            ee.Initialize(project=project_id)
            print(f"✅ Earth Engine initialized after authentication (Project: {project_id})")
            return True
        except Exception as e:
            print(f"❌ Authentication attempt {attempt + 1} failed: {str(e)[:100]}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    raise RuntimeError("Failed to initialize Earth Engine after all attempts")


def robust_getinfo(ee_object: Any, max_retries: int = 5, base_sleep: float = 0.5) -> Any:
    """
    Robust getInfo with exponential backoff for rate limiting
    
    Args:
        ee_object: Earth Engine object
        max_retries: Maximum retry attempts
        base_sleep: Base sleep duration (seconds)
        
    Returns:
        Result from getInfo()
    """
    for attempt in range(max_retries):
        try:
            return ee_object.getInfo()
        except ee.ee_exception.EEException as e:
            if "429" in str(e) or "quota" in str(e).lower():
                if attempt < max_retries - 1:
                    sleep_time = base_sleep * (2 ** attempt)
                    print(f"⚠️ Rate limited. Retrying in {sleep_time:.1f}s...")
                    time.sleep(sleep_time)
                else:
                    raise RuntimeError(f"Failed after {max_retries} attempts: {e}")
            else:
                raise e
        except Exception as e:
            if attempt < max_retries - 1:
                sleep_time = base_sleep * (1.5 ** attempt)
                time.sleep(sleep_time)
            else:
                raise e


def batch_export_to_drive(
    image: ee.Image,
    description: str,
    folder: str,
    region: ee.Geometry,
    scale: int = 20,
    max_pixels: int = 1e13
) -> ee.batch.Task:
    """
    Export image to Google Drive with standard parameters
    
    Args:
        image: Earth Engine image
        description: Export task description
        folder: Google Drive folder name
        region: Export region
        scale: Export scale in meters
        max_pixels: Maximum pixels to export
        
    Returns:
        Export task
    """
    task = ee.batch.Export.image.toDrive(
        image=image.clip(region),
        description=description,
        folder=folder,
        region=region,
        scale=scale,
        maxPixels=max_pixels,
        fileFormat='GeoTIFF',
        formatOptions={'cloudOptimized': True}
    )
    task.start()
    return task


def monitor_tasks(tasks: list, check_interval: int = 60) -> Dict[str, str]:
    """
    Monitor Earth Engine export tasks
    
    Args:
        tasks: List of EE tasks
        check_interval: Seconds between status checks
        
    Returns:
        Dictionary of task statuses
    """
    statuses = {}
    
    while True:
        all_done = True
        for task in tasks:
            status = task.status()
            state = status['state']
            desc = status['description']
            
            if state in ['READY', 'RUNNING']:
                all_done = False
                print(f"⏳ {desc}: {state}")
            elif state == 'COMPLETED':
                print(f"✅ {desc}: COMPLETED")
                statuses[desc] = 'COMPLETED'
            elif state == 'FAILED':
                print(f"❌ {desc}: FAILED - {status.get('error_message', 'Unknown error')}")
                statuses[desc] = 'FAILED'
            else:
                statuses[desc] = state
        
        if all_done:
            break
        
        print(f"\nChecking again in {check_interval}s...\n")
        time.sleep(check_interval)
    
    return statuses


def create_grid(geometry: ee.Geometry, cell_size: float = 0.1) -> ee.FeatureCollection:
    """
    Create a grid over a geometry for parallel processing
    
    Args:
        geometry: Area to grid
        cell_size: Grid cell size in degrees
        
    Returns:
        FeatureCollection of grid cells
    """
    bounds = geometry.bounds()
    coords = ee.List(bounds.coordinates().get(0))
    
    xmin = ee.List(coords.get(0)).get(0)
    ymin = ee.List(coords.get(0)).get(1)
    xmax = ee.List(coords.get(2)).get(0)
    ymax = ee.List(coords.get(2)).get(1)
    
    def make_grid_cell(x):
        x = ee.Number(x)
        def make_row(y):
            y = ee.Number(y)
            cell = ee.Geometry.Rectangle([x, y, x.add(cell_size), y.add(cell_size)])
            return ee.Feature(cell)
        
        ys = ee.List.sequence(ymin, ymax.subtract(cell_size), cell_size)
        return ys.map(make_row)
    
    xs = ee.List.sequence(xmin, xmax.subtract(cell_size), cell_size)
    grid = xs.map(make_grid_cell).flatten()
    
    return ee.FeatureCollection(grid).filterBounds(geometry)
