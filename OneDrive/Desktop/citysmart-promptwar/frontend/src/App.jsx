import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { fetchPlaces, fetchWeather, postAssistant, postCompare, fetchGeocode } from './api.js';
import MapView from './MapView.jsx';
import PlaceDrawer from './PlaceDrawer.jsx';

// ===== App Context =====
const AppCtx = createContext();
export const useApp = () => useContext(AppCtx);

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'historical', label: 'Historical' },
  { value: 'attraction', label: 'Attractions' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'cafe', label: 'Cafes' },
  { value: 'hotel', label: 'Hotels' },
];

const TABS = ['Explore', 'Map', 'AI Assistant', 'Compare'];

const TAB_ICONS = {
  Explore: '🔍',
  Map: '🗺️',
  'AI Assistant': '✨',
  Compare: '⚖️',
};

const SUGGESTED_PROMPTS = [
  'Find historical places nearby under ₹500',
  'Suggest three affordable cafes in the area',
  'Best rated attractions nearby',
];

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedPlaces(key) {
  try {
    const raw = localStorage.getItem(`roamly_places_${key}`);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) return data;
  } catch (e) {
    return null;
  }
  return null;
}

function setCachedPlaces(key, data) {
  try {
    localStorage.setItem(`roamly_places_${key}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {}
}

// ===== Main App =====
export default function App() {
  const [tab, setTab] = useState('Explore');
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [activeRadius, setActiveRadius] = useState(5);
  
  const [userLocation, setUserLocation] = useState(null);
  const [locationToast, setLocationToast] = useState('');
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [compareIds, setCompareIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [weather, setWeather] = useState(null);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  const [dataSource, setDataSource] = useState('live');

  // Initial Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Current Location' }),
        (err) => {
          setUserLocation({ lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' });
          setLocationToast('Location access denied. Defaulting to Pune.');
          setTimeout(() => setLocationToast(''), 5000);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' });
    }
  }, []);

  // Weather update based on user location
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      fetchWeather({ lat: userLocation.lat, lng: userLocation.lng })
        .then(setWeather)
        .catch(() => {});
    }
  }, [userLocation]);

  // Fetch places when filters or location change with TTL cache
  const loadPlaces = useCallback(async () => {
    if (!userLocation) return;
    setLoading(true);
    const params = { lat: userLocation.lat, lng: userLocation.lng, max_distance_km: activeRadius };
    if (search) params.q = search;
    if (category) params.category = category;
    if (maxPrice) params.max_price = Number(maxPrice);
    if (minRating) params.min_rating = Number(minRating);

    const cacheKey = JSON.stringify(params);
    const cached = getCachedPlaces(cacheKey);
    if (cached) {
      setPlaces(cached.places || []);
      setFilteredPlaces(cached.places || []);
      setDataSource(cached.data_source || 'live');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPlaces(params);
      setPlaces(data.places || []);
      setFilteredPlaces(data.places || []);
      setDataSource(data.data_source || 'live');
      setCachedPlaces(cacheKey, data);
    } catch (e) {
      console.error('Failed to fetch places', e);
      setDataSource('unavailable');
    } finally {
      setLoading(false);
    }
  }, [search, category, maxPrice, minRating, activeRadius, userLocation]);

  useEffect(() => { loadPlaces(); }, [loadPlaces]);

  // Toggle compare checkbox
  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Current Location' }),
        (err) => alert('Unable to retrieve location.')
      );
    }
  };

  const ctxValue = {
    places, filteredPlaces, setFilteredPlaces, userLocation, setUserLocation,
    selectedPlace, setSelectedPlace, compareIds, toggleCompare, savedIds, toggleSave,
    dataSource,
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      {/* Toast */}
      {locationToast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#334155', color: '#fff', padding: '10px 20px', borderRadius: 20, zIndex: 1000, fontSize: '0.85rem' }}>
          {locationToast}
        </div>
      )}

      {/* Sticky Location Bar */}
      <div className="location-bar">
        <div>Searching near: <span style={{ fontWeight: 600, color: '#0F172A' }}>{userLocation?.name || '...'}</span></div>
        <div className="actions">
          <button onClick={() => setIsLocModalOpen(true)}>Change location</button>
          <button onClick={handleUseMyLocation} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> Use my location
          </button>
        </div>
      </div>

      {isLocModalOpen && <LocationModal onClose={() => setIsLocModalOpen(false)} onSelect={setUserLocation} />}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span>Roamly</span>
        </div>
        <div className="navbar-right">
          {weather && (
            <div className="weather-widget">
              ☁️ {weather.temperature_c}°C · {weather.condition}
            </div>
          )}
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {TAB_ICONS[t]} {t}
            {t === 'Compare' && compareIds.size > 0 && ` (${compareIds.size})`}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {tab === 'Explore' && (
          <ExploreTab
            search={search} setSearch={setSearch}
            category={category} setCategory={setCategory}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            minRating={minRating} setMinRating={setMinRating}
            activeRadius={activeRadius} setActiveRadius={setActiveRadius}
            loading={loading}
          />
        )}
        {tab === 'Map' && <MapView activeTab={tab} />}
        {tab === 'AI Assistant' && <AssistantTab />}
        {tab === 'Compare' && <CompareTab />}
      </main>

      {/* Compare FAB */}
      {compareIds.size >= 2 && tab !== 'Compare' && (
        <button className="compare-fab" onClick={() => setTab('Compare')}>
          ⚖️ Compare ({compareIds.size})
        </button>
      )}

      {/* Place Details Drawer */}
      {selectedPlace && <PlaceDrawer />}

      {/* Footer */}
      <footer className="footer">
        Roamly — Data is for demonstration. Prices and ratings may be incomplete.
      </footer>
    </AppCtx.Provider>
  );
}

// ===== Location Modal =====
function LocationModal({ onClose, onSelect }) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSearch = useCallback(async (query) => {
    const searchStr = query != null ? query : q;
    if (!searchStr.trim()) return;
    setLoading(true); setErr('');
    try {
      const res = await fetchGeocode({ q: searchStr });
      if (res && res.lat) {
        onSelect(res);
        onClose();
      } else {
        setErr('City not found.');
      }
    } catch (e) {
      setErr('City not found or network error occurred.');
    } finally {
      setLoading(false);
    }
  }, [q, onSelect, onClose]);

  // Debounced search on input change (300ms)
  useEffect(() => {
    if (!q.trim() || q.trim().length < 3) return;
    const timer = setTimeout(() => {
      handleSearch(q);
    }, 300);
    return () => clearTimeout(timer);
  }, [q, handleSearch]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Change Location</h3>
        <input 
          autoFocus
          placeholder="Enter city name (e.g., Tokyo, Paris, Mumbai)..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {err && <p style={{color: '#EF4444', fontSize: '0.8rem', marginTop: 6, marginBottom: 10}}>{err}</p>}
        <div className="modal-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => handleSearch()}>{loading ? 'Searching...' : 'Search'}</button>
        </div>
      </div>
    </div>
  );
}


// ===== Explore Tab =====
function ExploreTab({ search, setSearch, category, setCategory, maxPrice, setMaxPrice, minRating, setMinRating, activeRadius, setActiveRadius, loading }) {
  const { filteredPlaces, compareIds, toggleCompare, setSelectedPlace, dataSource } = useApp();

  return (
    <>
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            id="search-input"
            type="text"
            placeholder="Search places, areas, or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chips-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`chip ${category === c.value ? 'active' : ''}`}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <div className="filter-group-row">
              <label>Radius:</label>
              <div className="chips-row">
                {[1, 3, 5, 10].map(r => (
                  <button 
                    key={r} 
                    className={`chip ${activeRadius === r ? 'active' : ''}`}
                    onClick={() => setActiveRadius(r)}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-group-row">
              <label>Budget (max ₹):</label>
              <input
                id="budget-input"
                type="number"
                min="0"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: 80 }}
              />
            </div>
            <span className="filter-help">Applies only to places with price data.</span>
          </div>

          <div className="filter-group">
            <div className="filter-group-row">
              <label>Min Rating:</label>
              <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Any</option>
                <option value="3">3+</option>
                <option value="3.5">3.5+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {dataSource === 'unavailable' && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚠️</span>
          <span>Live data for this location is currently unavailable. Try expanding your search radius or choosing another city.</span>
        </div>
      )}

      {loading ? (
        <div className="places-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="place-card skeleton" style={{ height: 160 }} />)}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No places match your filters</h3>
          <p>Try adjusting your search query, increasing radius, or clearing filters.</p>
        </div>
      ) : (
        <div className="places-grid">
          {filteredPlaces.map((p) => (
            <PlaceCard
              key={p.id}
              place={p}
              checked={compareIds.has(p.id)}
              onToggle={() => toggleCompare(p.id)}
              onClick={() => setSelectedPlace(p)}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ===== Place Card =====
export function PlaceCard({ place, checked, onToggle, onClick }) {
  const isLive = place.source && place.source.toLowerCase().includes('openstreetmap');
  return (
    <div className="place-card" onClick={onClick}>
      <div className="place-card-header">
        <div className="place-card-name">{place.name}</div>
        <div className="card-badges">
          <span className={`category-badge ${place.category}`}>{place.category}</span>
          <span className={`source-badge ${isLive ? 'live' : 'demo'}`}>
            {isLive ? 'Live: OpenStreetMap' : 'Demo data'}
          </span>
        </div>
      </div>
      <div className="place-card-details">
        <span>📍 {place.area || 'Unknown area'}</span>
        <span>💰 {place.price_inr != null ? `₹${place.price_inr}` : 'Not available'}</span>
        <span>⭐ {place.rating != null ? place.rating : 'Not available'}</span>
        {place.distance_km != null && <span>📏 {place.distance_km} km</span>}
      </div>
      <div className="place-card-footer">
        <label className="compare-check" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={checked || false}
            onChange={onToggle}
          />
          Compare
        </label>
      </div>
    </div>
  );
}

// ===== AI Assistant Tab =====
function AssistantTab() {
  const { setFilteredPlaces, setSelectedPlace, userLocation, compareIds, toggleCompare } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await postAssistant({
        message: msg,
        user_location: userLocation,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.explanation, places: data.places, filters: data.filters },
      ]);
      if (data.places?.length) setFilteredPlaces(data.places);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, something went wrong: ${e.message}`, places: [], filters: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      <div className="prompt-chips">
        {SUGGESTED_PROMPTS.map((p) => (
          <button key={p} className="prompt-chip" onClick={() => send(p)}>💡 {p}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          id="assistant-input"
          type="text"
          placeholder="Ask me about places near you..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="btn btn-primary" onClick={() => send()}>Send</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.content}
            {m.filters && (
              <div className="filters-understood">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 4, fontWeight: 500 }}>Filters understood:</span>
                {m.filters.category && <span className="filter-tag">Category: {m.filters.category}</span>}
                {m.filters.max_price != null && <span className="filter-tag">Max Price: ₹{m.filters.max_price}</span>}
                {m.filters.min_rating != null && <span className="filter-tag">Min Rating: {m.filters.min_rating}</span>}
                {m.filters.keywords?.length > 0 && <span className="filter-tag">Keywords: {m.filters.keywords.join(', ')}</span>}
              </div>
            )}
            {m.places?.length > 0 && (
              <div className="places-grid" style={{ marginTop: 16 }}>
                {m.places.map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    checked={compareIds.has(p.id)}
                    onToggle={() => toggleCompare(p.id)}
                    onClick={() => setSelectedPlace(p)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="loading-dots"><span className="skeleton" style={{width: 8, height: 8, borderRadius: '50%'}} /><span className="skeleton" style={{width: 8, height: 8, borderRadius: '50%'}} /><span className="skeleton" style={{width: 8, height: 8, borderRadius: '50%'}} /></div>}
      </div>
    </div>
  );
}

// ===== Compare Tab =====
function CompareTab() {
  const { compareIds, toggleCompare, places } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (compareIds.size < 2) { setData(null); return; }
    setLoading(true);
    setError(null);
    postCompare({ ids: [...compareIds] })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [compareIds]);

  if (compareIds.size < 2) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚖️</div>
        <h3>Select at least 2 places to compare</h3>
        <p>Use the checkboxes on place cards in the Explore tab.</p>
      </div>
    );
  }

  if (loading) return <div className="skeleton" style={{ height: 300, width: '100%', borderRadius: 12 }}></div>;
  if (error) return <div className="empty-state"><h3>Error</h3><p>{error}</p></div>;
  if (!data) return null;

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Attribute</th>
            {data.places.map((p) => (
              <th key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  {p.name}
                  <button className="compare-remove" onClick={() => toggleCompare(p.id)} title="Remove">✕</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.field}>
              <td>{row.label}</td>
              {data.places.map((p) => (
                <td key={p.id}>
                  {row.values[p.id] != null ? (
                    String(row.values[p.id])
                  ) : (
                    <span className="not-available">Not available</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
