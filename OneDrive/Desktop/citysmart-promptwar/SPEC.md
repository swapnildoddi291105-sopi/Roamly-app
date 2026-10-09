# CitySmart Pune - Product Specification (MVP)

## 1. Goal
CitySmart is a unified city exploration interface for Pune, India. It combines place discovery, interactive map exploration, an AI-powered natural language assistant, and side-by-side comparison into a single fast, intuitive application.

## 2. Core Demo Journey
1. **User Request**: User types or selects a prompt like *"Find historical places in Pune under ₹500"*.
2. **AI Filter Extraction**: The AI assistant extracts structured search filters (`category: "historical"`, `max_price: 500`).
3. **Database Query**: The backend queries real, verified local records matching the extracted criteria.
4. **Interactive UI Update**: Map markers and place cards dynamically filter to show matching records.
5. **Comparison & Actions**: User selects 2+ places to compare side-by-side and opens external Google Maps directions for a selected destination.

## 3. Scope (P0 Features Only)
- **Explore Places**: Browse, search, filter by category and price/rating.
- **Search / Filter / Map**: Synchronized Leaflet map and card list displaying matching locations.
- **AI City Assistant**: Natural language query interface extracting search filters and providing grounded explanations based exclusively on matching place data.
- **Compare Places**: Compare 2 or more selected places side-by-side in a dynamic matrix table.
- **Place Details**: Quick view drawer or modal for detailed facts, photos/notes, opening hours, and direct navigation links.

## 4. UI Screens & Components
- **Explore Screen**: Search bar, category chips (`attraction`, `historical`, `restaurant`, `cafe`, `hotel`), budget/rating sliders, grid of place cards.
- **Map Screen**: Interactive Leaflet map with custom markers, popup tooltips featuring place details, and direct directions link (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
- **AI Assistant Screen**: Interactive chat UI with recommended quick prompts, filter summary tags, and embedded recommended place cards.
- **Compare Screen**: Side-by-side matrix comparing places across key attributes (Price, Rating, Distance, Hours, Accessibility, Cleanliness, Source, Last Verified). Missing values are rendered cleanly as *"Not available"*.
- **Place Details**: Slide-over drawer or overlay modal (not a separate page route).

## 5. Non-Goals / Out of Scope
- User authentication / login / user profiles.
- Citizen feedback reporting or crowdsourced edits.
- Live traffic layers, transit routing engines, or safety overlays.
- Custom machine learning model training or real-time web scraping.
- PostGIS spatial database extensions or LangChain dependencies.
- Multi-city deployment or hosting setup.

## 6. Core Principles
- **AI as Interface, Not Fact Source**: The AI assistant extracts structured intent and provides natural language summaries grounded strictly in real database records.
- **Zero Hallucination Guarantee**: The AI must **never** invent places, facts, or attributes. Unverified or missing data is explicitly stored as `null` and displayed as *"Not available"*.
