# 🚢 Deployment Guide

## 📦 Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

#### 1. Build Docker Image
```bash
cd api
docker build -t flower-forecast-api:latest .
```

#### 2. Run with Docker Compose
```bash
docker-compose up -d
```

#### 3. Check Status
```bash
docker-compose ps
docker-compose logs -f api
```

#### 4. Stop
```bash
docker-compose down
```

---

## 🌐 Production Deployment

### Option 1: Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Option 2: Render.com
1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `cd api && npm install`
4. Set start command: `cd api && npm start`
5. Add environment variables

### Option 3: AWS EC2
```bash
# SSH to EC2
ssh -i key.pem ubuntu@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/your-repo.git
cd nava-hackathon-neural-nova/api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit config

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start src/server.js --name flower-api
pm2 startup
pm2 save
```

---

## 🔧 Environment Variables

Required variables for production:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# CORS - add your frontend domain
ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com

# Python path (if using Python models)
PYTHON_EXECUTABLE=/usr/bin/python3
PYTHON_SCRIPT_PATH=../main.py
PYTHON_OUTPUT_DIR=../outputs

# Logging
LOG_LEVEL=info
LOG_FILE=logs/api.log
```

---

## 🔒 Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with specific origins
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up firewall rules
- [ ] Enable rate limiting (add express-rate-limit)
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

---

## 📊 Monitoring

### Health Check Endpoint
```
GET /health
```

Returns server status, uptime, memory usage.

### Logs
```bash
# View logs
docker-compose logs -f api

# PM2 logs
pm2 logs flower-api
```

---

## 🔄 Updates

### Update Docker Container
```bash
# Pull latest code
git pull

# Rebuild image
docker-compose build

# Restart
docker-compose down
docker-compose up -d
```

### Update PM2
```bash
git pull
npm install
pm2 restart flower-api
```

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Out of memory
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" node src/server.js
```

### Check logs
```bash
# Docker
docker logs flower-forecast-api

# PM2
pm2 logs flower-api

# File
tail -f logs/api.log
```
