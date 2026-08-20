import React from 'react';
import { Plus, Minus, Navigation, Moon, Sun } from 'lucide-react';

export default function MapControls({ onZoomIn, onZoomOut, onLocateMe, mapStyle, onToggleMapStyle }) {
  return (
    <div className="fixed right-4 bottom-24 z-20 flex flex-col gap-1.5 pointer-events-auto font-sans">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <button
          onClick={onZoomIn}
          className="p-2.5 text-gray-600 hover:bg-gray-50 transition border-b border-gray-100 flex items-center justify-center cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2.5 text-gray-600 hover:bg-gray-50 transition flex items-center justify-center cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onLocateMe}
        className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl shadow-lg flex items-center justify-center transition cursor-pointer"
        title="My Location"
      >
        <Navigation className="w-4 h-4 text-[#8B1A1A]" />
      </button>

      <button
        onClick={onToggleMapStyle}
        className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl shadow-lg flex items-center justify-center transition cursor-pointer"
        title={mapStyle === 'dark' ? 'Light Map' : 'Dark Map'}
      >
        {mapStyle === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
      </button>
    </div>
  );
}
