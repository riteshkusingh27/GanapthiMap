import React from 'react';
import { Plus, Minus, Navigation, Moon, Sun } from 'lucide-react';

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  mapStyle,
  onToggleMapStyle
}) {
  return (
    <div className="fixed right-4 bottom-6 z-20 flex flex-col gap-2 pointer-events-auto font-sans">
      
      {/* Zoom In & Zoom Out Stack */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-md overflow-hidden flex flex-col">
        <button
          onClick={onZoomIn}
          className="p-2.5 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100 flex items-center justify-center cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2.5 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* GPS Location Button */}
      <button
        onClick={onLocateMe}
        className="p-2.5 bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 rounded-xl shadow-md flex items-center justify-center transition cursor-pointer"
        title="Locate My Position"
      >
        <Navigation className="w-4 h-4 fill-slate-700 text-slate-700" />
      </button>

      {/* Map Style Toggle Button */}
      <button
        onClick={onToggleMapStyle}
        className="p-2.5 bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 rounded-xl shadow-md flex items-center justify-center transition cursor-pointer"
        title={mapStyle === 'dark' ? "Switch to Light Map" : "Switch to Dark Map"}
      >
        {mapStyle === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
      </button>
    </div>
  );
}
