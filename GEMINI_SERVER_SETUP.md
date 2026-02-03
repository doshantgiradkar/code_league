# ✅ Gemini AI Server Setup Guide

## Problem
Your React app was trying to call Gemini API directly from the browser, causing "Failed to fetch" errors due to CORS and security issues.

## Solution
Use the Express server (already set up) as a proxy/microservice to handle all Gemini API calls.

---

## 🚀 How to Run

### Option 1: Run Both Server & React App Together (RECOMMENDED)
```bash
pnpm run dev:all
```
This will:
- Start the Express server on `http://localhost:3001`
- Start the React app on `http://localhost:5173`
- Both will run simultaneously

### Option 2: Run Separately (For Development)
**Terminal 1 - Start the Server:**
```bash
cd server
pnpm run dev
```
Should print: `✅ Gemini API Microservice is running on port 3001`

**Terminal 2 - Start the React App:**
```bash
pnpm run dev
```
Should print: `VITE v6.2.0  ready in 500 ms`

---

## 📋 Configuration Files

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api/gemini
VITE_GEMINI_API_KEY=AIzaSyBnhYPYFRE8zwFoVobR0ZbUwEkHpRMP3f4
```

### Backend (server/.env)
```
GEMINI_API_KEY=AIzaSyBnhYPYFRE8zwFoVobR0ZbUwEkHpRMP3f4
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## ✅ How It Works

### Data Flow
```
React Component
    ↓ fetch
Client: src/lib/geminiClient.js
    ↓ POST to http://localhost:3001/api/gemini/*
Express Server: server/server.js
    ↓ callGeminiAPI()
Google Gemini API
    ↓ response
Server returns JSON
    ↓
React displays results
```

### Available Endpoints
- `POST /api/gemini/generate-roadmap` - Career roadmap generation
- `POST /api/gemini/analyze-skills` - Skill gap analysis
- `POST /api/gemini/learning-recommendations` - Learning recommendations
- `POST /api/gemini/score-resume` - Resume scoring
- `POST /api/gemini/parse-resume` - Resume parsing
- `POST /api/gemini/chat` - Chat with Gemini
- `GET /health` - Server health check

---

## 🔧 Troubleshooting

### "Failed to fetch" Error
**Solution:** Make sure the server is running on port 3001
```bash
# Check if server is running:
curl http://localhost:3001/health
```

### CORS Issues
The server has CORS enabled for development (`origin: '*'`). If you still get errors:
1. Check that `VITE_API_URL` is correctly set in `.env`
2. Check browser console for actual error message
3. Restart both server and React app

### Gemini API Key Not Working
1. Get a new key from: https://aistudio.google.com/app/apikey
2. Update both `.env` and `server/.env`
3. Restart the server

### Server Won't Start
```bash
cd server
npm install
node server.js
```

---

## 📊 Testing the Setup

### Test 1: Check Server Health
```bash
curl http://localhost:3001/health
```
Expected response:
```json
{
  "status": "healthy",
  "service": "Gemini AI Microservice",
  "model": "gemini-2.0-flash-exp",
  "version": "2.0.0"
}
```

### Test 2: Generate Career Roadmap (Manual Test)
```bash
curl -X POST http://localhost:3001/api/gemini/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "currentSkills": ["JavaScript", "React"],
    "targetRole": "Full Stack Developer",
    "timeframe": "6 months"
  }'
```

---

## 🎯 Next Steps

1. Run `pnpm run dev:all`
2. Open http://localhost:5173
3. Navigate to Career Roadmap page
4. Enter a target role and generate a roadmap
5. You should see the AI response without "Failed to fetch" errors!

---

## 📝 Notes

- The server handles retries (3 attempts) with exponential backoff
- The server parses JSON from Gemini responses automatically
- Both `VITE_GEMINI_API_KEY` and server `GEMINI_API_KEY` must be the same valid API key
- The server logs all requests for debugging
