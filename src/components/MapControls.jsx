import React from 'react';
import { Plus, Minus, Navigation, Moon, Sun } from 'lucide-react';

export default function MapControls({ onZoomIn, onZoomOut, onLocateMe, mapStyle, onToggleMapStyle }) {
  return (
    <div className="fixed right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto font-sans">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col divide-y divide-gray-100">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center cursor-pointer active:bg-gray-100"
          title="Zoom In"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center cursor-pointer active:bg-gray-100"
          title="Zoom Out"
        >
          <Minus className="w-4.5 h-4.5" />
        </button>
      </div>

      <button
        onClick={onLocateMe}
        className="w-10 h-10 bg-white/95 backdrop-blur-md border border-gray-200 text-blue-600 hover:bg-gray-50 rounded-2xl shadow-xl flex items-center justify-center transition cursor-pointer active:bg-gray-100"
        title="My Location"
      >
        <Navigation className="w-4.5 h-4.5 text-blue-600" />
      </button>

      {onToggleMapStyle && (
        <button
          onClick={onToggleMapStyle}
          className="w-10 h-10 bg-white/95 backdrop-blur-md border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl shadow-xl flex items-center justify-center transition cursor-pointer active:bg-gray-100"
          title={mapStyle === 'dark' ? 'Light Map' : 'Dark Map'}
        >
          {mapStyle === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-gray-500" />}
        </button>
      )}
    </div>
  );
}
