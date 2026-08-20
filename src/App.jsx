import React, { useState, useEffect, useMemo } from 'react';
import MapView from './components/MapView';
import HeaderSearch from './components/HeaderSearch';
import DiscoverySidebar from './components/DiscoverySidebar';
import MapControls from './components/MapControls';
import FloatingPandalCard from './components/FloatingPandalCard';
import LiveStatusBar from './components/LiveStatusBar';
import PandalDetailSheet from './components/PandalDetailSheet';
import AdminDrawer from './components/AdminDrawer';
import EventsModal from './components/EventsModal';
import AdminRoutePage from './components/AdminRoutePage';
import { initialPandals, LOCALITY_COORDINATES } from './data/pandalsData';
import { Navigation } from 'lucide-react';

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
  const [mapStyle, setMapStyle] = useState('light'); // 'light' default
  const [mapInstance, setMapInstance] = useState(null);

  // User Location State
  const [userLocation, setUserLocation] = useState(null);
  const [locationToast, setLocationToast] = useState('');

  // Modals & Drawers
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  // Geolocation trigger
  const handleLocateMe = () => {
    setLocationToast('Detecting high-accuracy GPS position...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setLocationToast('📍 GPS Location Updated!');
          setTimeout(() => setLocationToast(''), 3500);
        },
        (error) => {
          setLocationToast('⚠️ GPS access unavailable. Pick area below.');
          setTimeout(() => setLocationToast(''), 4000);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleUserLocationDrag = (newCoords) => {
    setUserLocation(newCoords);
    setLocationToast('📍 Custom Location Set!');
    setTimeout(() => setLocationToast(''), 3000);
  };

  // Filter Pandals Logic
  const filteredPandals = useMemo(() => {
    return pandals.filter((pandal) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
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
  }, [pandals, searchQuery, selectedLocality, activeFilter]);

  const handleFilterToggle = (filterType) => {
    setActiveFilter((prev) => (prev === filterType ? 'all' : filterType));
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

  const handleUpdateCrowd = (pandalId, level) => {
    setPandals((prev) =>
      prev.map((p) => (p.id === pandalId ? { ...p, crowdLevel: level } : p))
    );
    if (selectedPandal && selectedPandal.id === pandalId) {
      setSelectedPandal((prev) => ({ ...prev, crowdLevel: level }));
    }
  };

  const verifiedCount = pandals.filter((p) => p.status === 'verified').length;

  // ROUTE: /admin
  if (currentPath === '/admin') {
    return (
      <AdminRoutePage
        pandals={pandals}
        onAddPandal={handleAddPandal}
        onUpdatePandal={handleUpdatePandal}
        onDeletePandal={handleDeletePandal}
        onBackToMap={() => navigateTo('/')}
        onSelectPandalOnMap={(pandal) => {
          setSelectedPandal(pandal);
          navigateTo('/');
        }}
      />
    );
  }

  // DEFAULT MAIN DISCOVERY MAP ROUTE: /
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 font-sans antialiased relative">
      
      {/* Toast Notification */}
      {locationToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700 text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* Top Header Navbar Container */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
        <HeaderSearch
          onLocateMe={handleLocateMe}
          onOpenAdminDrawer={() => setIsAdminDrawerOpen(true)}
          onOpenEventsModal={() => setIsEventsModalOpen(true)}
          onNavigateToAdmin={() => navigateTo('/admin')}
          verifiedCount={verifiedCount}
        />
      </div>

      {/* Minimal Left Discovery Sidebar (Matches User's Reference Image) */}
      <DiscoverySidebar
        pandals={filteredPandals}
        selectedPandal={selectedPandal}
        onSelectPandal={(p) => {
          setSelectedPandal(p);
          setIsFullSheetOpen(false);
        }}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
      />

      {/* Floating Right Map Controls */}
      <MapControls
        onZoomIn={() => mapInstance?.zoomIn()}
        onZoomOut={() => mapInstance?.zoomOut()}
        onLocateMe={handleLocateMe}
        mapStyle={mapStyle}
        onToggleMapStyle={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')}
      />

      {/* Live Status Badge */}
      <LiveStatusBar pandals={pandals} />

      {/* Main Full-Screen Map Container */}
      <main className="w-full h-full relative z-0">
        <MapView
          pandals={filteredPandals}
          selectedPandal={selectedPandal}
          onSelectPandal={(p) => {
            setSelectedPandal(p);
            setIsFullSheetOpen(false);
          }}
          userLocation={userLocation}
          onUserLocationDrag={handleUserLocationDrag}
          mapStyle={mapStyle}
          setMapInstance={setMapInstance}
        />
      </main>

      {/* Floating Pandal Details Card */}
      {selectedPandal && !isFullSheetOpen && (
        <FloatingPandalCard
          pandal={selectedPandal}
          onClose={() => setSelectedPandal(null)}
          onOpenFullSheet={() => setIsFullSheetOpen(true)}
        />
      )}

      {/* Full Detail Drawer Modal */}
      {isFullSheetOpen && selectedPandal && (
        <PandalDetailSheet
          pandal={selectedPandal}
          onClose={() => setIsFullSheetOpen(false)}
          onUpdateCrowd={handleUpdateCrowd}
          isSaved={savedPandalIds.includes(selectedPandal.id)}
          onToggleSave={handleToggleSave}
          onOpenClaimModal={() => alert('Organizers: Please send listing proof to verify@ganapathimap.org')}
        />
      )}

      {/* Admin Moderation Panel Drawer */}
      <AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        pandals={pandals}
        onApprove={handleApprovePandal}
        onReject={handleRejectPandal}
        onSelectPandal={(p) => {
          setSelectedPandal(p);
          setIsAdminDrawerOpen(false);
        }}
      />

      {/* Events Calendar Modal */}
      <EventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        pandals={pandals}
        onSelectPandal={(p) => {
          setSelectedPandal(p);
          setIsEventsModalOpen(false);
        }}
      />

    </div>
  );
}
