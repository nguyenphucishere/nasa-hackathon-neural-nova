// ===== GLOBAL VARIABLES =====
let map;
let allData = null;
let startDate = null;
let endDate = null;
let currentDate = null; // Current date from slider
let allDates = [];
let dateRangeList = []; // Dates in current range
let markers = [];
let selectedFeature = null;
let currentSpecies = 'Ha_Giang_TamGiacMach'; // Default species
let currentHotspotIndex = -1; // Current selected hotspot index
let nearbyFeatures = []; // Features sorted by distance from selected

// Species configuration
const speciesConfig = {
    'Ha_Giang_TamGiacMach': {
        name: 'Buckwheat',
        location: 'Ha Giang',
        center: [23.0, 105.0],
        zoom: 10,
        icon: '🌸'
    },
    'Moc_Chau_Prunus': {
        name: 'Plum Blossom',
        location: 'Moc Chau',
        center: [20.8, 104.7],
        zoom: 11,
        icon: '🌺'
    },
    'Hoang_Lien_Rhododendron': {
        name: 'Rhododendron',
        location: 'Fansipan',
        center: [22.3, 103.8],
        zoom: 12,
        icon: '🌷'
    },
    'Lao_Cai_Rhododendron': {
        name: 'Rhododendron',
        location: 'Lao Cai',
        center: [22.7, 103.9],
        zoom: 12,
        icon: '🌼'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    initializeMap();
    await loadGeoJSONData();
    setupEventListeners();
});

// ===== MAP INITIALIZATION =====
function initializeMap() {
    // Get initial species config
    const config = speciesConfig[currentSpecies];
    
    // Initialize map with smooth zoom animation settings
    map = L.map('map', {
        zoomControl: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomAnimationThreshold: 4
    }).setView(config.center, config.zoom);
    
    // Add satellite tiles (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    }).addTo(map);
    
    // Add labels overlay
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map);
    
    // Add scale control
    L.control.scale().addTo(map);
    
    // Control circle visibility based on zoom level
    map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        const minZoomForCircles = 15; // Show circles only when zoomed in to level 15 or higher
        
        markers.forEach(marker => {
            if (marker instanceof L.Circle) {
                if (currentZoom >= minZoomForCircles) {
                    marker.setStyle({ opacity: 0.8, fillOpacity: 0.4 });
                } else {
                    marker.setStyle({ opacity: 0, fillOpacity: 0 });
                }
            }
        });
    });
}

// ===== DATA LOADING =====
async function loadGeoJSONData() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
    
    try {
        // Construct filename based on current species
        const filename = `${currentSpecies}_hotspots_timeseries.geojson`;
        
        // Load GeoJSON from local file
        const response = await fetch(filename);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        
        allData = await response.json();
        console.log(`✅ Loaded GeoJSON for ${currentSpecies}:`, allData);
        
        // Extract unique dates and sort
        allDates = [...new Set(allData.features.map(f => f.properties.date))].sort();
        console.log('📅 Available dates:', allDates);
        
        // Set initial date range (first day and last day or first + 29 days)
        startDate = allDates[0];
        const maxEndIndex = Math.min(allDates.length - 1, 29);
        endDate = allDates[maxEndIndex];
        
        // Set current date to start date initially
        currentDate = startDate;
        
        // Update page title
        const config = speciesConfig[currentSpecies];
        document.querySelector('.header h1').textContent = `${config.icon} Flower Bloom Prediction System`;
        document.querySelector('.header .subtitle').textContent = `${config.name} - ${config.location}`;
        
        // Update UI
        updateDateInputs();
        updateDateRangeSlider();
        updateMap();
        updateStatistics();
        
        // Recenter map to species location with smooth animation
        const mapConfig = speciesConfig[currentSpecies];
        map.flyTo(mapConfig.center, mapConfig.zoom, {
            duration: 1.5,
            easeLinearity: 0.25
        });
        map.once('moveend', () => {
            markers.forEach(marker => {
                if (marker instanceof L.Circle) {
                    marker.setStyle({ opacity: 0.8, fillOpacity: 0.4 });
                } else if (marker instanceof L.Marker) {
                    const element = marker.getElement();
                    if (element) {
                        element.style.transition = 'opacity 0.3s ease';
                        element.style.opacity = '1';
                    }
                }
            });
        });
        
        // Hide loading overlay
        loadingOverlay.classList.add('hidden');
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        loadingOverlay.innerHTML = `
            <div class="spinner"></div>
            <p style="color: red;">❌ Error: File not found ${currentSpecies}_hotspots_timeseries.geojson</p>
            <p style="font-size: 0.9rem; color: #666;">Please ensure the GeoJSON file is in the web/ folder</p>
        `;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Species selector
    const speciesSelect = document.getElementById('speciesSelect');
    speciesSelect.addEventListener('change', async (e) => {
        currentSpecies = e.target.value;
        console.log(`🌸 Switching to species: ${currentSpecies}`);
        
        // Clear current data
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Reload data for new species
        await loadGeoJSONData();
    });
    
    // Date range inputs
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    
    dateStartInput.addEventListener('change', (e) => {
        startDate = e.target.value;
        validateDateRange();
        updateDateRangeSlider();
        updateMap();
        updateStatistics();
    });
    
    dateEndInput.addEventListener('change', (e) => {
        endDate = e.target.value;
        validateDateRange();
        updateDateRangeSlider();
        updateMap();
        updateStatistics();
    });
    
    // Date range slider
    const dateRangeSlider = document.getElementById('dateRangeSlider');
    dateRangeSlider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        currentDate = dateRangeList[index];
        document.getElementById('currentDateDisplay').textContent = formatDate(currentDate);
        document.getElementById('currentDateStat').textContent = formatDate(currentDate);
        updateMap();
        updateStatistics();
        
        // Update nearby markers if a feature is selected
        if (selectedFeature) {
            updateNearbyMarkers(selectedFeature);
        }
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportCurrentData);
    
    // Close detail panel (mobile)
    document.getElementById('closeDetail').addEventListener('click', () => {
        document.getElementById('detailPanel').classList.remove('active');
    });
    
    // Nearby hotspot navigation
    document.getElementById('prevHotspot').addEventListener('click', navigateToPrevHotspot);
    document.getElementById('nextHotspot').addEventListener('click', navigateToNextHotspot);
}

// ===== DATE RANGE VALIDATION =====
function validateDateRange() {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure end is after start
    if (end < start) {
        alert('⚠️ End date must be after start date!');
        endDate = startDate;
        document.getElementById('dateEnd').value = endDate;
        return;
    }
    
    // Check 30-day limit
    const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
        alert('⚠️ Date range maximum is 30 days!');
        const maxEnd = new Date(start);
        maxEnd.setDate(maxEnd.getDate() + 30);
        endDate = maxEnd.toISOString().split('T')[0];
        document.getElementById('dateEnd').value = endDate;
    }
    
    // Reset current date to start if out of range
    if (currentDate < startDate || currentDate > endDate) {
        currentDate = startDate;
    }
}

// ===== UI UPDATES =====
function updateDateInputs() {
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    
    // Set min/max bounds
    dateStartInput.min = allDates[0];
    dateStartInput.max = allDates[allDates.length - 1];
    dateEndInput.min = allDates[0];
    dateEndInput.max = allDates[allDates.length - 1];
    
    // Set initial values
    dateStartInput.value = startDate;
    dateEndInput.value = endDate;
}

function updateDateRangeSlider() {
    // Get dates in current range
    dateRangeList = allDates.filter(d => d >= startDate && d <= endDate);
    
    const slider = document.getElementById('dateRangeSlider');
    slider.max = dateRangeList.length - 1;
    
    // Find index of current date in range
    let currentIndex = dateRangeList.indexOf(currentDate);
    if (currentIndex === -1) {
        currentIndex = 0;
        currentDate = dateRangeList[0];
    }
    
    slider.value = currentIndex;
    
    // Update labels
    document.getElementById('sliderStartLabel').textContent = formatDate(startDate);
    document.getElementById('sliderEndLabel').textContent = formatDate(endDate);
    document.getElementById('currentDateDisplay').textContent = formatDate(currentDate);
    document.getElementById('currentDateStat').textContent = formatDate(currentDate);
}

function updateMap() {
    if (!allData || !currentDate) return;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Filter features for CURRENT DATE ONLY (from slider)
    const features = allData.features.filter(f => {
        return f.properties.date === currentDate;
    });
    
    // Add markers
    features.forEach(feature => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        
        // Determine color based on probability
        const color = getColorByProbability(props.bloom_probability);
        
        // Get species icon
        const speciesIcon = speciesConfig[currentSpecies].icon;
        
        // Create circle marker representing ~1km radius area
        const radiusInMeters = 1000; // 1km radius
        const currentZoom = map.getZoom();
        const minZoomForCircles = 13; // Show circles only when zoomed in
        
        const circleMarker = L.circle([coords[1], coords[0]], {
            radius: radiusInMeters,
            fillColor: color,
            fillOpacity: currentZoom >= minZoomForCircles ? 0.4 : 0,
            color: color,
            weight: 3,
            opacity: currentZoom >= minZoomForCircles ? 0.8 : 0,
            className: 'area-circle-marker'
        });
        
        // Add tooltip for circle
        circleMarker.bindTooltip('You can see flowers blooming in this proximity', {
            permanent: false,
            direction: 'top',
            className: 'circle-tooltip',
            opacity: 0.9
        });
        
        // Add center icon marker for visual reference
        const centerIconHtml = `
            <div style="
                width: 36px;
                height: 36px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            " class="custom-marker">${speciesIcon}</div>
        `;
        
        const centerIcon = L.divIcon({
            html: centerIconHtml,
            className: 'custom-marker-wrapper',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });
        
        const marker = L.marker([coords[1], coords[0]], {
            icon: centerIcon,
            zIndexOffset: 1000
        });
        
        // Add popup
        const popupContent = createPopupContent(props);
        marker.bindPopup(popupContent);
        
        // Add click event to show details and update chatbot
        marker.on('click', () => {
            showFeatureDetails(feature);
            
            // Zoom in to the marker with smooth animation
            map.flyTo([coords[1], coords[0]], 15, {
                duration: 1.0,
                easeLinearity: 0.25
            });
            
            // Update chatbot location context
            if (typeof window.updateChatbotLocation === 'function') {
                window.updateChatbotLocation(feature);
            }
        });
        
        // Also add click handler to circle
        circleMarker.on('click', () => {
            showFeatureDetails(feature);
            
            // Zoom in to the marker with smooth animation
            map.flyTo([coords[1], coords[0]], 15, {
                duration: 1.0,
                easeLinearity: 0.25
            });
            
            // Update chatbot location context
            if (typeof window.updateChatbotLocation === 'function') {
                window.updateChatbotLocation(feature);
            }
        });
        
        // Add both circle and center marker to map
        circleMarker.addTo(map);
        marker.addTo(map);
        markers.push(marker);
        markers.push(circleMarker);

        // Initially hide markers (will be shown after animation)
        circleMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        marker.getElement().style.opacity = '0';
    });
    
    // Fit bounds with smooth animation if markers exist
        // Fit bounds with smooth animation if markers exist
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.flyToBounds(group.getBounds().pad(0.1), {
            duration: 1.2,
            easeLinearity: 0.25,
            padding: [50, 50]
        });
        
        // Show markers after animation completes
        map.once('moveend', () => {
            markers.forEach(marker => {
                if (marker instanceof L.Circle) {
                    marker.setStyle({ opacity: 0.8, fillOpacity: 0.4 });
                } else if (marker instanceof L.Marker) {
                    const element = marker.getElement();
                    if (element) {
                        element.style.transition = 'opacity 0.3s ease';
                        element.style.opacity = '1';
                    }
                }
            });
        });
    }
}

function updateStatistics() {
    if (!allData || !currentDate) return;
    
    // Get all features in date range (for total count)
    const allFeaturesInRange = allData.features.filter(f => {
        const featureDate = f.properties.date;
        return featureDate >= startDate && featureDate <= endDate;
    });
    
    // Get features for current date only (for display)
    const currentDateFeatures = allData.features.filter(f => {
        return f.properties.date === currentDate;
    });
    
    // Calculate statistics for current date
    const probabilities = currentDateFeatures.map(f => f.properties.bloom_probability);
    const avgProb = probabilities.length > 0 
        ? (probabilities.reduce((a, b) => a + b, 0) / probabilities.length) 
        : 0;
    const maxProb = probabilities.length > 0 ? Math.max(...probabilities) : 0;
    
    // Update UI
    document.getElementById('totalPoints').textContent = allFeaturesInRange.length;
    document.getElementById('visiblePoints').textContent = currentDateFeatures.length;
    document.getElementById('avgProb').textContent = (avgProb * 100).toFixed(1) + '%';
    document.getElementById('maxProb').textContent = (maxProb * 100).toFixed(1) + '%';
}

// ===== DETAIL PANEL =====
function showFeatureDetails(feature) {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    
    selectedFeature = feature;
    
    const detailContent = `
        <div class="detail-info">
            <h3>🌸 Flower Information</h3>
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${formatDate(props.date)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Longitude:</span>
                <span class="info-value">${coords[0].toFixed(6)}°</span>
            </div>
            <div class="info-row">
                <span class="info-label">Latitude:</span>
                <span class="info-value">${coords[1].toFixed(6)}°</span>
            </div>
        </div>
        
        <div class="detail-info">
            <h3>📊 Favorable Condition Probability</h3>
            <div class="probability-bar">
                <div class="probability-fill" style="width: ${props.bloom_probability * 100}%">
                    ${(props.bloom_probability * 100).toFixed(1)}%
                </div>
            </div>
            <p style="text-align: center; color: ${getColorByProbability(props.bloom_probability)}; font-weight: 700; margin-top: 0.75rem;">
                ${getProbabilityLabel(props.bloom_probability)}
            </p>
        </div>
        
        <div class="detail-info">
            <h3>💡 Assessment</h3>
            <div class="info-row">
                <span class="info-label">Point Quality:</span>
                <span class="info-value" style="color: ${getColorByProbability(props.bloom_probability)}; font-weight: 700;">
                    ${props.bloom_probability >= 0.7 ? '⭐⭐⭐ Excellent' : 
                      props.bloom_probability >= 0.6 ? '⭐⭐ Very Good' : 
                      props.bloom_probability >= 0.5 ? '⭐ Good' : 
                      '🌟 Potential'}
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Recommendation:</span>
                <span class="info-value">
                    ${props.bloom_probability >= 0.6 ? '✅ Highly Recommended' : 
                      props.bloom_probability >= 0.5 ? '👍 Worth Visiting' : 
                      '📅 Monitor Updates'}
                </span>
            </div>
        </div>
        
        <div style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <button onclick="copyCoordinates(${coords[1]}, ${coords[0]})" 
                    class="detail-btn detail-btn-primary">
                📋 Copy Coordinates
            </button>
            <button onclick="openInGoogleMaps(${coords[1]}, ${coords[0]})" 
                    class="detail-btn detail-btn-success">
                🗺️ Open Google Maps
            </button>
        </div>
    `;
    
    document.getElementById('detailContent').innerHTML = detailContent;
    
    // Show detail panel on mobile
    document.getElementById('detailPanel').classList.add('active');
    
    // Update nearby markers list
    updateNearbyMarkers(feature);
}

// ===== NEARBY MARKERS FUNCTIONALITY =====
function updateNearbyMarkers(selectedFeature) {
    if (!allData || !currentDate) return;
    
    const selectedCoords = selectedFeature.geometry.coordinates;
    
    // Get all features for current date
    const currentDateFeatures = allData.features.filter(f => {
        return f.properties.date === currentDate;
    });
    
    // Calculate distances and sort
    nearbyFeatures = currentDateFeatures
        .map(feature => {
            const coords = feature.geometry.coordinates;
            const distance = calculateDistance(
                selectedCoords[1], selectedCoords[0],
                coords[1], coords[0]
            );
            return { feature, distance };
        })
        .sort((a, b) => a.distance - b.distance);
    
    // Find current index - compare by coordinates
    currentHotspotIndex = nearbyFeatures.findIndex(
        item => {
            const coords = item.feature.geometry.coordinates;
            return coords[0] === selectedCoords[0] && coords[1] === selectedCoords[1];
        }
    );
    
    // Show nearby panel
    document.getElementById('nearbyPanel').style.display = 'block';
    
    // Update counter
    document.getElementById('hotspotCounter').textContent = 
        `${currentHotspotIndex + 1} / ${nearbyFeatures.length}`;
    
    // Update navigation buttons
    document.getElementById('prevHotspot').disabled = currentHotspotIndex === 0;
    document.getElementById('nextHotspot').disabled = currentHotspotIndex === nearbyFeatures.length - 1;
    
    // Populate nearby list (show 10 nearest)
    const nearbyList = document.getElementById('nearbyList');
    nearbyList.innerHTML = '';
    
    const nearestItems = nearbyFeatures.slice(0, 10); // Show top 10
    nearestItems.forEach((item, index) => {
        const { feature, distance } = item;
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        // Check if this item is the selected one by comparing coordinates
        const isActive = coords[0] === selectedCoords[0] && coords[1] === selectedCoords[1];
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `nearby-item ${isActive ? 'active' : ''}`;
        itemDiv.innerHTML = `
            <div class="nearby-item-header">
                <span class="nearby-item-coords">${coords[1].toFixed(4)}°, ${coords[0].toFixed(4)}°</span>
                <span class="nearby-item-prob" style="color: ${getColorByProbability(props.bloom_probability)}">
                    ${(props.bloom_probability * 100).toFixed(1)}%
                </span>
            </div>
            <div class="nearby-item-distance">
                ${distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(2) + 'km'} away
            </div>
        `;
        
        itemDiv.addEventListener('click', () => {
            showFeatureDetails(feature);
            map.flyTo([coords[1], coords[0]], 15, {
                duration: 1.0,
                easeLinearity: 0.25
            });
        });
        
        nearbyList.appendChild(itemDiv);
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance in km
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function navigateToPrevHotspot() {
    if (currentHotspotIndex > 0) {
        const prevItem = nearbyFeatures[currentHotspotIndex - 1];
        const coords = prevItem.feature.geometry.coordinates;
        showFeatureDetails(prevItem.feature);
        map.flyTo([coords[1], coords[0]], 15, {
            duration: 1.0,
            easeLinearity: 0.25
        });
    }
}

function navigateToNextHotspot() {
    if (currentHotspotIndex < nearbyFeatures.length - 1) {
        const nextItem = nearbyFeatures[currentHotspotIndex + 1];
        const coords = nextItem.feature.geometry.coordinates;
        showFeatureDetails(nextItem.feature);
        map.flyTo([coords[1], coords[0]], 15, {
            duration: 1.0,
            easeLinearity: 0.25
        });
    }
}

// ===== HELPER FUNCTIONS =====
function getColorByProbability(prob) {
    if (prob >= 0.7) return '#d73027'; // Red - Very high
    if (prob >= 0.6) return '#fc8d59'; // Orange - High
    if (prob >= 0.5) return '#fee090'; // Yellow - Medium
    if (prob >= 0.4) return '#e0f3f8'; // Light blue - Low
    return '#91bfdb'; // Blue - Very low
}

function getProbabilityLabel(prob) {
    if (prob >= 0.7) return '⭐⭐⭐ RẤT CAO - ĐI NGAY!';
    if (prob >= 0.6) return '⭐⭐ CAO - NÊN ĐI';
    if (prob >= 0.5) return '⭐ TRUNG BÌNH';
    if (prob >= 0.4) return 'THẤP';
    return 'RẤT THẤP';
}

function getHotspotIcon(type) {
    if (type === 'Hot Spot') return '🔥';
    if (type === 'Cold Spot') return '❄️';
    return '⚪';
}

function createPopupContent(props) {
    // Determine quality level based on probability
    let qualityIcon = '⭐';
    let qualityText = 'Good';
    let qualityColor = '#34C759';
    
    if (props.bloom_probability >= 0.7) {
        qualityIcon = '⭐⭐⭐';
        qualityText = 'Excellent';
        qualityColor = '#34C759';
    } else if (props.bloom_probability >= 0.6) {
        qualityIcon = '⭐⭐';
        qualityText = 'Very Good';
        qualityColor = '#30D158';
    } else if (props.bloom_probability >= 0.5) {
        qualityIcon = '⭐';
        qualityText = 'Good';
        qualityColor = '#FFD60A';
    } else {
        qualityIcon = '🌟';
        qualityText = 'Potential';
        qualityColor = '#FF9F0A';
    }
    
    return `
        <div class="popup-content">
            <h4>🌸 Bloom Point</h4>
            <p><strong>Date:</strong> ${formatDate(props.date)}</p>
            <p><strong>Probability:</strong> <span style="color: ${getColorByProbability(props.bloom_probability)}; font-weight: 700;">${(props.bloom_probability * 100).toFixed(1)}%</span></p>
            <p><strong>Quality:</strong> <span style="color: ${qualityColor}; font-weight: 700;">${qualityIcon} ${qualityText}</span></p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #8E8E93;">👆 Click for details</p>
        </div>
    `;
}

function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// ===== EXPORT FUNCTIONS =====
function exportCurrentData() {
    if (!allData || !startDate || !endDate) {
        alert('No data to export!');
        return;
    }
    
    // Get current filtered features in date range
    const features = allData.features.filter(f => {
        const featureDate = f.properties.date;
        return featureDate >= startDate && featureDate <= endDate;
    });
    
    // Create GeoJSON
    const exportData = {
        type: 'FeatureCollection',
        name: `${currentSpecies}_${startDate}_to_${endDate}_filtered`,
        crs: allData.crs,
        features: features
    };
    
    // Download as JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom_data_${startDate}_to_${endDate}.geojson`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${features.length} points from ${formatDate(startDate)} to ${formatDate(endDate)}!`);
}

// ===== UTILITY FUNCTIONS =====
function copyCoordinates(lat, lon) {
    const text = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Coordinates copied: ' + text);
    }).catch(() => {
        alert('❌ Cannot copy. Coordinates: ' + text);
    });
}

function openInGoogleMaps(lat, lon) {
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, '_blank');
}

// Make functions global for onclick handlers
window.copyCoordinates = copyCoordinates;
window.openInGoogleMaps = openInGoogleMaps;
