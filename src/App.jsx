import React, { useState, useEffect, useMemo } from 'react';
import MapView from './components/MapView';
import HeaderSearch from './components/HeaderSearch';
import PandalDetailSheet from './components/PandalDetailSheet';
import AddPandalModal from './components/AddPandalModal';
import AdminDrawer from './components/AdminDrawer';
import EventsModal from './components/EventsModal';
import AdminRoutePage from './components/AdminRoutePage';
import { initialPandals, LOCALITY_COORDINATES, BENGALURU_CENTER } from './data/pandalsData';
import { Bookmark, Sparkles, Navigation, Info, MapPin, Move, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Simple Client-Side Router for /admin
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

  // Persistence with LocalStorage
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
  
  // Selection & Location States
  const [selectedPandal, setSelectedPandal] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationToast, setLocationToast] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  // High Accuracy Geolocation Trigger
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
          setLocationToast('📍 GPS Location Updated! (Drag blue pin if slightly off)');
          setTimeout(() => setLocationToast(''), 4000);
        },
        (error) => {
          setLocationToast('⚠️ GPS permission denied or unavailable. Please pick your area below.');
          setTimeout(() => setLocationToast(''), 4000);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle locality change (pans map to that area)
  const handleLocalityChange = (locality) => {
    setSelectedLocality(locality);
    if (locality !== 'All' && LOCALITY_COORDINATES[locality]) {
      const coords = LOCALITY_COORDINATES[locality];
      setUserLocation(coords);
      setLocationToast(`📍 Moved to ${locality}! Drag pin to adjust.`);
      setTimeout(() => setLocationToast(''), 3500);
    }
  };

  // Handle user dragging location pin on map
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

  // DEFAULT MAIN MAP ROUTE: /
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans antialiased relative">
      
      {/* Location Status Toast Banner */}
      {locationToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white backdrop-blur-xl border border-amber-500/40 text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* Floating Header & Search */}
      <HeaderSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocality={selectedLocality}
        onLocalityChange={handleLocalityChange}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
        onLocateMe={handleLocateMe}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAdminDrawer={() => setIsAdminDrawerOpen(true)}
        onOpenEventsModal={() => setIsEventsModalOpen(true)}
        onNavigateToAdmin={() => navigateTo('/admin')}
        totalPandalsCount={pandals.length}
        verifiedCount={verifiedCount}
      />

      {/* Main Full-Screen Map Container */}
      <main className="w-full h-full relative z-0">
        <MapView
          pandals={filteredPandals}
          selectedPandal={selectedPandal}
          onSelectPandal={setSelectedPandal}
          userLocation={userLocation}
          onUserLocationDrag={handleUserLocationDrag}
        />
      </main>

      {/* Slide-Up / Side Drawer Pandal Detail */}
      <PandalDetailSheet
        pandal={selectedPandal}
        onClose={() => setSelectedPandal(null)}
        onUpdateCrowd={handleUpdateCrowd}
        isSaved={selectedPandal ? savedPandalIds.includes(selectedPandal.id) : false}
        onToggleSave={handleToggleSave}
        onOpenClaimModal={() => alert('Organizers: Please send listing proof to verify@ganapathimap.org')}
      />

      {/* Community Add Pandal Modal */}
      <AddPandalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitPandal={handleAddPandal}
      />

      {/* Admin Moderation Panel Drawer */}
      <AdminDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        pandals={pandals}
        onApprove={handleApprovePandal}
        onReject={handleRejectPandal}
        onSelectPandal={setSelectedPandal}
      />

      {/* Events Calendar Modal */}
      <EventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        pandals={pandals}
        onSelectPandal={setSelectedPandal}
      />
    </div>
  );
}
