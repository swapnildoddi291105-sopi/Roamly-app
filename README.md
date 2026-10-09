# Roamly

> **Explore any city like a local.**

Roamly is an AI-powered, location-aware city exploration web app. It combines place discovery, interactive maps, place comparisons, and a citizen report layer in one free, open-source interface. Works for your current location or any city you search for.

---

## Features (current)

- 📍 **Location-aware** — detects your location or search any city
- 🔍 **Explore** — search, filter by category, budget, rating, radius
- 🗺️ **Map** — interactive Leaflet/OSM map with synced markers
- ✨ **AI Assistant** — natural language search powered by Gemini (with fallback)
- ⚖️ **Compare** — side-by-side comparison of 2–4 places

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite (JavaScript) |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| Backend | FastAPI + uvicorn |
| AI | Google Gemini free tier (regex fallback) |
| Data | OpenStreetMap Overpass API + local seed |
| Geocoding | Nominatim |
| Weather | Open-Meteo (free, keyless) |

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone
```bash
git clone <repo-url>
cd citysmart-promptwar
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (optional — app works without it)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### 4. Mock mode (no backend needed)
```bash
# In frontend/.env
VITE_USE_MOCK=true
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No | Google Gemini API key. Regex fallback is used if missing. |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.5-flash`) |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Backend URL (default: `http://localhost:8000`) |
| `VITE_USE_MOCK` | No | Set `true` to use mock data (no backend needed) |

---

## Running Tests

```bash
# Start the backend first, then:
cd backend
python smoke_test.py
```

Expected: `11 PASSED, 0 FAILED`

---

## Data Sources

All data is free and open:

| Data | Source |
|---|---|
| Places (OSM) | Overpass API |
| Geocoding | Nominatim (OpenStreetMap) |
| Weather | Open-Meteo |
| Map tiles | OpenStreetMap |
| Seed data | `backend/data/places.json` (Pune, 12 places) |

---

## Data Labels

Roamly is honest about its data:
- **Live: OpenStreetMap** — fetched from Overpass today
- **Demo data** — from the local seed file (`places.json`)
- **Not available** — field is null/missing (never guessed)
- **Estimated** — heuristic (e.g., traffic mood from time of day)

---

## Project Docs

| Doc | Purpose |
|---|---|
| `docs/RULES.md` | Coding law for agents and contributors |
| `docs/PRD.md` | Product requirements and user stories |
| `docs/MEMORY.md` | Architecture decisions and API notes |
| `docs/TASKS.md` | Phase-by-phase task checklist |
| `docs/DESIGN.md` | Design system, color tokens, wireframes |
| `PROGRESS.md` | Running changelog |
| `API.md` | Full API contract |

---

## License

MIT
