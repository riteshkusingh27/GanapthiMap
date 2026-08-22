import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BENGALURU_CENTER } from '../data/pandalsData';
import { Sparkles, Leaf, Clock } from 'lucide-react';

// Strict Bengaluru Region Boundaries
const BENGALURU_BOUNDS = [
  [12.70, 77.30],
  [13.25, 77.85]
];

// Haversine distance in km
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

// Compass bearing (degrees) from point A to point B
const bearingDeg = (lat1, lng1, lat2, lng2) => {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1R = (lat1 * Math.PI) / 180;
  const lat2R = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2R);
  const x =
    Math.cos(lat1R) * Math.sin(lat2R) -
    Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180) / Math.PI;
};

// Interpolate a point t% along the line from A to B (t: 0–1)
const interpolate = (lat1, lng1, lat2, lng2, t) => ([
  lat1 + (lat2 - lat1) * t,
  lng1 + (lng2 - lng1) * t,
]);

// Format minutes to human-readable string
const fmtMin = (mins) => {
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${Math.round(mins)} min`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Walk: 4.5 km/h  |  Drive: 20 km/h (Bengaluru city traffic)
const travelTimes = (distKm) => ({
  walk:  fmtMin((distKm / 4.5)  * 60),
  drive: fmtMin((distKm / 20)   * 60),
});

// Direction line + distance badge + arrow marker overlay
function DirectionOverlay({ from, to, distKm }) {
  const bearing = bearingDeg(from[0], from[1], to[0], to[1]);
  const mid     = interpolate(from[0], from[1], to[0], to[1], 0.5);
  const arrow   = interpolate(from[0], from[1], to[0], to[1], 0.62);

  const distLabel = distKm < 1
    ? `${Math.round(distKm * 1000)} m`
    : `${distKm.toFixed(1)} km`;

  const { walk, drive } = travelTimes(distKm);

  // Combined distance + time badge at midpoint
  const badgeIcon = L.divIcon({
    html: `
      <div style="
        background: white;
        border: 2px solid #7A1C1C;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        overflow: hidden;
        white-space: nowrap;
        font-family: system-ui, sans-serif;
      ">
        <!-- Distance header -->
        <div style="
          background: #7A1C1C;
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          text-align: center;
          letter-spacing: 0.03em;
        ">${distLabel}</div>
        <!-- Walk + Drive row -->
        <div style="
          display: flex;
          align-items: center;
          gap: 0;
        ">
          <div style="
            flex: 1;
            text-align: center;
            padding: 3px 8px;
            border-right: 1px solid #f0e0e0;
          ">
            <div style="font-size: 8px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Walk</div>
            <div style="font-size: 10px; color: #7A1C1C; font-weight: 800;">${walk}</div>
          </div>
          <div style="
            flex: 1;
            text-align: center;
            padding: 3px 8px;
          ">
            <div style="font-size: 8px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Drive</div>
            <div style="font-size: 10px; color: #7A1C1C; font-weight: 800;">${drive}</div>
          </div>
        </div>
      </div>`,
    className: '',
    iconAnchor: [0, 0],
  });

  // Arrow marker — SVG triangle rotated to bearing
  const arrowIcon = L.divIcon({
    html: `
      <div style="
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        transform: rotate(${bearing}deg);
      ">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" fill="white" stroke="#7A1C1C" stroke-width="2"/>
          <polygon points="14,5 21,20 14,16 7,20" fill="#7A1C1C"/>
        </svg>
      </div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  return (
    <>
      {/* Dashed direction line */}
      <Polyline
        positions={[from, to]}
        pathOptions={{
          color: '#7A1C1C',
          weight: 2.5,
          dashArray: '8 7',
          lineCap: 'round',
          opacity: 0.85,
        }}
      />
      {/* Distance + time label at midpoint */}
      <Marker position={mid} icon={badgeIcon} />
      {/* Directional arrow at 62% along line */}
      <Marker position={arrow} icon={arrowIcon} />
    </>
  );
}

// Fix default leaflet icons broken issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom SVG & Photo Pandal Marker Generator
const createCustomMarkerIcon = (pandal, isSelected) => {
  let borderColor = '#7A1C1C';
  let badgeBgColor = '#7A1C1C';

  if (pandal.isEcoFriendly) {
    borderColor = '#059669';
    badgeBgColor = '#059669';
  } else if (pandal.isFeatured) {
    borderColor = '#D97706';
    badgeBgColor = '#D97706';
  } else if (pandal.isTrending) {
    borderColor = '#DC2626';
    badgeBgColor = '#DC2626';
  }

  const selectedClass = isSelected ? 'scale-125 z-50 ring-4 ring-[#7A1C1C] shadow-2xl' : 'hover:scale-110';
  const photoUrl = pandal.coverImage || (pandal.images && pandal.images[0]) || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=300&q=80';

  const html = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${selectedClass}" style="width: 44px; height: 50px;">
      ${pandal.isFeatured ? `<div class="absolute -inset-1 rounded-full bg-amber-400 opacity-40 animate-ping"></div>` : ''}
      
      <!-- Photo Badge Circle -->
      <div class="relative z-10 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center" style="width: 40px; height: 40px; border: 2.5px solid ${borderColor}; shadow: 0 4px 10px rgba(0,0,0,0.15);">
        <img src="${photoUrl}" alt="${pandal.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        
        <!-- Corner Status Dot -->
        <div class="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center select-none" style="width: 12px; height: 12px; background-color: ${badgeBgColor}; border: 2px solid #ffffff;">
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

function MapController({ selectedPandal, userLocation, setMapInstance }) {
  const map = useMap();

  useEffect(() => {
    if (setMapInstance) {
      setMapInstance(map);
    }
  }, [map, setMapInstance]);

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
    if (selectedPandal && !isNaN(Number(selectedPandal.latitude)) && !isNaN(Number(selectedPandal.longitude))) {
      map.flyTo([Number(selectedPandal.latitude), Number(selectedPandal.longitude)], 15, {
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

export default function MapView({ pandals, selectedPandal, onSelectPandal, userLocation, onUserLocationDrag, onMapClick, mapStyle = 'light', setMapInstance, nearestPandal }) {
  const tileUrl = mapStyle === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : BENGALURU_CENTER}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        maxBounds={BENGALURU_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
          maxZoom={19}
        />

        <MapController selectedPandal={selectedPandal} userLocation={userLocation} setMapInstance={setMapInstance} />
        <MapEventsHandler onMapClick={onMapClick} />

        {/* Direction line to nearest pandal */}
        {userLocation && nearestPandal && (
          <DirectionOverlay
            from={[userLocation.lat, userLocation.lng]}
            to={[nearestPandal.pandal.latitude, nearestPandal.pandal.longitude]}
            distKm={nearestPandal.distKm}
          />
        )}

        {/* User Location Pin */}
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
                    <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
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
                  <div className="font-bold text-blue-700">Your Location</div>
                  <p className="text-[11px] text-slate-500">Drag to adjust your exact spot in Bengaluru</p>
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
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-inner">
                    <img
                      src={pandal.coverImage}
                      alt={pandal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[#7A1C1C] text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-slate-200 shadow-sm">
                      {pandal.isEcoFriendly ? <Leaf className="w-3 h-3 text-emerald-600" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                      {pandal.locality}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{pandal.name}</h4>
                  <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mb-3">{pandal.address}</p>
                  
                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                    <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> {pandal.darshanTimings?.split('-')[0] || 'Open'}
                    </div>
                    <button
                      onClick={() => onSelectPandal(pandal)}
                      className="bg-[#7A1C1C] hover:bg-[#601616] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm"
                    >
                      Details
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
