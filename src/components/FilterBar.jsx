import React from 'react';
import { Sparkles, Leaf, Utensils, Flame, Grid, ChevronDown } from 'lucide-react';
import { LOCALITIES } from '../data/pandalsData';

export default function FilterBar({
  activeFilter,
  onFilterToggle,
  selectedLocality,
  onLocalityChange
}) {
  const filters = [
    { id: 'all', label: 'All Pandals', icon: <Grid className="w-3.5 h-3.5" /> },
    { id: 'featured', label: 'Featured', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'trending', label: 'Trending', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'eco', label: 'Eco-Friendly', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'annadanam', label: 'Prasad Seva', icon: <Utensils className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar max-w-5xl mx-auto px-1 font-sans">
      
      {/* Locality Selector Pill */}
      <div className="relative shrink-0">
        <select
          value={selectedLocality}
          onChange={(e) => onLocalityChange(e.target.value)}
          className="bg-white/95 text-amber-950 font-extrabold text-xs py-2 pl-3.5 pr-8 rounded-2xl border-2 border-amber-300/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
        >
          {LOCALITIES.map((loc) => (
            <option key={loc} value={loc} className="bg-white text-slate-900 font-bold">
              📍 {loc === 'All' ? 'All Bengaluru Areas' : loc}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-amber-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Clean Horizontal Filter Pills */}
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterToggle(filter.id)}
            className={`shrink-0 font-extrabold text-xs py-2 px-4 rounded-2xl transition duration-200 flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/30 border border-amber-400 scale-105'
                : 'bg-white/95 backdrop-blur-xl hover:bg-amber-50 text-slate-700 border-2 border-amber-300/70 shadow-sm'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
