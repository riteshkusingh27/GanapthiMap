import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BENGALURU_CENTER } from '../data/pandalsData';
import { Sparkles, Leaf, Flame, ShieldCheck, MapPin, Navigation, Clock, Move } from 'lucide-react';

// Fix default leaflet icons broken issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom SVG & Photo Pandal Marker Generator
const createCustomMarkerIcon = (pandal, isSelected) => {
  let borderColor = '#D97706'; // Amber default
  let badgeIcon = '🪔';
  let badgeBgColor = '#D97706';
  let glowColor = 'rgba(217, 119, 6, 0.4)';

  if (pandal.status === 'pending') {
    borderColor = '#6B7280';
    badgeIcon = '⏳';
    badgeBgColor = '#4B5563';
    glowColor = 'rgba(107, 114, 128, 0.3)';
  } else if (pandal.isEcoFriendly) {
    borderColor = '#059669';
    badgeIcon = '🌿';
    badgeBgColor = '#059669';
    glowColor = 'rgba(5, 150, 105, 0.4)';
  } else if (pandal.isFeatured) {
    borderColor = '#D97706';
    badgeIcon = '👑';
    badgeBgColor = '#D97706';
    glowColor = 'rgba(217, 119, 6, 0.6)';
  } else if (pandal.isTrending) {
    borderColor = '#DC2626';
    badgeIcon = '🔥';
    badgeBgColor = '#DC2626';
    glowColor = 'rgba(220, 38, 38, 0.4)';
  }

  const selectedClass = isSelected ? 'scale-125 z-50 ring-4 ring-amber-500 shadow-2xl' : 'hover:scale-110';
  const photoUrl = pandal.coverImage || (pandal.images && pandal.images[0]) || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=300&q=80';

  const html = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${selectedClass}" style="width: 44px; height: 50px;">
      ${pandal.isFeatured ? `<div class="absolute -inset-1 rounded-full bg-amber-400 opacity-50 animate-ping"></div>` : ''}
      
      <!-- Photo Badge Circle -->
      <div class="relative z-10 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center" style="width: 40px; height: 40px; border: 2.5px solid ${borderColor}; box-shadow: 0 6px 14px -3px ${glowColor};">
        <img src="${photoUrl}" alt="${pandal.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        
        <!-- Corner Category Badge -->
        <div class="absolute -bottom-0.5 -right-0.5 text-white rounded-full flex items-center justify-center select-none" style="width: 16px; height: 16px; font-size: 8px; background-color: ${badgeBgColor}; border: 1.5px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ${badgeIcon}
        </div>
      </div>
      
      <!-- Teardrop Arrow -->
      <div class="z-0 shadow-sm" style="width: 10px; height: 10px; margin-top: -5px; transform: rotate(45deg); background-color: #ffffff; border-right: 2px solid ${borderColor}; border-bottom: 2px solid ${borderColor};"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-photo-pandal-marker',
    iconSize: [44, 50],
    iconAnchor: [22, 50],
    popupAnchor: [0, -48]
  });
};

// Component to handle map clicks
function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

// Component to handle map sizing, window resizes, and pan to selected pandal
function MapController({ selectedPandal, userLocation }) {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    map.invalidateSize();
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [map]);

  useEffect(() => {
    if (selectedPandal) {
      map.flyTo([selectedPandal.latitude, selectedPandal.longitude], 15, {
        duration: 1.2
      });
    }
  }, [selectedPandal, map]);

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 });
    }
  }, [userLocation, map]);

  return null;
}

export default function MapView({ pandals, selectedPandal, onSelectPandal, userLocation, onUserLocationDrag, onMapClick }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : BENGALURU_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapController selectedPandal={selectedPandal} userLocation={userLocation} />
        <MapEventsHandler onMapClick={onMapClick} />

        {/* User GPS Location Marker with Drag Capability */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={800}
              pathOptions={{ fillColor: '#2563EB', fillOpacity: 0.12, color: '#1D4ED8', weight: 1.5 }}
            />
            <Marker
              draggable={true}
              position={[userLocation.lat, userLocation.lng]}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  if (onUserLocationDrag) {
                    onUserLocationDrag({ lat: position.lat, lng: position.lng });
                  }
                }
              }}
              icon={L.divIcon({
                html: `
                  <div class="relative flex items-center justify-center cursor-move">
                    <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-white">
                      <span class="text-xs">📍</span>
                    </div>
                    <div class="absolute -inset-1.5 bg-blue-400 rounded-full opacity-40 animate-ping"></div>
                  </div>
                `,
                className: 'user-loc-div',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            >
              <Popup className="rounded-xl">
                <div className="text-xs font-semibold text-slate-800 p-1.5 space-y-1">
                  <div className="font-bold text-blue-700 flex items-center gap-1">📍 Your Location</div>
                  <p className="text-[11px] text-slate-500">Drag this pin if IP geolocation was slightly off!</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Pandal Markers */}
        {pandals.map((pandal) => {
          const isSelected = selectedPandal?.id === pandal.id;
          return (
            <Marker
              key={pandal.id}
              position={[pandal.latitude, pandal.longitude]}
              icon={createCustomMarkerIcon(pandal, isSelected)}
              eventHandlers={{
                click: () => onSelectPandal(pandal)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1.5 min-w-[220px] max-w-[260px] font-sans">
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-slate-900 shadow-inner">
                    <img
                      src={pandal.coverImage}
                      alt={pandal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 border border-amber-500/30">
                      {pandal.isEcoFriendly ? <Leaf className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                      {pandal.locality}
                    </div>
                  </div>

                  <h4 className="font-extrabold text-white text-sm leading-tight mb-1">{pandal.name}</h4>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1 mb-3">{pandal.address}</p>
                  
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5">
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {pandal.darshanTimings?.split('-')[0] || 'Open'}
                    </div>
                    <button
                      onClick={() => onSelectPandal(pandal)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-md shadow-amber-500/25"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
