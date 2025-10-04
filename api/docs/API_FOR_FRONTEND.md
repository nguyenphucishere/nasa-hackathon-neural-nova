# 📚 API Documentation for Frontend Team

## 🌐 Base URL
```
Development: http://localhost:3000/api/v1
Production: https://your-domain.com/api/v1
```

---

## 🔑 Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## 📡 API Endpoints

### 1. GET /locations
Get all available flower locations.

**Request:**
```http
GET /api/v1/locations
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Locations retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Hà Giang - Tam Giác Mạch",
      "slug": "ha-giang-tam-giac-mach",
      "flower": {
        "species": "tam_giac_mach",
        "common_name": "Buckwheat",
        "local_name": "Tam Giác Mạch",
        "color": "pink-white"
      },
      "location": {
        "country": "Vietnam",
        "latitude": 23.15,
        "longitude": 105.2,
        "elevation_min": 800,
        "elevation_max": 1500
      },
      "bloom_season": {
        "start": "9/25",
        "end": "12/20",
        "peak_months": [10, 11],
        "duration_days": 60
      },
      "description": "Famous buckwheat flower fields...",
      "images": {
        "hero": "/images/ha-giang-hero.jpg"
      }
    }
  ],
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

### 2. POST /search
Search for locations based on criteria (location, date, month, flower).

**Request:**
```http
POST /api/v1/search
Content-Type: application/json

{
  "location": "ha-giang-tam-giac-mach",  // Optional: location slug or null
  "date": "2025-10-15",                   // Optional: YYYY-MM-DD or null
  "month": 10,                            // Optional: 1-12 or null
  "year": 2025,                           // Optional: defaults to current year
  "flower": "tam_giac_mach",             // Optional: flower species or null
  "max_results": 5                        // Optional: max results (default 5)
}
```

**Example 1: Search by month**
```json
{
  "location": null,
  "month": 10,
  "year": 2025,
  "flower": null,
  "max_results": 5
}
```

**Example 2: Search by specific date and location**
```json
{
  "location": "ha-giang-tam-giac-mach",
  "date": "2025-10-15"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "query": {
      "location": null,
      "month": 10,
      "year": 2025,
      "flower": null,
      "max_results": 5
    },
    "matches": [
      {
        "rank": 1,
        "location": {
          "id": 1,
          "name": "Hà Giang - Tam Giác Mạch",
          "slug": "ha-giang-tam-giac-mach",
          "flower": { ...flower_info },
          "coordinates": {
            "latitude": 23.15,
            "longitude": 105.2
          }
        },
        "match_score": 100,
        "in_season": true,
        "best_dates": [
          {
            "date": "2025-10-20",
            "probability": 0.91,
            "confidence": "high",
            "label": "Peak bloom"
          },
          {
            "date": "2025-10-18",
            "probability": 0.89,
            "confidence": "high",
            "label": "Near peak"
          }
        ],
        "season_info": {
          "start": "9/25",
          "end": "12/20",
          "peak_months": [10, 11],
          "status": "in_season"
        },
        "recommendation": {
          "verdict": "excellent",
          "message": "Perfect time to visit Hà Giang! Peak bloom season 🎉",
          "tips": [
            "Book accommodation 2-3 months in advance",
            "Best time: Early morning (6-8 AM)"
          ]
        }
      }
    ],
    "summary": {
      "total_matches": 1,
      "excellent": 1,
      "good": 0,
      "fair": 0,
      "poor": 0
    }
  },
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

### 3. GET /forecast/:location_slug/:date
Get forecast for specific location and date.

**Request:**
```http
GET /api/v1/forecast/ha-giang-tam-giac-mach/2025-10-15
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Forecast retrieved successfully",
  "data": {
    "location": {
      "id": 1,
      "name": "Hà Giang - Tam Giác Mạch",
      "slug": "ha-giang-tam-giac-mach"
    },
    "date": "2025-10-15",
    "in_season": true,
    "forecast": {
      "probability": 0.87,
      "confidence": "high",
      "status": "in_season",
      "model_used": "lstm",
      "computed_at": "2025-10-04T10:30:00.000Z"
    }
  },
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

### 4. GET /forecast/:location_slug/range
Get forecasts for a date range.

**Request:**
```http
GET /api/v1/forecast/ha-giang-tam-giac-mach/range?start=2025-10-01&end=2025-10-31
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Forecast range retrieved successfully",
  "data": {
    "location": "ha-giang-tam-giac-mach",
    "range": {
      "start": "2025-10-01",
      "end": "2025-10-31"
    },
    "forecasts": [
      {
        "date": "2025-10-01",
        "probability": 0.75,
        "confidence": "medium",
        "in_season": true
      },
      {
        "date": "2025-10-02",
        "probability": 0.78,
        "confidence": "medium",
        "in_season": true
      }
      // ... more dates
    ],
    "peak_date": {
      "date": "2025-10-20",
      "probability": 0.91
    }
  },
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

### 5. GET /forecast/hotspots/:location_slug/:date
Get hotspots (high-probability bloom areas) for specific date.

**Request:**
```http
GET /api/v1/forecast/hotspots/ha-giang-tam-giac-mach/2025-10-15
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Hotspots retrieved successfully",
  "data": {
    "location": "Hà Giang - Tam Giác Mạch",
    "date": "2025-10-15",
    "hotspots_count": 45,
    "hotspots": [
      {
        "latitude": 23.15,
        "longitude": 105.2,
        "probability": 0.95,
        "gi_z_score": 3.45,
        "cluster_id": 1
      },
      {
        "latitude": 23.18,
        "longitude": 105.25,
        "probability": 0.93,
        "gi_z_score": 3.21,
        "cluster_id": 1
      }
      // ... more hotspots
    ]
  },
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

## ❌ Error Responses

All errors follow this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "date",
      "message": "Invalid date format. Use YYYY-MM-DD",
      "value": "2025/10/15"
    }
  ],
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Location not found: invalid-slug",
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

---

## 💡 Usage Examples

### Example 1: Show all locations on map
```javascript
fetch('http://localhost:3000/api/v1/locations')
  .then(res => res.json())
  .then(data => {
    data.data.forEach(location => {
      // Add marker to map at location.location.latitude, .longitude
      addMarker(location);
    });
  });
```

### Example 2: User selects "Hà Giang" + "October 2025"
```javascript
const searchQuery = {
  location: 'ha-giang-tam-giac-mach',
  month: 10,
  year: 2025
};

fetch('http://localhost:3000/api/v1/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(searchQuery)
})
  .then(res => res.json())
  .then(data => {
    const match = data.data.matches[0];
    console.log(match.recommendation.message);
    console.log(match.best_dates); // Show calendar
  });
```

### Example 3: Get forecast for specific date
```javascript
const locationSlug = 'ha-giang-tam-giac-mach';
const date = '2025-10-15';

fetch(`http://localhost:3000/api/v1/forecast/${locationSlug}/${date}`)
  .then(res => res.json())
  .then(data => {
    const probability = data.data.forecast.probability;
    console.log(`Bloom probability: ${(probability * 100).toFixed(0)}%`);
  });
```

---

## 🎨 Frontend Integration Tips

### 1. Location Selector
```javascript
// Fetch all locations for dropdown
const locations = await fetch('/api/v1/locations').then(r => r.json());
// Populate <select> or autocomplete
```

### 2. Date Picker
```javascript
// User selects date → call search API
const result = await fetch('/api/v1/search', {
  method: 'POST',
  body: JSON.stringify({ 
    location: selectedLocation, 
    date: selectedDate 
  })
});
```

### 3. Calendar View
```javascript
// Get forecast for entire month
const forecasts = await fetch(
  `/api/v1/forecast/${slug}/range?start=2025-10-01&end=2025-10-31`
).then(r => r.json());

// Color calendar days based on probability
forecasts.data.forecasts.forEach(f => {
  colorCalendarDay(f.date, f.probability);
});
```

### 4. Map with Hotspots
```javascript
// Get hotspots for selected date
const hotspots = await fetch(
  `/api/v1/forecast/hotspots/${slug}/${date}`
).then(r => r.json());

// Add markers to map
hotspots.data.hotspots.forEach(h => {
  addMarker(h.latitude, h.longitude, h.probability);
});
```

---

## 🚀 Quick Start

1. **Start API server:**
```bash
cd api
npm install
cp .env.example .env
npm run dev
```

2. **Test endpoints:**
```bash
# Get locations
curl http://localhost:3000/api/v1/locations

# Search
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"month":10,"year":2025}'
```

3. **Check health:**
```bash
curl http://localhost:3000/health
```

---

## 📞 Support

If you have questions or need additional endpoints, contact the backend team or check the API source code in `api/src/`.
