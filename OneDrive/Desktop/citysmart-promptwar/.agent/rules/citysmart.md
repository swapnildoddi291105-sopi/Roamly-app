# CitySmart Project Rules

## Scope & Feature Guardrails
- **P0 Only**: Only build features specified in `SPEC.md`. No user accounts, auth, PostGIS, LangChain, or scraping.
- **Fixed Tech Stack**:
  - Frontend: React + Vite (JavaScript)
  - Backend: Python FastAPI
  - Maps: Leaflet + OpenStreetMap
  - Data: In-memory JSON (`backend/data/places.json`)
- **No Scope Creep**: Do not introduce new frameworks, state management libraries, or extraneous backend dependencies.

## Data Integrity & Null Handling
- **Fact Fidelity**: Never guess or synthesize unverified values for places.
- **Null Protocol**: Missing data fields must be explicitly stored as `null` in JSON responses.
- **UI Representation**: The frontend must render `null` values as `"Not available"`.

## Security & Environment Configuration
- **Secret Isolation**: Read API keys strictly from `backend/.env`.
- **Zero Exposure**: Never hardcode, commit, or log API keys or sensitive secrets.
- **Env Template**: Always maintain `backend/.env.example` with blank placeholder values.

## Code Quality & Architecture
- **Simplicity First**: Prefer fewer, clean, and concise files over deep abstractions.
- **Brief Comments**: Document non-obvious logic briefly without cluttering code.
