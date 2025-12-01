import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types
interface CategoryData {
  name: string;
  emoji: string;
  group: string;
}

interface SearchResult {
  name: string;
  category: string;
  categoryName: string;
  categoryEmoji: string;
  categoryGroup: string;
  lat: number;
  lon: number;
  distance_km: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const LiveMap: React.FC = () => {
  // State
  const [place, setPlace] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [radius, setRadius] = useState('10000');
  const [maxResults, setMaxResults] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.FeatureGroup | null>(null);
  const mainMarkerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Category data
  const categoryData: Record<string, CategoryData> = {
    general_hospital: { name: 'General Hospitals', emoji: '🏥', group: 'health' },
    govt_hospital: { name: 'Govt Hospitals', emoji: '🏥', group: 'health' },
    veterinary: { name: 'Veterinary Clinics', emoji: '🐾', group: 'health' },
    pharmacy: { name: 'Pharmacy', emoji: '💊', group: 'health' },
    school: { name: 'Schools', emoji: '🏫', group: 'education' },
    college: { name: 'Colleges', emoji: '🎓', group: 'education' },
    university: { name: 'Universities', emoji: '🏛', group: 'education' },
    police: { name: 'Police Stations', emoji: '🚓', group: 'government' },
    fire_station: { name: 'Fire Stations', emoji: '🚒', group: 'government' },
    district_collectorate: { name: 'District Collectorate', emoji: '🏛', group: 'government' },
    mall: { name: 'Shopping Malls', emoji: '🏬', group: 'commercial' },
    bank: { name: 'Banks / ATMs', emoji: '🏦', group: 'commercial' },
    fuel: { name: 'Fuel Stations', emoji: '⛽', group: 'commercial' },
    supermarket: { name: 'Supermarkets', emoji: '🛒', group: 'commercial' },
    old_age_home: { name: 'Old Age Homes', emoji: '👵', group: 'commercial' },
    apartment: { name: 'Apartments', emoji: '🏢', group: 'commercial' },
    bus_station: { name: 'Bus Stops / Terminals', emoji: '🚌', group: 'transport' },
    metro: { name: 'Metro Stations', emoji: '🚇', group: 'transport' },
    railway: { name: 'Railway Stations', emoji: '🚉', group: 'transport' },
    airport: { name: 'Airports', emoji: '✈️', group: 'transport' },
    theatre: { name: 'Theatres', emoji: '🎭', group: 'transport' },
    community_hall: { name: 'Community Halls', emoji: '🏛', group: 'transport' },
    stadium: { name: 'Stadiums', emoji: '🏟', group: 'transport' },
    event_ground: { name: 'Event Grounds', emoji: '📅', group: 'transport' },
    emergency_operations: { name: 'Emergency Operations Center', emoji: '🆘', group: 'emergency' }
  };

  const categoryGroups = [
    {
      title: 'Health & Emergency',
      categories: ['general_hospital', 'govt_hospital', 'veterinary', 'pharmacy']
    },
    {
      title: 'Education',
      categories: ['school', 'college', 'university']
    },
    {
      title: 'Government & Civic',
      categories: ['police', 'fire_station', 'district_collectorate']
    },
    {
      title: 'Commercial & Residential',
      categories: ['mall', 'bank', 'fuel', 'supermarket', 'old_age_home', 'apartment']
    },
    {
      title: 'Transport & Public',
      categories: ['bus_station', 'metro', 'railway', 'airport', 'theatre', 'community_hall', 'stadium', 'event_ground']
    },
    {
      title: 'Disaster & Crisis',
      categories: ['emergency_operations']
    }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([13.0827, 80.2707], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markerGroup = L.featureGroup().addTo(map);
    
    mapRef.current = map;
    markerGroupRef.current = markerGroup;

    return () => {
      map.remove();
    };
  }, []);

  // Handle place search autocomplete
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!place.trim()) {
      setShowSuggestions(false);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(place)}&limit=6`
        );
        const items = await res.json();
        setSuggestions(items);
        setShowSuggestions(items.length > 0);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 220);
  }, [place]);

  const handlePlaceSelect = (item: NominatimResult) => {
    setPlace(item.display_name);
    setLat(parseFloat(item.lat).toFixed(5));
    setLon(parseFloat(item.lon).toFixed(5));
    setShowSuggestions(false);
    flyTo(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
  };

  const flyTo = (latitude: number, longitude: number, label: string) => {
    if (!mapRef.current) return;

    if (mainMarkerRef.current) {
      mapRef.current.removeLayer(mainMarkerRef.current);
    }

    mainMarkerRef.current = L.marker([latitude, longitude])
      .addTo(mapRef.current)
      .bindPopup(label)
      .openPopup();

    mapRef.current.flyTo([latitude, longitude], 13, { animate: true, duration: 1 });
  };

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(cat => cat !== categoryValue);
      } else {
        return [...prev, categoryValue];
      }
    });
  };

  const handleCategoryRemove = (categoryValue: string) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== categoryValue));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setPlace(data.display_name || 'Current Location');
        } catch (e) {
          setPlace('Current Location');
        }

        setLat(latitude.toFixed(5));
        setLon(longitude.toFixed(5));
        flyTo(latitude, longitude, 'Your Current Location');
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        alert('Unable to retrieve your location: ' + error.message);
      }
    );
  };

  const handleSearch = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setIsLoading(true);
    setIsScanning(true);
    setResults([]);

    // Simulate search process
    setTimeout(() => {
      setIsLoading(false);
      setIsScanning(false);
      alert('Search functionality requires backend API connection');
    }, 2000);
  };

  const handleDownload = () => {
    if (!results || results.length === 0) {
      alert('No results to download');
      return;
    }

    const placeSafe = (place.trim() || 'place')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const categories = selectedCategories.join('_');
    const radiusKm = parseInt(radius) / 1000;
    const filename = `${placeSafe}_${categories}_${radiusKm}km_${results.length}.json`;

    const out = results.map(r => ({
      name: r.name,
      category: r.categoryName,
      lat: r.lat,
      lon: r.lon,
      distance_km: r.distance_km
    }));

    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={styles.appContainer}>
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <div>
            <h1 style={styles.pageTitle}>Alert X</h1>
            <p style={styles.pageSubtitle}>Location-based Emergency Services Finder</p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <div style={styles.searchIcon}>🔍</div>
              <input
                type="text"
                style={styles.searchInput}
                placeholder="Search locations..."
              />
            </div>
          </div>
        </header>

        <section style={styles.controlsSection}>
          <div style={styles.controlsGrid}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Location</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="place"
                  style={styles.formInput}
                  type="text"
                  placeholder="Search place (e.g. Chennai)"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
                {showSuggestions && (
                  <div style={styles.suggestions}>
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        style={styles.suggestionItem}
                        onClick={() => handlePlaceSelect(item)}
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Latitude</label>
              <input
                style={styles.formInput}
                type="text"
                placeholder="13.0827"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Longitude</label>
              <input
                style={styles.formInput}
                type="text"
                placeholder="80.2707"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Radius</label>
              <select
                style={styles.formSelect}
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              >
                <option value="5000">5 km</option>
                <option value="10000">10 km</option>
                <option value="25000">25 km</option>
                <option value="50000">50 km</option>
                <option value="100000">100 km</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Categories</label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    ...styles.multiSelectDisplay,
                    ...(isDropdownOpen ? styles.multiSelectDisplayOpen : {})
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedCategories.length === 0 ? (
                    <div style={styles.multiSelectPlaceholder}>Select categories...</div>
                  ) : (
                    <div style={styles.selectedCategories}>
                      {selectedCategories.map(catValue => (
                        <div key={catValue} style={styles.categoryTag}>
                          <span>
                            {categoryData[catValue]?.emoji} {categoryData[catValue]?.name}
                          </span>
                          <span
                            style={styles.removeTag}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryRemove(catValue);
                            }}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={styles.multiSelectArrow}>▼</div>
                </div>

                {isDropdownOpen && (
                  <div style={styles.multiSelectDropdown}>
                    {categoryGroups.map((group, idx) => (
                      <div key={idx} style={styles.categoryGroup}>
                        <div style={styles.categoryGroupHeader}>{group.title}</div>
                        {group.categories.map(catValue => (
                          <div
                            key={catValue}
                            style={{
                              ...styles.categoryOption,
                              ...(selectedCategories.includes(catValue) ? styles.categoryOptionSelected : {})
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryToggle(catValue);
                            }}
                          >
                            <div
                              style={{
                                ...styles.categoryCheckbox,
                                ...(selectedCategories.includes(catValue) ? styles.categoryCheckboxSelected : {})
                              }}
                            >
                              {selectedCategories.includes(catValue) && '✓'}
                            </div>
                            <span>
                              {categoryData[catValue]?.emoji} {categoryData[catValue]?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Max Per Category</label>
              <input
                style={styles.formInput}
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={handleSearch}
              disabled={isLoading}
            >
              <span>{isLoading ? '⏳' : '🔍'}</span>
              <span>{isLoading ? 'Searching...' : 'Search'}</span>
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary }}
              onClick={handleDownload}
            >
              <span>💾</span>
              <span>Export JSON</span>
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnLocation }}
              onClick={handleUseCurrentLocation}
            >
              <span>📍</span>
              <span>Use Current Location</span>
            </button>
          </div>
        </section>

        <div style={styles.contentLayout}>
          <div style={styles.leftPanel}>
            <section style={styles.mapSection}>
              <div ref={mapContainerRef} style={styles.map} />
              <div style={styles.mapOverlay}>🗺️ Interactive Map View</div>
              {isScanning && (
                <div style={styles.scanningOverlay}>
                  <div style={styles.scanningRing} />
                </div>
              )}
            </section>

            <section style={styles.resultsSection}>
              <div style={styles.resultsHeader}>
                <h2 style={styles.resultsTitle}>Search Results</h2>
                <div style={styles.resultsCount}>{results.length} locations found</div>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.resultsTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Location Name</th>
                      <th style={{ ...styles.tableHeader, width: '100px' }}>Category</th>
                      <th style={{ ...styles.tableHeader, width: '80px' }}>Distance</th>
                      <th style={{ ...styles.tableHeader, width: '100px' }}>Latitude</th>
                      <th style={{ ...styles.tableHeader, width: '100px' }}>Longitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} style={styles.noResults}>
                        Search results will appear here when connected to data source
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      {isLoading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.loaderContent}>
            <div style={styles.spinner} />
            <div style={styles.loaderText}>Searching nearby locations...</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    height: '100vh',
    display: 'flex',
    background: '#0a0e1a',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#ffffff',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  topHeader: {
    background: 'linear-gradient(90deg, #1e2a3a 0%, #0f1729 100%)',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#3b82f6',
    marginBottom: '4px'
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#94a3b8'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  searchBar: {
    position: 'relative',
    width: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontSize: '16px'
  },
  searchInput: {
    width: '100%',
    height: '40px',
    padding: '0 16px 0 44px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  controlsSection: {
    padding: '20px 24px',
    background: 'rgba(30, 42, 58, 0.3)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    flexShrink: 0
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 100px',
    gap: '16px',
    alignItems: 'end',
    marginBottom: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    position: 'relative'
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  formInput: {
    height: '40px',
    padding: '0 12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    background: 'rgba(30, 42, 58, 0.5)',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  formSelect: {
    height: '40px',
    padding: '0 12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    background: 'rgba(30, 42, 58, 0.5)',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#1e2a3a',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: '4px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  suggestionItem: {
    padding: '12px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#94a3b8'
  },
  multiSelectDisplay: {
    height: '40px',
    padding: '0 40px 0 12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    background: 'rgba(30, 42, 58, 0.5)',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    position: 'relative'
  },
  multiSelectDisplayOpen: {
    borderColor: '#06b6d4',
    background: 'rgba(30, 42, 58, 0.8)',
    boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.1)'
  },
  multiSelectPlaceholder: {
    color: '#64748b'
  },
  selectedCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    maxWidth: 'calc(100% - 30px)'
  },
  categoryTag: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  },
  removeTag: {
    cursor: 'pointer',
    fontSize: '12px',
    opacity: 0.8
  },
  multiSelectArrow: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b'
  },
  multiSelectDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#1e2a3a',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: '4px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  categoryGroup: {
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
  },
  categoryGroupHeader: {
    padding: '12px 16px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'rgba(30, 42, 58, 0.3)'
  },
  categoryOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#94a3b8'
  },
  categoryOptionSelected: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#ffffff'
  },
  categoryCheckbox: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    color: 'white'
  },
  categoryCheckboxSelected: {
    background: '#06b6d4',
    borderColor: '#06b6d4'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  btn: {
    height: '40px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
  },
  btnSecondary: {
    background: 'transparent',
    color: '#06b6d4',
    border: '1px solid #06b6d4'
  },
  btnLocation: {
    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
  },
  contentLayout: {
    flex: 1,
    display: 'flex',
    minHeight: 0
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(59, 130, 246, 0.1)'
  },
  mapSection: {
    flex: 1,
    position: 'relative',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    minHeight: 0
  },
  map: {
    height: '100%',
    width: '100%'
  },
  mapOverlay: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(30, 42, 58, 0.95)',
    backdropFilter: 'blur(12px)',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 500,
    zIndex: 1000,
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(6, 182, 212, 0.1)',
    zIndex: 999,
    pointerEvents: 'none'
  },
  scanningRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    border: '3px solid #06b6d4',
    borderRadius: '50%',
    animation: 'scanningPulse 2s infinite'
  },
  resultsSection: {
    height: '200px',
    padding: '20px 24px',
    background: 'rgba(30, 42, 58, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexShrink: 0
  },
  resultsTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#ffffff'
  },
  resultsCount: {
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#ffffff'
  },
  tableContainer: {
    background: 'rgba(30, 42, 58, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    flex: 1,
    overflowY: 'auto'
  },
  resultsTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    background: 'rgba(30, 42, 58, 0.8)',
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  tableCell: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.05)',
    fontSize: '14px',
    color: '#ffffff'
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b',
    fontSize: '14px'
  },
  loaderOverlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 14, 26, 0.9)',
    backdropFilter: 'blur(12px)',
    zIndex: 2000
  },
  loaderContent: {
    background: 'rgba(30, 42, 58, 0.8)',
    backdropFilter: 'blur(20px)',
    padding: '40px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(59, 130, 246, 0.3)',
    borderTop: '3px solid #06b6d4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loaderText: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 500,
    textAlign: 'center'
  }
};

export default LiveMap;