import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, MapPin, Navigation, ShieldCheck, ArrowLeft,
  RefreshCw, Upload, Edit3, Trash2, Plus, Search,
  AlertTriangle, Target, CheckCircle2, Loader2, X
} from 'lucide-react';
import MapView from './MapView';
import EditPandalModal from './EditPandalModal';
import { LOCALITY_COORDINATES } from '../data/pandalsData';
import { uploadImageToR2 } from '../lib/r2Storage';

export default function AdminRoutePage({
  pandals, onAddPandal, onUpdatePandal, onDeletePandal, onBackToMap, onSelectPandalOnMap
}) {
  // Photo & Location States
  const [photo, setPhoto]             = useState(null);
  const [coords, setCoords]           = useState({ lat: 12.9716, lng: 77.5946 });
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus]     = useState('idle'); // idle | locating | success | approx | manual
  const [streetName, setStreetName]   = useState('');
  const [localityName, setLocalityName] = useState('Bengaluru');
  const [toast, setToast]             = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery]   = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [isSearching, setIsSearching]   = useState(false);

  // Live Camera
  const [isCapturingLive, setIsCapturingLive] = useState(false);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  // Admin list
  const [editingPandal, setEditingPandal] = useState(null);
  const [toast, setToast]                 = useState('');

  // ─── GPS & Geocoding ────────────────────────────────────────────────────────

  const showToast = (msg, duration = 4000) => {
    setToast(msg);
    setTimeout(() => setToast(''), duration);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const addr   = data.address || {};
        const road   = addr.road || addr.pedestrian || addr.street || addr.suburb || addr.neighbourhood || addr.city_district || 'Main Street';
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || 'Bengaluru';
        setStreetName(`${road} Ganesha Pandal`);
        setLocalityName(suburb);
        return;
      }
    } catch { /* silent */ }
    setStreetName(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    setLocalityName('Bengaluru');
  };

  const detectLocation = () => {
    setGpsStatus('locating');
    setStreetName('Detecting location...');
    if (!navigator.geolocation) {
      setGpsStatus('approx');
      reverseGeocode(coords.lat, coords.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat      = pos.coords.latitude;
        const lng      = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 0);
        setCoords({ lat, lng });
        setGpsAccuracy(accuracy);
        setGpsStatus(accuracy > 500 ? 'approx' : 'success');
        if (accuracy > 500) {
          showToast('Approximate location detected. Refine by clicking the map.');
        } else {
          showToast(`GPS locked — accuracy ${accuracy} m`);
        }
        await reverseGeocode(lat, lng);
      },
      () => {
        setGpsStatus('approx');
        showToast('GPS unavailable. Click the map or search to set location.');
        reverseGeocode(coords.lat, coords.lng);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // ─── Photo Handlers ──────────────────────────────────────────────────────────

  // KEY FEATURE: detect location immediately when a photo is picked
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
    // Fire GPS immediately on photo selection
    detectLocation();
  };

  const startLiveCamera = async () => {
    try {
      setIsCapturingLive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      showToast('Camera access denied. Use upload instead.');
      setIsCapturingLive(false);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width  = videoRef.current.videoWidth  || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg'));
    stopLiveCamera();
    // Fire GPS immediately on camera capture
    detectLocation();
  };

  const stopLiveCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCapturingLive(false);
  };

  // ─── Address Search ──────────────────────────────────────────────────────────

  const handleAddressSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 3) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const q = query.toLowerCase().includes('bengaluru') || query.toLowerCase().includes('bangalore')
        ? query : `${query}, Bengaluru, Karnataka, India`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
      );
      if (res.ok) setSuggestions(await res.json());
    } catch { /* silent */ } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setCoords({ lat, lng });
    setGpsStatus('manual');
    setSuggestions([]);
    setSearchQuery(item.display_name.split(',')[0]);
    showToast('Location updated from search.');
    reverseGeocode(lat, lng);
  };

  const selectLocality = (locName, locCoords) => {
    setCoords(locCoords);
    setGpsStatus('manual');
    setLocalityName(locName);
    reverseGeocode(locCoords.lat, locCoords.lng);
  };

  const handleMapPin = (newCoords) => {
    setCoords(newCoords);
    setGpsStatus('manual');
    reverseGeocode(newCoords.lat, newCoords.lng);
  };

  // ─── Publish ─────────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!photo) { showToast('Please capture or upload a photo first.'); return; }
    const name = streetName || 'New Pandal';
    
    setIsUploading(true);
    showToast('Uploading photo to Cloudflare R2 storage...');
    const r2Url = await uploadImageToR2(photo);
    const finalPhoto = r2Url || photo;
    setIsUploading(false);

    const newPandal = {
      id: `pandal-admin-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      locality: localityName,
      address: `${name}, ${localityName}, Bengaluru`,
      latitude: coords.lat,
      longitude: coords.lng,
      establishmentYear: new Date().getFullYear(),
      edition: '1st Year',
      theme: '',
      idolType: '',
      isEcoFriendly: true,
      isFeatured: false,
      isTrending: true,
      status: 'verified',
      darshanTimings: '',
      aartiTimings: '',
      annadanam: { available: false, timings: '', description: '' },
      facilities: { parking: false, toilets: false, drinkingWater: false, accessibility: false, firstAid: false },
      crowdLevel: 'Low',
      coverImage: finalPhoto,
      images: [finalPhoto],
      description: '',
      events: [],
      organizer: { claimed: true, name: '', contact: '' },
      likesCount: 1,
      checkinsCount: 1,
    };
    onAddPandal(newPandal);
    showToast(`Published "${name}" with R2 image to map.`);
    setPhoto(null);
    setStreetName('');
    setGpsStatus('idle');
  };

  // ─── GPS status label ─────────────────────────────────────────────────────────

  const gpsLabel = {
    idle:     { color: 'text-slate-400',    text: 'Not detected' },
    locating: { color: 'text-amber-400',    text: 'Detecting...' },
    success:  { color: 'text-emerald-400',  text: gpsAccuracy ? `Accurate (${gpsAccuracy} m)` : 'GPS locked' },
    approx:   { color: 'text-amber-400',    text: 'Approximate — refine on map' },
    manual:   { color: 'text-blue-400',     text: 'Manual pin set' },
  }[gpsStatus] || { color: 'text-slate-400', text: '' };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans flex flex-col relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
          {pandals.length} pandals in database
        </span>
      </header>

      {/* IP location warning */}
      {gpsStatus === 'approx' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Approximate location. Click the map or search to set the exact spot.</span>
          </div>
          <button
            onClick={detectLocation}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0 transition"
          >
            Retry GPS
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-5">

        {/* ── Add Pandal Card ── */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* Section header */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Add New Pandal</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Photo + GPS location is auto-detected on capture</p>
            </div>
            <div className={`text-[11px] font-semibold flex items-center gap-1.5 ${gpsLabel.color}`}>
              {gpsStatus === 'locating'
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Navigation className="w-3 h-3" />
              }
              {gpsLabel.text}
            </div>
          </div>

          <div className="p-5 space-y-5">

            {/* Photo Capture */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Photo
              </label>

              {/* Live camera view */}
              {isCapturingLive ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    <button
                      onClick={captureSnapshot}
                      className="bg-white text-slate-900 font-bold text-xs px-5 py-2 rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Capture
                    </button>
                    <button
                      onClick={stopLiveCamera}
                      className="bg-slate-700 text-white text-xs px-4 py-2 rounded-full flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : photo ? (
                /* Photo preview */
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group bg-slate-950">
                  <img src={photo} alt="Pandal" className="w-full h-full object-cover" />

                  {/* GPS status overlay on photo */}
                  <div className="absolute top-2 right-2">
                    {gpsStatus === 'locating' && (
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Detecting location...
                      </div>
                    )}
                    {gpsStatus === 'success' && (
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        GPS locked — {gpsAccuracy} m
                      </div>
                    )}
                    {gpsStatus === 'approx' && (
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Approximate
                      </div>
                    )}
                    {gpsStatus === 'manual' && (
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <MapPin className="w-3 h-3" />
                        Manual pin
                      </div>
                    )}
                  </div>

                  {/* Retake on hover */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => setPhoto(null)}
                      className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retake
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 bg-slate-950">
                  <Camera className="w-8 h-8 text-slate-600" />
                  <p className="text-[11px] text-slate-500 text-center max-w-xs font-medium">
                    Capturing a photo will automatically detect the GPS location of where you are standing
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={startLiveCamera}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Open Camera
                    </button>
                    <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Location — only shown after photo is set */}
            {photo && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Location
                  </label>
                  <button
                    onClick={detectLocation}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    <RefreshCw className={`w-3 h-3 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                    Re-detect GPS
                  </button>
                </div>

                {/* Coords display */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-slate-500 font-medium mb-0.5">Latitude</p>
                    <p className="text-sm font-mono font-bold text-white">{coords.lat.toFixed(6)}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-slate-500 font-medium mb-0.5">Longitude</p>
                    <p className="text-sm font-mono font-bold text-white">{coords.lng.toFixed(6)}</p>
                  </div>
                </div>

                {/* Address Search */}
                <div className="relative">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleAddressSearch(e.target.value)}
                      placeholder="Search street or landmark..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 text-white text-xs font-medium rounded-xl border border-slate-800 focus:border-slate-600 focus:outline-none placeholder:text-slate-600"
                    />
                    {isSearching && (
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-40 bg-slate-900 border border-slate-700 rounded-xl mt-1 shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                      {suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectSuggestion(item)}
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-800 text-xs text-slate-300 border-b border-slate-800/60 transition flex items-center gap-2"
                        >
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{item.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Locality presets */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(LOCALITY_COORDINATES).map(([locName, locCoords]) => (
                    <button
                      key={locName}
                      onClick={() => selectLocality(locName, locCoords)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        localityName === locName
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {locName}
                    </button>
                  ))}
                </div>

                {/* Map Picker */}
                <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800">
                  <MapView
                    pandals={pandals}
                    selectedPandal={null}
                    onSelectPandal={onSelectPandalOnMap}
                    userLocation={coords}
                    onUserLocationDrag={handleMapPin}
                    onMapClick={handleMapPin}
                  />
                </div>

                {/* Auto street name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pandal Name
                  </label>
                  <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 text-white text-sm font-semibold rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-none"
                    placeholder="Auto-filled from GPS address..."
                  />
                </div>

                {/* Publish */}
                <button
                  onClick={handlePublish}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 transition shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Publish to Map
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Manage Pandals ── */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Manage Pandals</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Edit details, update photos, remove pins</p>
            </div>
            <span className="text-[11px] text-slate-500">{pandals.length} total</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {pandals.map((pandal) => {
              const isNew = pandal.id.startsWith('pandal-admin-');
              return (
                <div key={pandal.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/40 transition">
                  <img
                    src={pandal.coverImage}
                    alt={pandal.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">{pandal.name}</p>
                      {isNew && (
                        <span className="shrink-0 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{pandal.locality}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingPandal(pandal)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePandal(pandal.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Edit Modal */}
      {editingPandal && (
        <EditPandalModal
          isOpen={!!editingPandal}
          onClose={() => setEditingPandal(null)}
          pandal={editingPandal}
          onSave={(updated) => {
            onUpdatePandal(updated);
            setEditingPandal(null);
            showToast(`Saved changes for "${updated.name}"`);
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
