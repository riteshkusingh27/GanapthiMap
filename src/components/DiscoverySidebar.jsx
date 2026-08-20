import React from 'react';
import { ChevronLeft, ChevronRight, Search, CheckCircle, Star } from 'lucide-react';

export default function DiscoverySidebar({
  pandals,
  selectedPandal,
  onSelectPandal,
  isOpen,
  onToggleOpen,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterToggle
}) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'near_me', label: 'Near me' },
    { id: 'trending', label: 'Trending' },
    { id: 'eco', label: 'Eco-friendly' },
    { id: 'annadanam', label: 'Prasad Seva' },
  ];

  return (
    <aside
      className={`fixed top-4 bottom-4 left-4 z-30 transition-all duration-300 ease-in-out font-sans ${
        isOpen ? 'w-80 sm:w-96 translate-x-0' : 'w-0 -translate-x-full pointer-events-none'
      }`}
    >
      {/* Toggle Tab Button attached to right edge */}
      <button
        onClick={onToggleOpen}
        className={`pointer-events-auto absolute top-6 -right-9 w-9 h-11 bg-white border border-slate-200 text-slate-700 rounded-r-xl shadow-md flex items-center justify-center transition hover:bg-slate-50 cursor-pointer ${
          !isOpen ? 'translate-x-9' : ''
        }`}
        title={isOpen ? "Collapse Sidebar" : "Explore Pandals"}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Main Minimal Sidebar Container */}
      <div className="pointer-events-auto w-full h-full bg-[#FBF9F6] border border-slate-200/90 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Search Header Bar */}
        <div className="p-4 bg-white border-b border-slate-100 space-y-3 shrink-0">
          
          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pandals in Bengaluru"
              className="w-full pl-10 pr-8 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm rounded-full border border-slate-200 focus:border-amber-600 focus:outline-none shadow-sm transition font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Minimal Horizontal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterToggle(filter.id)}
                  className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#7A1C1C] text-white font-semibold shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Counter Sub-header */}
        <div className="px-4 py-2 bg-[#FBF9F6] border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{pandals.length} pandals found</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
            🟢 Live Updates
          </span>
        </div>

        {/* Scrollable Pandals Minimal Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#FBF9F6]">
          {pandals.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No pandals found</p>
              <p className="text-[11px] text-slate-400">Try adjusting your search terms</p>
            </div>
          ) : (
            pandals.map((pandal) => {
              const isSelected = selectedPandal?.id === pandal.id;
              return (
                <div
                  key={pandal.id}
                  onClick={() => onSelectPandal(pandal)}
                  className={`p-3 rounded-2xl transition duration-150 cursor-pointer flex items-center gap-3.5 border ${
                    isSelected
                      ? 'bg-white border-[#7A1C1C] ring-1 ring-[#7A1C1C]/30 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <img
                    src={pandal.coverImage}
                    alt={pandal.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-100 shrink-0 shadow-sm"
                  />

                  {/* Info Details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                        {pandal.name}
                      </h4>
                      {pandal.status === 'verified' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#7A1C1C] text-white flex items-center justify-center shrink-0 text-[8px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-normal truncate">
                      {pandal.locality} · {pandal.edition || 'Pandal'}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5 text-xs">
                      <span className="text-emerald-600 font-semibold text-[11px]">
                        Open now
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </aside>
  );
}
