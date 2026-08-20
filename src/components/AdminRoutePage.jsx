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

          // If accuracy is worse than 500 meters, it's likely IP-based approximate location on desktop
          if (accuracy > 500) {
            setGpsStatus('ip_approx');
            setToast('⚠️ IP Location detected (~' + (accuracy / 1000).toFixed(1) + ' km approx). Please search or click map for exact spot!');
          } else {
            setGpsStatus('success');
            setToast('🎯 High-Accuracy GPS position locked (±' + accuracy + 'm)!');
          }
          setTimeout(() => setToast(''), 4500);
          await reverseGeocode(lat, lng);
        },
        (error) => {
          console.warn("Geolocation error", error);
          setGpsStatus('ip_approx');
          setToast('⚠️ GPS access denied or unavailable. Please click your spot on map or search area below.');
          setTimeout(() => setToast(''), 4500);
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
    setToast(`🎯 Pinned exact spot (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})!`);
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
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-extrabold flex items-center gap-2 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-base leading-none text-white">
                Admin <span className="text-amber-500">/admin</span> Route
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Accurate Location & Photo Pandal Pinning
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-500/40">
            🎯 Pin Point Accuracy Enabled
          </span>
        </div>
      </header>

      {/* IP Location Warning Alert if IP-based */}
      {(gpsStatus === 'ip_approx' || (gpsAccuracy && gpsAccuracy > 500)) && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 text-xs text-amber-300 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Notice on Desktop Browsers:</strong> Device location from browser Wi-Fi/IP can be a few km off. 
              <strong> Please search your street or click directly on the map below</strong> to pin your exact location!
            </span>
          </div>
          <button
            onClick={detectLocation}
            className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg shrink-0 text-[11px] hover:bg-amber-400 transition"
          >
            Re-detect GPS
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Photo & Location Setup (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-5">
            
            {/* Step 1: Photo Capture */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-white">1. Capture Pandal Photo</h2>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">Quick Admin Pinning</span>
            </div>

            <div className="relative w-full aspect-video rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/40 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
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

            {/* Step 2: Accurate Location Search & Pinning */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h2 className="font-bold text-base text-white">2. Set Accurate Location</h2>
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
                  Search Your Exact Building, Street or Area Name
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    placeholder="Type your area, street or landmark (e.g. Koramangala 5th Block, Basavanagudi)..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white font-medium text-xs rounded-xl border border-amber-500/40 focus:border-amber-500 focus:outline-none"
                  />
                  {isSearching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 animate-spin">⏳</span>}
                </div>

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-40 bg-slate-900 border border-amber-500/50 rounded-xl mt-1 shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition ${
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

              {/* Coordinates Badge & Manual Edit */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Current Location Pin:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    gpsStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {gpsStatus === 'success' ? 'High Accuracy GPS' : 'Custom / Map Pinned'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Lat:</span>
                    <input
                      type="number"
                      step="any"
                      value={coords.lat}
                      onChange={(e) => handleMapPinSet({ ...coords, lat: parseFloat(e.target.value) || 0 })}
                      className="w-28 text-right bg-transparent text-emerald-400 font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Lng:</span>
                    <input
                      type="number"
                      step="any"
                      value={coords.lng}
                      onChange={(e) => handleMapPinSet({ ...coords, lng: parseFloat(e.target.value) || 0 })}
                      className="w-28 text-right bg-transparent text-emerald-400 font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-950/60 p-2.5 rounded-xl border border-blue-800/60 flex items-center gap-2 text-xs text-blue-300 font-medium">
                  <Target className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Click anywhere on the map on the right to place the pin on your exact building/road!</span>
                </div>
              </div>

              {/* Default Street Pandal Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Pandal Name (Auto-set as Street Name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white font-extrabold text-sm rounded-xl border border-amber-500/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                    Auto Street
                  </span>
                </div>
              </div>

              {/* Other Details Preview */}
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
                  <Info className="w-4 h-4" />
                  <span>Other Pandal Details:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-medium">
                  <div>• Description: <span className="text-slate-500 font-bold">Not added</span></div>
                  <div>• Theme / Mandap: <span className="text-slate-500 font-bold">Not added</span></div>
                  <div>• Timings: <span className="text-slate-500 font-bold">Not added</span></div>
                  <div>• Organizer: <span className="text-slate-500 font-bold">Not added</span></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePublishPandal}
                disabled={!photo}
                className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xl transition ${
                  photo
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-500/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                Publish & Pin Pandal on Map
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Interactive Map Pinning (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                3. Interactive Map Pinning
              </h2>
              <span className="text-xs text-emerald-400 font-extrabold">Click map or drag pin</span>
            </div>

            <div className="w-full h-96 rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner">
              <MapView
                pandals={pandals}
                selectedPandal={null}
                onSelectPandal={onSelectPandalOnMap}
                userLocation={coords}
                onUserLocationDrag={handleMapPinSet}
                onMapClick={handleMapPinSet}
              />
            </div>
            
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-amber-400 font-extrabold">
                🎯 Click anywhere on the map above to move the pin instantly!
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                The street name and coordinates will automatically update to your clicked location.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Rights: Manage & Edit Pandals Section */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4 mb-10">
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-serif font-extrabold text-lg text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Admin Rights: Manage & Edit Pandal Pins
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Admin can modify street names, update photos, edit exact coordinates & manage pins
              </p>
            </div>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30">
              {pandals.length} Total Pandals
            </span>
          </div>

          {/* Pandals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pandals.map((pandal) => {
              const isAdminAdded = pandal.id.startsWith('pandal-admin-');
              return (
                <div
                  key={pandal.id}
                  className={`bg-slate-950 p-4 rounded-2xl border transition space-y-3 ${
                    isAdminAdded ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={pandal.coverImage}
                      alt={pandal.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {isAdminAdded && (
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider mb-1 inline-block">
                          Admin Added
                        </span>
                      )}
                      <h4 className="font-bold text-white text-xs leading-snug truncate">{pandal.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{pandal.locality} • {pandal.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <button
                      onClick={() => setEditingPandal(pandal)}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-extrabold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                    <button
                      onClick={() => onDeletePandal(pandal.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-xl transition"
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
