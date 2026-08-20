import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Navigation, Sparkles, ShieldCheck, CheckCircle2, ArrowLeft, RefreshCw, Upload, Edit3, Trash2, Eye, Info, Plus } from 'lucide-react';
import MapView from './MapView';
import EditPandalModal from './EditPandalModal';

export default function AdminRoutePage({ pandals, onAddPandal, onUpdatePandal, onDeletePandal, onBackToMap, onSelectPandalOnMap }) {
  // Photo & Location States
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bengaluru center
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle, locating, success, error
  const [streetName, setStreetName] = useState('Detecting street name...');
  const [localityName, setLocalityName] = useState('Bengaluru Central');
  const [isCapturingLive, setIsCapturingLive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Modal State
  const [editingPandal, setEditingPandal] = useState(null);
  const [toast, setToast] = useState('');

  // Auto-detect GPS coordinates & street name on load
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
          setCoords({ lat, lng });
          setGpsStatus('success');
          await reverseGeocode(lat, lng);
        },
        (error) => {
          console.warn("Geolocation error", error);
          setGpsStatus('error');
          reverseGeocode(12.9716, 77.5946);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsStatus('error');
      reverseGeocode(12.9716, 77.5946);
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

  // Handle Photo Capture from File Input
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

  // Live Camera Stream
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

  // Drag pin on map handler
  const handleMapPinDrag = (newCoords) => {
    setCoords(newCoords);
    reverseGeocode(newCoords.lat, newCoords.lng);
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
    setToast(`✅ Published "${streetName}" to map successfully!`);
    setPhoto(null);
    setTimeout(() => setToast(''), 4000);
  };

  const adminAddedPandals = pandals.filter(p => p.id.startsWith('pandal-admin-'));

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
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
                Instant Photo & Location Pandal Pinning
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1.5 rounded-full border border-amber-500/40">
            📍 GPS & Camera Sync Active
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Camera Capture Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-white">1. Capture Pandal Photo</h2>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">Quick Admin Pinning</span>
            </div>

            {/* Live Camera Feed or Photo Upload */}
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
                    Click photo using device camera or upload image of the Ganesha pandal
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

            {/* GPS Coordinates & Auto Street Name */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h2 className="font-bold text-base text-white">2. Auto-Location & Street Name</h2>
                </div>
                <button
                  onClick={detectLocation}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                  Re-detect GPS
                </button>
              </div>

              {/* Status Banner */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">GPS Status:</div>
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <Navigation className="w-3.5 h-3.5 animate-pulse" />
                    Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 font-medium">Area Locality:</div>
                  <div className="font-bold text-amber-400">{localityName}</div>
                </div>
              </div>

              {/* Default Street Pandal Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Default Pandal Name (Street Name)
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

              {/* Other Details Preview (Set to Not added) */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
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
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  💡 Admin can edit all details later using the Admin Rights console below.
                </p>
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

        {/* Right Column: Live Map Preview & Coordinates Adjuster (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                3. Live Map Location Pin
              </h2>
              <span className="text-xs text-slate-400 font-medium">Drag blue pin to adjust</span>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-slate-800">
              <MapView
                pandals={pandals}
                selectedPandal={null}
                onSelectPandal={onSelectPandalOnMap}
                userLocation={coords}
                onUserLocationDrag={handleMapPinDrag}
              />
            </div>
            
            <p className="text-xs text-slate-400 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              📍 Drag the blue pin on the map to pinpoint exact coordinates before clicking Publish.
            </p>
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
                Admin Rights: Edit Captured & Existing Pandals
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Admin can modify street names, update photos, add descriptions & manage pins
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
