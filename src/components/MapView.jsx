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

// Custom SVG Ganesha Marker Generators
const createCustomMarkerIcon = (pandal, isSelected) => {
  let bgColor = '#D97706'; // Amber default
  let badgeIcon = '🪔';
  let ringColor = 'border-amber-300';
  let glowColor = 'rgba(217, 119, 6, 0.4)';

  if (pandal.status === 'pending') {
    bgColor = '#6B7280';
    badgeIcon = '⏳';
    ringColor = 'border-slate-300';
    glowColor = 'rgba(107, 114, 128, 0.3)';
  } else if (pandal.isEcoFriendly) {
    bgColor = '#059669';
    badgeIcon = '🌿';
    ringColor = 'border-emerald-300';
    glowColor = 'rgba(5, 150, 105, 0.4)';
  } else if (pandal.isFeatured) {
    bgColor = '#D97706';
    badgeIcon = '👑';
    ringColor = 'border-yellow-200';
    glowColor = 'rgba(217, 119, 6, 0.6)';
  } else if (pandal.isTrending) {
    bgColor = '#DC2626';
    badgeIcon = '🔥';
    ringColor = 'border-red-300';
    glowColor = 'rgba(220, 38, 38, 0.4)';
  }

  const selectedClass = isSelected ? 'scale-125 z-50 ring-4 ring-offset-2 ring-amber-500 shadow-2xl' : 'hover:scale-110';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-all duration-300 ${selectedClass}">
      ${pandal.isFeatured ? `<div class="absolute -inset-1.5 rounded-full bg-amber-400 opacity-60 animate-ping"></div>` : ''}
      <div class="relative z-10 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-2xl border-2 ${ringColor}" style="background-color: ${bgColor}; box-shadow: 0 10px 20px -5px ${glowColor};">
        <span class="text-xl font-bold leading-none select-none">${badgeIcon}</span>
      </div>
      <div class="absolute -bottom-1.5 z-0 w-3.5 h-3.5 rotate-45" style="background-color: ${bgColor};"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-pandal-marker-div',
    iconSize: [44, 48],
    iconAnchor: [22, 48],
    popupAnchor: [0, -42]
  });
};

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
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
    }
  }, [userLocation, map]);

  return null;
}

export default function MapView({ pandals, selectedPandal, onSelectPandal, userLocation, onUserLocationDrag }) {
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
                <div className="p-1 min-w-[210px] max-w-[250px] font-sans">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-slate-100 shadow-inner">
                    <img
                      src={pandal.coverImage}
                      alt={pandal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-white/20">
                      {pandal.isEcoFriendly ? <Leaf className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                      {pandal.locality}
                    </div>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{pandal.name}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-2.5">{pandal.address}</p>
                  
                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                    <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" /> {pandal.darshanTimings?.split('-')[0]}
                    </div>
                    <button
                      onClick={() => onSelectPandal(pandal)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-amber-600/20"
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
