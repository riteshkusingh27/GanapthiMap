import React, { useState, useEffect, useMemo, useRef } from 'react';
import MapView from './components/MapView';
import HeaderSearch from './components/HeaderSearch';
import DiscoverySidebar from './components/DiscoverySidebar';
import MapControls from './components/MapControls';
import FloatingPandalCard from './components/FloatingPandalCard';
import LiveStatusBar from './components/LiveStatusBar';
import PandalDetailSheet from './components/PandalDetailSheet';
import AdminDrawer from './components/AdminDrawer';
import EventsModal from './components/EventsModal';
import AddPandalPage from './components/AddPandalPage';
import { initialPandals, LOCALITY_COORDINATES, BENGALURU_CENTER } from './data/pandalsData';
import { fetchPandalsFromSupabase, updateCrowdStatusInSupabase } from './lib/supabase';
import { Navigation, Plus } from 'lucide-react';

export default function App() {
  // Router State
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Local Storage Persistence
  const [pandals, setPandals] = useState(() => {
    const saved = localStorage.getItem('ganapathimap_pandals');
    return saved ? JSON.parse(saved) : initialPandals;
  });

  const [savedPandalIds, setSavedPandalIds] = useState(() => {
    const saved = localStorage.getItem('ganapathimap_saved_ids');
    return saved ? JSON.parse(saved) : ['pandal-1', 'pandal-2'];
  });

  useEffect(() => {
    localStorage.setItem('ganapathimap_pandals', JSON.stringify(pandals));
  }, [pandals]);

  useEffect(() => {
    localStorage.setItem('ganapathimap_saved_ids', JSON.stringify(savedPandalIds));
  }, [savedPandalIds]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all');

  // UI Layout States
  const [selectedPandal, setSelectedPandal] = useState(null);
  const [isFullSheetOpen, setIsFullSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState('light'); // 'light' default
  const [mapInstance, setMapInstance] = useState(null);

  // User Location State
  const [userLocation, setUserLocation] = useState(null);
  const [locationToast, setLocationToast] = useState('');
  const [nearestPandal, setNearestPandal] = useState(null); // for direction line
  const geoWatchRef = useRef(null);   // holds watchPosition id for cleanup
  const bestAccuracyRef = useRef(Infinity); // tracks best accuracy seen so far

  // Modals & Drawers
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  // Geolocation trigger
  // Haversine formula — returns distance in km between two lat/lng points
  const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Helper: stop any active geolocation watch
  const stopGeoWatch = () => {
    if (geoWatchRef.current !== null) {
      navigator.geolocation.clearWatch(geoWatchRef.current);
      geoWatchRef.current = null;
    }
  };

  // Helper: update nearest pandal from coords
  const updateNearest = (coords) => {
    if (!pandals || pandals.length === 0) return null;
    const nearest = pandals.reduce((closest, pandal) => {
      const d = haversineKm(coords.lat, coords.lng, Number(pandal.latitude), Number(pandal.longitude));
      return d < closest.dist ? { pandal, dist: d } : closest;
    }, { pandal: pandals[0], dist: Infinity });
    if (nearest && nearest.pandal) {
      setSelectedPandal(nearest.pandal);
      setNearestPandal({ pandal: nearest.pandal, distKm: nearest.dist });
      setIsFullSheetOpen(false);
      return nearest;
    }
    return null;
  };

  const handleLocateMe = () => {
    setActiveFilter('near_me');
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    // Reset best accuracy and stop any previous watch
    stopGeoWatch();
    bestAccuracyRef.current = Infinity;
    setLocationToast('Detecting your location...');

    // Auto-stop after 15 s regardless of accuracy
    const stopTimer = setTimeout(() => {
      stopGeoWatch();
      setTimeout(() => setLocationToast(''), 4000);
    }, 15000);

    geoWatchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = Math.round(position.coords.accuracy ?? 9999);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (accuracy < bestAccuracyRef.current) {
          bestAccuracyRef.current = accuracy;
          setUserLocation(coords);
          setNearestPandal(null);

          if (accuracy <= 50) {
            stopGeoWatch();
            clearTimeout(stopTimer);
            setLocationToast(`Location calibrated to your position (${accuracy} m accuracy)`);
            setTimeout(() => setLocationToast(''), 4000);
          } else {
            setLocationToast(`Calibrating position… (${accuracy} m accuracy)`);
          }
        }
      },
      (err) => {
        stopGeoWatch();
        clearTimeout(stopTimer);
        const msgs = {
          1: 'Location permission denied. Please allow location access in your browser.',
          2: 'Location unavailable. Try clicking the map to set your position manually.',
          3: 'Location request timed out. Try again or click the map.',
        };
        setLocationToast(msgs[err.code] || 'Could not detect location.');
        setTimeout(() => setLocationToast(''), 6000);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Clean up watch on unmount
  useEffect(() => stopGeoWatch, []);

  const handleUserLocationDrag = (newCoords) => {
    setUserLocation(newCoords);
    setLocationToast('Custom Location Set!');
    setTimeout(() => setLocationToast(''), 3000);
  };

  // Filter & Distance Sorting Logic
  const filteredPandals = useMemo(() => {
    const originLat = userLocation?.lat ?? BENGALURU_CENTER[0];
    const originLng = userLocation?.lng ?? BENGALURU_CENTER[1];

    let list = pandals.map((p) => {
      const distKm = haversineKm(originLat, originLng, Number(p.latitude), Number(p.longitude));
      return { ...p, distKm };
    }).filter((pandal) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pandal.name.toLowerCase().includes(q);
        const matchesLocality = pandal.locality.toLowerCase().includes(q);
        const matchesAddress = pandal.address.toLowerCase().includes(q);
        const matchesTheme = (pandal.theme || '').toLowerCase().includes(q);
        if (!matchesName && !matchesLocality && !matchesAddress && !matchesTheme) {
          return false;
        }
      }

      if (selectedLocality !== 'All' && pandal.locality !== selectedLocality) {
        return false;
      }

      if (activeFilter === 'eco' && !pandal.isEcoFriendly) return false;
      if (activeFilter === 'annadanam' && !pandal.annadanam?.available) return false;
      if (activeFilter === 'featured' && !pandal.isFeatured) return false;
      if (activeFilter === 'trending' && !pandal.isTrending) return false;

      return true;
    });

    // If 'near_me' filter is active, sort strictly by closest distance ascending
    if (activeFilter === 'near_me') {
      list.sort((a, b) => a.distKm - b.distKm);
    }

    return list;
  }, [pandals, searchQuery, selectedLocality, activeFilter, userLocation]);

  const handleFilterToggle = (filterType) => {
    const nextFilter = activeFilter === filterType ? 'all' : filterType;
    setActiveFilter(nextFilter);

    if (nextFilter === 'near_me') {
      if (!userLocation) {
        handleLocateMe();
      } else {
        const originLat = userLocation.lat;
        const originLng = userLocation.lng;

        const sorted = [...pandals]
          .map((p) => ({
            pandal: p,
            distKm: haversineKm(originLat, originLng, Number(p.latitude), Number(p.longitude))
          }))
          .sort((a, b) => a.distKm - b.distKm);

        if (sorted.length > 0) {
          const closest = sorted[0];
          setSelectedPandal(closest.pandal);
          setNearestPandal({ pandal: closest.pandal, distKm: closest.distKm });
        }
      }
    }
  };

  const handleToggleSave = (pandalId) => {
    setSavedPandalIds((prev) =>
      prev.includes(pandalId) ? prev.filter((id) => id !== pandalId) : [...prev, pandalId]
    );
  };

  const handleAddPandal = (newPandal) => {
    setPandals((prev) => [newPandal, ...prev]);
    setSelectedPandal(newPandal);
  };

  const handleUpdatePandal = (updatedPandal) => {
    setPandals((prev) => prev.map((p) => (p.id === updatedPandal.id ? updatedPandal : p)));
    if (selectedPandal && selectedPandal.id === updatedPandal.id) {
      setSelectedPandal(updatedPandal);
    }
  };

  const handleDeletePandal = (pandalId) => {
    setPandals((prev) => prev.filter((p) => p.id !== pandalId));
    if (selectedPandal && selectedPandal.id === pandalId) {
      setSelectedPandal(null);
    }
  };

  const handleApprovePandal = (pandalId) => {
    setPandals((prev) =>
      prev.map((p) => (p.id === pandalId ? { ...p, status: 'verified' } : p))
    );
  };

  const handleRejectPandal = (pandalId) => {
    setPandals((prev) => prev.filter((p) => p.id !== pandalId));
  };

  useEffect(() => {
    fetchPandalsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setPandals(data);
      }
    });
  }, []);

  const handleUpdateCrowd = (pandalId, level) => {
    setPandals((prev) =>
      prev.map((p) => (p.id === pandalId ? { ...p, crowdLevel: level } : p))
    );
    if (selectedPandal && selectedPandal.id === pandalId) {
      setSelectedPandal((prev) => ({ ...prev, crowdLevel: level }));
    }
    updateCrowdStatusInSupabase(pandalId, level);
  };

  const verifiedCount = pandals.filter((p) => p.status === 'verified').length;

  // ROUTE: /add-pandal & /admin
  const isAddPandalRoute =
    currentPath.startsWith('/add-pandal') ||
    currentPath.startsWith('/admin') ||
    currentPath.includes('add-pandal') ||
    currentPath.includes('admin');

  if (isAddPandalRoute) {
    return (
      <AddPandalPage
        onAddPandal={handleAddPandal}
        onBackToMap={() => navigateTo('/')}
      />
    );
  }

  // DEFAULT MAIN DISCOVERY MAP ROUTE: /
  return (
    <div className="w-screen h-screen font-sans antialiased flex flex-col relative overflow-hidden bg-slate-50">

      {/* Toast Notification */}
      {locationToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700 text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 max-w-sm text-center">
          <Navigation className={`w-3.5 h-3.5 text-amber-400 shrink-0 ${locationToast.startsWith('Refining') || locationToast.startsWith('Detecting') ? 'animate-spin' : ''}`} />
          <span>{locationToast}</span>
        </div>
      )}

      {/* ── DESKTOP LAYOUT (sm+) — unchanged fullscreen map + left sidebar ── */}
      <div className="hidden sm:block w-full h-full relative">

        {/* Header */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
          <HeaderSearch
            onLocateMe={handleLocateMe}
            onOpenAdminDrawer={() => setIsAdminDrawerOpen(true)}
            onOpenEventsModal={() => setIsEventsModalOpen(true)}
            onNavigateToAdmin={() => navigateTo('/add-pandal')}
            verifiedCount={verifiedCount}
          />
        </div>

        <DiscoverySidebar
          pandals={filteredPandals}
          selectedPandal={selectedPandal}
          onSelectPandal={(p) => { setSelectedPandal(p); setIsFullSheetOpen(false); }}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterToggle={handleFilterToggle}
          onAddPandalClick={() => navigateTo('/add-pandal')}
        />

        <MapControls
          onZoomIn={() => mapInstance?.zoomIn()}
          onZoomOut={() => mapInstance?.zoomOut()}
          onLocateMe={handleLocateMe}
          mapStyle={mapStyle}
          onToggleMapStyle={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')}
        />

        <LiveStatusBar pandals={pandals} />

        <main className="w-full h-full relative z-0">
          <MapView
            pandals={filteredPandals}
            selectedPandal={selectedPandal}
            onSelectPandal={(p) => { setSelectedPandal(p); setIsFullSheetOpen(false); }}
            userLocation={userLocation}
            onUserLocationDrag={handleUserLocationDrag}
            mapStyle={mapStyle}
            setMapInstance={setMapInstance}
            nearestPandal={nearestPandal}
          />
        </main>

        {selectedPandal && !isFullSheetOpen && (
          <FloatingPandalCard
            pandal={selectedPandal}
            onClose={() => { setSelectedPandal(null); setNearestPandal(null); }}
            onOpenFullSheet={() => setIsFullSheetOpen(true)}
            userLocation={userLocation}
            nearestPandal={nearestPandal}
            onShowDirections={(pandal) => {
              if (!userLocation) { handleLocateMe(); } else {
                const distKm = haversineKm(userLocation.lat, userLocation.lng, pandal.latitude, pandal.longitude);
                setNearestPandal({ pandal, distKm });
                const distText = distKm < 1 ? `${Math.round(distKm * 1000)} m away` : `${distKm.toFixed(1)} km away`;
                setLocationToast(`Directions to ${pandal.name} — ${distText}`);
                setTimeout(() => setLocationToast(''), 4000);
              }
            }}
            onClearDirections={() => setNearestPandal(null)}
          />
        )}
      </div>

      {/* ── MOBILE LAYOUT — Fullscreen Map + Bottom Floating CTA & Slide-up List ── */}
      <div className="sm:hidden flex flex-col w-full h-full relative">

        {/* Mobile Map — Full screen */}
        <div className="w-full h-full relative z-0">
          <MapView
            pandals={filteredPandals}
            selectedPandal={selectedPandal}
            onSelectPandal={(p) => { setSelectedPandal(p); setIsFullSheetOpen(false); }}
            userLocation={userLocation}
            onUserLocationDrag={handleUserLocationDrag}
            mapStyle={mapStyle}
            setMapInstance={setMapInstance}
            nearestPandal={nearestPandal}
          />

          {/* Floating top header on map */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
            {/* Brand pill */}
            <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-md rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                <img src="/src/assets/logo.png" alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-bold text-gray-900">Ganapathi<span className="text-[#8B1A1A]">Map</span></span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={handleLocateMe}
                className="flex items-center gap-1 bg-[#8B1A1A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md active:scale-95 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                Near Me
              </button>
            </div>
          </div>

          {/* Map controls (Zoom + Locate) — vertically centered on right side */}
          <MapControls
            onZoomIn={() => mapInstance?.zoomIn()}
            onZoomOut={() => mapInstance?.zoomOut()}
            onLocateMe={handleLocateMe}
          />
        </div>

        {/* Fixed Floating Bottom CTA Bar (visible when list is closed and no card selected) */}
        {!isMobileListOpen && !selectedPandal && (
          <div className="fixed bottom-5 left-4 right-4 z-30 flex items-center gap-2.5 pointer-events-auto">
            <button
              onClick={() => setIsMobileListOpen(true)}
              className="flex-1 bg-gradient-to-r from-[#8B1A1A] to-[#a82323] active:scale-95 text-white text-sm font-black py-3.5 px-5 rounded-2xl shadow-2xl shadow-[#8B1A1A]/40 flex items-center justify-center gap-2.5 border border-[#6f1515] transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              View Live Pandals ({filteredPandals.length})
            </button>

            <button
              onClick={() => navigateTo('/add-pandal')}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-1.5 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Pandal
            </button>
          </div>
        )}

        {/* Mobile Slide-Up Card Drawer — lists all live pandals */}
        {isMobileListOpen && (
          <div className="fixed inset-x-0 bottom-0 top-14 z-40 bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 font-sans border-t border-gray-200">

            {/* Handle / Header */}
            <div className="px-5 pt-3 pb-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">Explore Bengaluru Pandals</h3>
                  <p className="text-[11px] text-gray-400 font-medium">{filteredPandals.length} Verified Festival Pandals</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('/add-pandal')}
                  className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
                >
                  + Add
                </button>
                <button
                  onClick={() => setIsMobileListOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search Input inside drawer */}
            <div className="px-4 py-2.5 shrink-0 bg-white border-b border-gray-100">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pandal name or area..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-xl focus:bg-white border border-transparent focus:border-[#8B1A1A]/30 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Filter Chips inside drawer */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-gray-100">
              {[
                { id: 'all', label: 'All' },
                { id: 'near_me', label: 'Nearby' },
                { id: 'featured', label: 'Featured' },
                { id: 'trending', label: 'Trending' },
                { id: 'eco', label: 'Eco' },
                { id: 'annadanam', label: 'Prasad' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFilterToggle(f.id)}
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                    activeFilter === f.id
                      ? 'bg-[#8B1A1A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Scrollable Cards Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
              {filteredPandals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm font-bold text-gray-600">No pandals matched your search</p>
                  <button onClick={() => { setSearchQuery(''); handleFilterToggle('all'); }} className="text-xs text-[#8B1A1A] underline mt-2 font-bold">Clear Filters</button>
                </div>
              ) : (
                filteredPandals.map((pandal) => (
                  <div
                    key={pandal.id}
                    onClick={() => {
                      setSelectedPandal(pandal);
                      setIsMobileListOpen(false);
                    }}
                    className="pt-3 first:pt-0 flex gap-3.5 items-center cursor-pointer active:bg-gray-50 transition"
                  >
                    {/* Card Photo */}
                    <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={pandal.coverImage} alt={pandal.name} className="w-full h-full object-cover" />
                      {pandal.status === 'verified' && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white text-[8px] font-black border border-white">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 leading-snug truncate">{pandal.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-gray-500 truncate">{pandal.locality} · {pandal.edition || '2025'}</p>
                        {pandal.distKm != null && (
                          <span className="text-[10px] font-bold text-[#8B1A1A] bg-[#8B1A1A]/10 px-2 py-0.5 rounded-full shrink-0">
                            {pandal.distKm < 1 ? `${Math.round(pandal.distKm * 1000)} m` : `${pandal.distKm.toFixed(1)} km`}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" /> Open
                        </span>
                        {pandal.isEcoFriendly && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Eco Clay
                          </span>
                        )}
                        {pandal.isFeatured && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 bg-gray-100 hover:bg-[#8B1A1A] hover:text-white text-gray-500 p-2 rounded-xl transition">
                      <Navigation className="w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Selected Pandal Floating Card on Mobile */}
        {selectedPandal && !isFullSheetOpen && !isMobileListOpen && (
          <div className="fixed bottom-4 left-4 right-4 z-30 bg-white border border-gray-200 shadow-2xl rounded-2xl p-3.5 pointer-events-auto">
            <div className="flex items-center gap-3">
              <img src={selectedPandal.coverImage} alt={selectedPandal.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{selectedPandal.name}</h4>
                <p className="text-[11px] text-gray-400 truncate">{selectedPandal.locality}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{selectedPandal.darshanTimings || 'Open'}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => setIsFullSheetOpen(true)}
                  className="bg-[#8B1A1A] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm"
                >
                  Details
                </button>
                <button
                  onClick={() => { setSelectedPandal(null); setNearestPandal(null); }}
                  className="text-[10px] font-semibold text-gray-400 text-center py-0.5"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Directions & Travel Times if nearest active */}
            {nearestPandal?.pandal?.id === selectedPandal.id && (
              <div className="mt-2.5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-2.5 text-center">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Distance</p>
                  <p className="text-xs font-black text-[#8B1A1A]">
                    {nearestPandal.distKm < 1 ? `${Math.round(nearestPandal.distKm * 1000)} m` : `${nearestPandal.distKm.toFixed(1)} km`}
                  </p>
                </div>
                <div className="border-x border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Walk</p>
                  <p className="text-xs font-black text-gray-700">{Math.round((nearestPandal.distKm / 4.5) * 60)} min</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Drive</p>
                  <p className="text-xs font-black text-blue-600">{Math.round((nearestPandal.distKm / 20) * 60)} min</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals & Drawers (shared both layouts) ── */}
      {isFullSheetOpen && selectedPandal && (
        <PandalDetailSheet
          pandal={selectedPandal}
          onClose={() => setIsFullSheetOpen(false)}
          onUpdateCrowd={handleUpdateCrowd}
          isSaved={savedPandalIds.includes(selectedPandal.id)}
          onToggleSave={handleToggleSave}
          onOpenClaimModal={() => alert('Organizers: Please send listing proof to verify@ganapathimap.org')}
          onShowDirections={(pandal) => {
            if (!userLocation) {
              handleLocateMe();
            } else {
              const distKm = haversineKm(
                userLocation.lat, userLocation.lng,
                pandal.latitude, pandal.longitude
              );
              setNearestPandal({ pandal, distKm });
              const distText = distKm < 1
                ? `${Math.round(distKm * 1000)} m away`
                : `${distKm.toFixed(1)} km away`;
              setLocationToast(`Directions to ${pandal.name} — ${distText}`);
              setTimeout(() => setLocationToast(''), 4000);
            }
          }}
        />
      )}

      <AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        pandals={pandals}
        onApprove={handleApprovePandal}
        onReject={handleRejectPandal}
        onSelectPandal={(p) => { setSelectedPandal(p); setIsAdminDrawerOpen(false); }}
      />

      <EventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        pandals={pandals}
        onSelectPandal={(p) => { setSelectedPandal(p); setIsEventsModalOpen(false); }}
      />

    </div>
  );
}


