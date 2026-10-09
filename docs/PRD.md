# Roamly — Product Requirements Document (PRD)

> "Explore any city like a local."

---

## 1. Problem
Tourists and travelers arrive in a new city with no reliable, unified source that combines:
- Nearby places (not just tourist traps)
- Real-time conditions (weather, air quality)
- Safety awareness (incident reports, emergency services)
- Cultural context (history, heritage)
- AI-assisted natural-language discovery

Existing apps are either paywalled, city-specific, require accounts, or surface low-quality data.

---

## 2. Goals
1. Work for **any city** the user is in or searches for (not only Pune)
2. Surface **reliable, labeled data** — never invented facts
3. Let users **explore in natural language** via AI assistant grounded in real OSM data
4. Be **100% free to run** (keyless APIs + optional Gemini key)
5. Work on **mobile first**, then desktop

---

## 3. Personas

| Persona | Need | Pain Point |
|---|---|---|
| **Tourist (Priya, 28)** | Find attractions, cafes near hotel | Generic TripAdvisor lists, no local context |
| **Local Explorer (Arjun, 22)** | Discover hidden gems, heritage sites | Nothing maps local knowledge |
| **Budget Traveler (Sam, 25)** | Filter by price, find cheap eats | Price data is scattered and outdated |
| **Student (Meera, 20)** | Research city history for a project | Wikipedia is good but not map-integrated |
| **Safety-Conscious Traveler (Riya, 35)** | Know incident hotspots before going out at night | No free, reliable, real-time safety layer |

---

## 4. User Stories

### P0 (Must Have)
- As a user, I want the app to detect my location so I see places nearby immediately
- As a user, I want to search for a different city if I'm planning a trip
- As a user, I want to filter places by category, price, rating, and distance
- As a user, I want to ask in plain English ("find cheap cafes near me") and get real results
- As a user, I want to compare 2–4 places side by side with a chart
- As a user, I want to see a place's full details including source and last-verified date
- As a user, I want to know if data is live from OSM or demo data
- As a user, I want to see current weather so I can plan accordingly

### P1 (Should Have)
- As a user, I want to explore heritage sites with historical context from Wikipedia
- As a user, I want to build a walking trail between 3–6 heritage sites
- As a user, I want to report a hazard or incident with a map pin and photo
- As a user, I want to see a heatmap of reported incidents
- As a user, I want quick access to nearest police station and hospital
- As a user, I want a "city pulse" dashboard showing weather + AQI + activity level

### P2 (Nice to Have)
- Safer route finder (OSRM + incident scoring)
- Voice notes for reports (Web Speech API)
- PWA manifest for offline use
- Light/dark theme toggle
- Saved places page

---

## 5. Features with Priority

| Feature | Priority | Phase |
|---|---|---|
| Geolocation + city search (Nominatim) | P0 | Phase 1 |
| Radius selector (1/3/5/10 km) | P0 | Phase 1 |
| Explore: search, category chips, filters, cards | P0 | Phase 1–2 |
| Map: synced markers, popup, data-source badge | P0 | Phase 1 |
| Place Details drawer | P0 | Phase 2 |
| AI Assistant (Gemini + fallback) | P0 | Phase 3 |
| Compare: table + radar chart (Recharts) | P0 | Phase 3 |
| Dashboard: weather, AQI, traffic (est), Pulse | P0 | Phase 4 |
| History & Culture layer + heritage trail | P1 | Phase 5 |
| Citizen reports: form, browse, AI classify | P1 | Phase 6 |
| Safety layers: heatmap, SOS card | P1 | Phase 7 |
| Insights page (Recharts + AI summary) | P1 | Phase 7 |
| Safer route | P2 | Phase 8+ |
| PWA, light/dark toggle | P2 | Phase 8+ |

---

## 6. User Flows

### Primary Flow (Explore)
1. Open app → geolocation prompt
2. If granted: map centers, places load, "Searching near: Current Location"
3. If denied: city search modal appears, fallback to Pune
4. User browses cards / map markers
5. Clicks a card → Place Details drawer
6. Clicks "Directions" → Google Maps URL opens

### AI Flow
1. User types "Find cafes under ₹200 near me"
2. Backend extracts filters (Gemini or regex)
3. Backend queries Overpass for user's location
4. Returns top 5 results with explanation
5. Cards appear in chat + map updates

### Compare Flow
1. Check 2–4 place cards
2. Sticky FAB "Compare (N)" appears
3. Click FAB → Compare tab
4. Table + radar chart (available dimensions only)

### Report Flow (Phase 6)
1. Click floating "Report" button
2. Fill form: category, description, optional photo
3. Map pin snaps to GPS or user-placed
4. AI classifies: category, severity 1–5
5. Report appears in browse list with "Unverified" badge
6. Gains "Verified" badge after 3+ confirmations

---

## 7. Success Metrics
- App loads in < 3 s on 4G (Lighthouse score ≥ 80)
- AI assistant returns grounded results (0 invented places)
- All null fields show "Not available" (no blank cells)
- Smoke test passes 11/11 with backend running
- Works at viewport 375px width without horizontal scroll

---

## 8. Out of Scope
- User authentication / accounts
- Social media integration
- Custom ML model training
- Native mobile apps
- Automated real-time moderation of reports
- Paid API tiers

---

## 9. Risks
| Risk | Mitigation |
|---|---|
| Overpass API rate-limit or outage | 10-min cache + seed fallback + "unavailable" state |
| Gemini key not set | Regex fallback classifier always available |
| Nominatim rate-limit (1 req/s) | 300ms debounce + 1hr cache |
| Citizen reports abused | Spam flag in AI classifier, severity 1–5 |
| Safety claims without evidence | Hard rule: no "unsafe" label without 3+ reports |
