import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, MapPin, Navigation, ArrowLeft,
  CheckCircle2, Loader2, Sparkles, Leaf, Utensils, RefreshCw
} from 'lucide-react';
import MapView from './MapView';
import { getUserIp, checkIpCooldown, recordIpSubmission, savePandalToSupabase } from '../lib/supabase';

export default function AddPandalPage({ onAddPandal, onBackToMap }) {
  // Photo & Location States
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle | locating | success | approx | manual
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [pandalName, setPandalName] = useState('');
  const [localityName, setLocalityName] = useState('Bengaluru');
  const [isEcoFriendly, setIsEcoFriendly] = useState(true);
  const [hasPrasad, setHasPrasad] = useState(false);
  const [toast, setToast] = useState('');

  // Camera Live Stream
  const [isCapturingLive, setIsCapturingLive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Reverse Geocoding
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.street || addr.suburb || addr.neighbourhood || 'Main Road';
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || 'Bengaluru';
        setPandalName(`${road} Ganesha Pandal`);
        setLocalityName(suburb);
        return;
      }
    } catch { /* silent fallback */ }
    setPandalName(`Ganesha Pandal (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    setLocalityName('Bengaluru');
  };

  const geoWatchRef = useRef(null);
  const bestAccuracyRef = useRef(Infinity);

  useEffect(() => {
    return () => {
      if (geoWatchRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchRef.current);
      }
    };
  }, []);

  // Ultra-Precise Continuous GPS Refinement for Mobile Devices
  const detectLocation = () => {
    setGpsStatus('locating');
    bestAccuracyRef.current = Infinity;

    if (!navigator.geolocation) {
      setGpsStatus('approx');
      reverseGeocode(coords.lat, coords.lng);
      return;
    }

    if (geoWatchRef.current !== null) {
      navigator.geolocation.clearWatch(geoWatchRef.current);
      geoWatchRef.current = null;
    }

    showToast('Warming up satellite GPS for precise spot...');

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 999);

        if (accuracy < bestAccuracyRef.current) {
          bestAccuracyRef.current = accuracy;
          setCoords({ lat, lng });
          setGpsAccuracy(accuracy);
          await reverseGeocode(lat, lng);

          if (accuracy <= 30) {
            setGpsStatus('success');
            showToast(`GPS Locked: High Precision (${accuracy}m accuracy)!`);
            if (geoWatchRef.current !== null) {
              navigator.geolocation.clearWatch(geoWatchRef.current);
              geoWatchRef.current = null;
            }
          } else {
            setGpsStatus('locating');
            showToast(`Refining GPS accuracy: ~${accuracy}m...`);
          }
        }
      },
      (err) => {
        setGpsStatus('approx');
        if (err && err.code === 1) {
          showToast('HTTP connection detected: Tap the map below to select your exact location!');
        } else {
          showToast('Location fallback loaded. Tap map to select your spot!');
        }
        reverseGeocode(coords.lat, coords.lng);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );

    geoWatchRef.current = watchId;

    // Safety timeout: stop watching after 12s
    setTimeout(() => {
      if (geoWatchRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchRef.current);
        geoWatchRef.current = null;
        setGpsStatus(bestAccuracyRef.current <= 150 ? 'success' : 'approx');
      }
    }, 12000);
  };

  // Photo File / Camera Select Handler
  const handlePhotoSelect = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      detectLocation(); // Auto detect location instantly when photo is taken
    };
    reader.readAsDataURL(file);
  };

  // Start Live Camera
  const startLiveCamera = async () => {
    try {
      setIsCapturingLive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      showToast('Camera access denied or unavailable.');
      setIsCapturingLive(false);
    }
  };

  // Snap Snapshot
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhoto(dataUrl);

    // Stop Camera Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCapturingLive(false);

    // Trigger high-accuracy location at the exact moment photo is clicked
    detectLocation();
  };

  const handleMapClick = (newCoords) => {
    setCoords(newCoords);
    setGpsStatus('manual');
    reverseGeocode(newCoords.lat, newCoords.lng);
  };

  // Auto-detect GPS location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pandalName.trim()) {
      showToast('Please enter a pandal name');
      return;
    }

    // IP Cooldown check
    const uploaderIp = await getUserIp();
    const cooldown = checkIpCooldown(uploaderIp);
    if (!cooldown.allowed) {
      showToast(cooldown.message);
      return;
    }

    const defaultCover = 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80';
    const finalPhoto = photo || defaultCover;

    const newPandal = {
      id: `pandal-${Date.now()}`,
      name: pandalName.trim(),
      slug: pandalName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      locality: localityName || 'Bengaluru',
      address: `${pandalName}, ${localityName}, Bengaluru`,
      latitude: coords.lat,
      longitude: coords.lng,
      establishmentYear: new Date().getFullYear(),
      edition: '2025 Edition',
      theme: 'Community Festival Pandal',
      idolType: isEcoFriendly ? 'Clay Eco Idol' : 'Traditional Idol',
      isEcoFriendly: isEcoFriendly,
      isFeatured: false,
      isTrending: true,
      status: 'verified',
      darshanTimings: '06:00 AM - 10:00 PM',
      aartiTimings: '08:00 AM & 07:30 PM',
      annadanam: {
        available: hasPrasad,
        timings: hasPrasad ? '12:30 PM - 03:30 PM' : '',
        description: hasPrasad ? 'Maha Prasad distribution' : ''
      },
      facilities: {
        parking: true,
        toilets: true,
        drinkingWater: true,
        accessibility: true,
        firstAid: true
      },
      crowdLevel: 'Moderate',
      coverImage: finalPhoto,
      images: [finalPhoto],
      description: `Newly submitted pandal located in ${localityName}, Bengaluru.`,
      uploaderIp: uploaderIp,
      likesCount: 1,
      checkinsCount: 1
    };

    recordIpSubmission(uploaderIp);
    savePandalToSupabase(newPandal, uploaderIp);
    onAddPandal(newPandal);
    showToast('Pandal published & saved to DB!');
    setTimeout(() => {
      onBackToMap();
    }, 1000);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#FAFAFA] text-gray-900 font-sans antialiased flex flex-col overflow-y-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-gray-700">
          <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Clean White Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3.5 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            aria-label="Back to Map"
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            title="Back to Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 tracking-tight">Add Your Pandal</h1>
            <p className="text-[11px] text-gray-400 font-medium">Snap photo & lock exact location</p>
          </div>
        </div>

        <button
          onClick={onBackToMap}
          className="text-xs font-bold text-[#8B1A1A] hover:underline"
        >
          Cancel
        </button>
      </header>

      {/* Main Scrollable Form Body */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-20 overflow-y-auto">
        
        {/* STEP 1: CLICK LIVE PHOTO */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B1A1A] text-white text-xs flex items-center justify-center font-bold">1</span>
              Photo of Pandal (Optional)
            </h2>
            {photo && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Set
              </span>
            )}
          </div>

          {/* Camera View / Snap Button */}
          {photo ? (
            /* Photo Preview */
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-100 shadow-sm">
              <img src={photo} alt="Pandal captured photo" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
              </div>
              <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-gray-700 hover:text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1 transition cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Change Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            /* Native Mobile Camera Snap Button */
            <label className="w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#8B1A1A]/5 to-amber-50/30 border-2 border-dashed border-[#8B1A1A]/30 rounded-2xl hover:border-[#8B1A1A] transition text-center group cursor-pointer shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#8B1A1A] text-white flex items-center justify-center mb-2 shadow-lg shadow-[#8B1A1A]/20 group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-sm font-black text-gray-900">Click Photo of Pandal</span>
              <span className="text-[11px] text-gray-500 mt-0.5 font-medium">Takes live photo on phone & locks GPS location</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          )}
        </section>

        {/* STEP 2: GPS LOCATION DETECTED & MAP PREVIEW — ALWAYS VISIBLE */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B1A1A] text-white text-xs flex items-center justify-center font-bold">2</span>
              Location & Map Pin
            </h2>
            {gpsStatus === 'locating' ? (
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting GPS...
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {gpsAccuracy ? `Locked (${gpsAccuracy}m)` : 'Location Set'}
              </span>
            )}
          </div>

          {/* Address Info */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-1">
            <p className="text-xs font-bold text-gray-900">{pandalName}</p>
            <p className="text-[11px] text-gray-500">Locality: <span className="font-semibold text-gray-800">{localityName}</span></p>
            <p className="text-[10px] text-gray-400 font-mono">Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
          </div>

          {/* Interactive Map Preview */}
          <div className="h-56 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
            <MapView
              pandals={[]}
              userLocation={coords}
              onMapClick={handleMapClick}
            />
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm border border-gray-200">
              Tap anywhere on map to position pin
            </div>
          </div>
        </section>

        {/* STEP 3: PANDAL DETAILS & SUBMIT — ALWAYS VISIBLE */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#8B1A1A] text-white text-xs flex items-center justify-center font-bold">3</span>
            Pandal Details
          </h2>

          {/* Pandal Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Pandal Name</label>
            <input
              type="text"
              value={pandalName}
              onChange={(e) => setPandalName(e.target.value)}
              placeholder="e.g. APS College Grounds Ganesha"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#8B1A1A]/40 focus:outline-none transition"
              required
            />
          </div>

          {/* Locality Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Area / Locality</label>
            <input
              type="text"
              value={localityName}
              onChange={(e) => setLocalityName(e.target.value)}
              placeholder="e.g. Basavanagudi"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#8B1A1A]/40 focus:outline-none transition"
              required
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
              isEcoFriendly ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              <input
                type="checkbox"
                checked={isEcoFriendly}
                onChange={(e) => setIsEcoFriendly(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Eco Clay Idol
            </label>

            <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
              hasPrasad ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              <input
                type="checkbox"
                checked={hasPrasad}
                onChange={(e) => setHasPrasad(e.target.checked)}
                className="rounded text-amber-600"
              />
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              Prasad Seva
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#a82323] hover:from-[#721515] hover:to-[#8B1A1A] active:scale-98 text-white font-black text-sm py-3.5 rounded-xl shadow-lg shadow-[#8B1A1A]/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4" />
            Publish Pandal to Map
          </button>
        </form>

      </main>

    </div>
  );
}
