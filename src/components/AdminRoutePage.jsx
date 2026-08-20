import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Navigation, Sparkles, ShieldCheck, CheckCircle2, ArrowLeft, RefreshCw, Upload, Edit3, Trash2, Eye, Info, Plus, Search, AlertTriangle, Target } from 'lucide-react';
import MapView from './MapView';
import EditPandalModal from './EditPandalModal';
import { LOCALITY_COORDINATES } from '../data/pandalsData';

export default function AdminRoutePage({ pandals, onAddPandal, onUpdatePandal, onDeletePandal, onBackToMap, onSelectPandalOnMap }) {
  // Photo & Location States
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState({ lat: 12.9432, lng: 77.5736 }); // Default to Basavanagudi
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle, locating, success, ip_approx, manual
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [streetName, setStreetName] = useState('Detecting street name...');
  const [localityName, setLocalityName] = useState('Basavanagudi');
  
  // Search & Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live Camera
  const [isCapturingLive, setIsCapturingLive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Modal State
  const [editingPandal, setEditingPandal] = useState(null);
  const [toast, setToast] = useState('');

  // Auto-detect GPS coordinates on load
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setGpsStatus('locating');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 0);
          setCoords({ lat, lng });
          setGpsAccuracy(accuracy);

          if (accuracy > 500) {
            setGpsStatus('ip_approx');
            setToast('⚠️ IP Location detected. Search your street or click map below for exact spot!');
          } else {
            setGpsStatus('success');
            setToast('🎯 High-Accuracy GPS position locked!');
          }
          setTimeout(() => setToast(''), 4000);
          await reverseGeocode(lat, lng);
        },
        (error) => {
          console.warn("Geolocation error", error);
          setGpsStatus('ip_approx');
          setToast('⚠️ GPS unavailable. Click map or search street below.');
          setTimeout(() => setToast(''), 4000);
          reverseGeocode(coords.lat, coords.lng);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setGpsStatus('ip_approx');
      reverseGeocode(coords.lat, coords.lng);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.street || addr.suburb || addr.neighbourhood || addr.city_district || 'Main Street';
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || 'Bengaluru';
        setStreetName(`${road} Ganesha Pandal`);
        setLocalityName(suburb);
        return;
      }
    } catch (err) {
      console.warn("Reverse geocode failed", err);
    }
    setStreetName(`Street near (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    setLocalityName('Bengaluru');
  };

  // Search Address / Landmark API
  const handleAddressSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const fullQuery = query.toLowerCase().includes('bengaluru') || query.toLowerCase().includes('bangalore')
        ? query
        : `${query}, Bengaluru, Karnataka, India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.warn("Address search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setCoords({ lat, lng });
    setGpsStatus('manual');
    setSuggestions([]);
    const title = item.display_name.split(',')[0];
    setSearchQuery(title);
    setToast(`📍 Moved pin to "${title}"!`);
    setTimeout(() => setToast(''), 3500);
    reverseGeocode(lat, lng);
  };

  // Quick Locality Presets
  const selectLocalityPreset = (locName, presetCoords) => {
    setCoords(presetCoords);
    setGpsStatus('manual');
    setLocalityName(locName);
    setToast(`📍 Moved map to ${locName}!`);
    setTimeout(() => setToast(''), 3000);
    reverseGeocode(presetCoords.lat, presetCoords.lng);
  };

  // Map Click or Marker Drag Handlers
  const handleMapPinSet = (newCoords) => {
    setCoords(newCoords);
    setGpsStatus('manual');
    setToast(`🎯 Pinned exact spot!`);
    setTimeout(() => setToast(''), 3000);
    reverseGeocode(newCoords.lat, newCoords.lng);
  };

  // Photo Select / Capture
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startLiveCamera = async () => {
    try {
      setIsCapturingLive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Could not access camera device. Please use upload photo option.");
      setIsCapturingLive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhoto(dataUrl);
      stopLiveCamera();
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturingLive(false);
  };

  // Submit & Add Pandal
  const handlePublishPandal = () => {
    if (!photo) {
      alert("Please take or upload a photo of the pandal first!");
      return;
    }

    const newPandal = {
      id: `pandal-admin-${Date.now()}`,
      name: streetName,
      slug: streetName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      locality: localityName,
      address: `${streetName}, ${localityName}, Bengaluru`,
      latitude: coords.lat,
      longitude: coords.lng,
      establishmentYear: new Date().getFullYear(),
      edition: '1st Year',
      theme: 'Not added',
      idolType: 'Not added',
      isEcoFriendly: true,
      isFeatured: false,
      isTrending: true,
      status: 'verified',
      darshanTimings: 'Not added',
      aartiTimings: 'Not added',
      annadanam: {
        available: false,
        timings: 'Not added',
        description: 'Not added'
      },
      facilities: {
        parking: false,
        toilets: false,
        drinkingWater: false,
        accessibility: false,
        firstAid: false
      },
      crowdLevel: 'Low',
      coverImage: photo,
      images: [photo],
      description: 'Details not added yet (Captured via Admin Route)',
      events: [],
      organizer: {
        claimed: true,
        name: 'Not added (Admin Created)',
        contact: 'Not added'
      },
      likesCount: 1,
      checkinsCount: 1
    };

    onAddPandal(newPandal);
    setToast(`✅ Published "${streetName}" to map at exact location!`);
    setPhoto(null);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-6 py-3 rounded-full font-extrabold shadow-2xl flex items-center gap-2 animate-bounce border-2 border-slate-950 text-xs sm:text-sm">
          <Target className="w-5 h-5 text-slate-950 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-2xl text-xs font-extrabold flex items-center gap-2 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-base leading-none text-white">
                Admin <span className="text-amber-500">/admin</span> Route
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Photo & Location Pandal Pinning
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3.5 py-1.5 rounded-full border border-emerald-500/40">
            🎯 Pin Point Accuracy Enabled
          </span>
        </div>
      </header>

      {/* IP Location Warning Alert if IP-based */}
      {(gpsStatus === 'ip_approx' || (gpsAccuracy && gpsAccuracy > 500)) && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 text-xs text-amber-300 flex items-center justify-between gap-3 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Desktop IP Notice:</strong> Search your street or click directly on the map below to pinpoint exact spot.
            </span>
          </div>
          <button
            onClick={detectLocation}
            className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-xl shrink-0 text-[11px] hover:bg-amber-400 transition"
          >
            Re-detect GPS
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Photo & Location Card Panel */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
          
          {/* Step 1: Photo Capture */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-white">1. Capture Pandal Photo</h2>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">Camera or Upload</span>
            </div>

            <div className="relative w-full aspect-video max-h-72 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/40 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
              {isCapturingLive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    onClick={captureSnapshot}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-full font-extrabold text-sm flex items-center gap-2 shadow-2xl"
                  >
                    <Camera className="w-5 h-5" /> Take Snapshot
                  </button>
                  <button
                    onClick={stopLiveCamera}
                    className="absolute top-3 right-3 bg-red-600/80 text-white px-3 py-1 rounded-full text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : photo ? (
                <div className="w-full h-full relative">
                  <img src={photo} alt="Captured Pandal" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPhoto(null)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium max-w-xs">
                    Click photo using camera or upload image of the Ganesha pandal
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={startLiveCamera}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
                    >
                      <Camera className="w-4 h-4" />
                      Open Camera
                    </button>
                    <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer transition">
                      <Upload className="w-4 h-4 text-amber-400" />
                      Upload Photo
                      <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Location & Map */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-white">2. Set Accurate Location Pin</h2>
              </div>
              <button
                onClick={detectLocation}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                Re-detect GPS
              </button>
            </div>

            {/* Location Search Bar with Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                Search Your Exact Street, Landmark, or Area
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  placeholder="Type street or landmark (e.g. Koramangala 5th Block, Basavanagudi)..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white font-medium text-xs rounded-2xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
                {isSearching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 animate-spin">⏳</span>}
              </div>

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-40 bg-slate-900 border border-slate-700 rounded-2xl mt-1 shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(item)}
                      className="w-full text-left p-3 hover:bg-slate-800 text-xs text-slate-200 border-b border-slate-800/60 transition flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Area Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Bengaluru Area Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(LOCALITY_COORDINATES).map(([locName, locCoords]) => (
                  <button
                    key={locName}
                    onClick={() => selectLocalityPreset(locName, locCoords)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition ${
                      localityName === locName
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    📍 {locName}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Map Picker */}
            <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner">
              <MapView
                pandals={pandals}
                selectedPandal={null}
                onSelectPandal={onSelectPandalOnMap}
                userLocation={coords}
                onUserLocationDrag={handleMapPinSet}
                onMapClick={handleMapPinSet}
              />
            </div>

            {/* Default Street Pandal Name */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Pandal Name (Auto-set as Street Name)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 text-white font-extrabold text-sm rounded-2xl border border-amber-500/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                  Auto Street
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePublishPandal}
              disabled={!photo}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xl transition mt-4 ${
                photo
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
              Publish & Pin Pandal on Map
            </button>
          </div>

        </div>

        {/* Admin Rights: Manage Pandals */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-serif font-extrabold text-lg text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Admin Rights: Edit Pandal Pins
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Modify street names, update photos, edit exact coordinates & manage pins
              </p>
            </div>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-500/30">
              {pandals.length} Total Pandals
            </span>
          </div>

          <div className="space-y-3">
            {pandals.map((pandal) => {
              const isAdminAdded = pandal.id.startsWith('pandal-admin-');
              return (
                <div
                  key={pandal.id}
                  className={`bg-slate-950 p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isAdminAdded ? 'border-amber-500/50' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pandal.coverImage}
                      alt={pandal.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                    />
                    <div>
                      {isAdminAdded && (
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                          Admin Added
                        </span>
                      )}
                      <h4 className="font-bold text-white text-xs leading-snug">{pandal.name}</h4>
                      <p className="text-[11px] text-slate-400">{pandal.locality} • {pandal.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setEditingPandal(pandal)}
                      className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-extrabold rounded-xl border border-amber-500/30 flex items-center gap-1.5 text-xs transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                    <button
                      onClick={() => onDeletePandal(pandal.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition"
                      title="Delete Pandal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Edit Pandal Modal */}
      {editingPandal && (
        <EditPandalModal
          isOpen={!!editingPandal}
          onClose={() => setEditingPandal(null)}
          pandal={editingPandal}
          onSave={(updated) => {
            onUpdatePandal(updated);
            setEditingPandal(null);
            setToast(`Saved changes for "${updated.name}"`);
            setTimeout(() => setToast(''), 3500);
          }}
          onDelete={(id) => {
            onDeletePandal(id);
            setEditingPandal(null);
          }}
        />
      )}

    </div>
  );
}
