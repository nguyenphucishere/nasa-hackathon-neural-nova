# 🌸 Flower Forecast API

Backend API server for Flower Bloom Forecasting & Travel Recommendation System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:3000`

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Available Endpoints

#### 1. Get All Locations
```http
GET /api/v1/locations
```

#### 2. Search/Get Recommendations
```http
POST /api/v1/search
Content-Type: application/json

{
  "location": "ha-giang-tam-giac-mach",
  "month": 10,
  "year": 2025,
  "flower": null
}
```

#### 3. Get Forecast for Specific Date
```http
GET /api/v1/forecast/:location_slug/:date
Example: GET /api/v1/forecast/ha-giang-tam-giac-mach/2025-10-15
```

#### 4. Health Check
```http
GET /health
```

## 🐳 Docker

### Build Image
```bash
docker build -t flower-forecast-api .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

## 📚 Documentation

- Full API Documentation: `/api/v1/docs` (Swagger UI)
- Postman Collection: `docs/POSTMAN_COLLECTION.json`

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ML Backend**: Python (existing code)
- **Cache**: In-memory (can add Redis)
- **Container**: Docker

## 📁 Project Structure

```
api/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── utils/          # Utilities
│   └── config/         # Configuration
├── data/              # Static data (locations, etc.)
├── docs/              # API documentation
└── package.json
```

## 🔧 Development

### Environment Variables
See `.env.example` for all available options.

### Adding New Endpoints
1. Create controller in `src/controllers/`
2. Create service in `src/services/`
3. Add route in `src/routes/`
4. Register route in `src/app.js`

## 📞 Support

For issues or questions, check the main project README or contact the team.
