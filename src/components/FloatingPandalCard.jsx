import React from 'react';
import { X, Navigation, Star, ChevronRight, Clock, MapPin, Leaf, Sparkles, Flame } from 'lucide-react';

export default function FloatingPandalCard({ pandal, onClose, onOpenFullSheet }) {
  if (!pandal) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const getCategoryBadge = () => {
    if (pandal.isFeatured) return { label: 'Featured', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Sparkles className="w-2.5 h-2.5" /> };
    if (pandal.isEcoFriendly) return { label: 'Eco Clay', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Leaf className="w-2.5 h-2.5" /> };
    if (pandal.isTrending) return { label: 'Trending', cls: 'bg-red-50 text-red-600 border-red-200', icon: <Flame className="w-2.5 h-2.5" /> };
    return null;
  };

  const badge = getCategoryBadge();

  return (
    <div className="fixed bottom-16 right-4 z-30 pointer-events-auto font-sans sm:bottom-10 sm:right-5">
      <div className="w-72 sm:w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">

        {/* Cover Image */}
        <div className="relative h-36">
          <img src={pandal.coverImage} alt={pandal.name} className="w-full h-full object-cover" />
          
          {/* Top Controls overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {badge && (
            <span className={`absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls} bg-white/90 backdrop-blur-sm`}>
              {badge.icon} {badge.label}
            </span>
          )}
        </div>

        {/* Info Body */}
        <div className="p-3.5 space-y-3">
          
          {/* Name & Rating */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{pandal.name}</h3>
              {pandal.status === 'verified' && (
                <span className="shrink-0 text-[8px] text-white bg-[#8B1A1A] w-4 h-4 rounded-full flex items-center justify-center font-bold mt-0.5">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5 text-gray-500"><MapPin className="w-3 h-3" /> {pandal.locality}</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><Star className="w-3 h-3 fill-amber-400" /> 4.8</span>
              <span className="text-gray-300">·</span>
              <span className="text-emerald-600 font-semibold">Open</span>
            </div>
          </div>

          {/* Timings Row */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <Clock className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="font-medium text-gray-700">{pandal.darshanTimings || '06:00 AM – 10:00 PM'}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#8B1A1A] hover:bg-[#6f1515] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Navigation className="w-3 h-3" />
              Directions
            </a>
            <button
              onClick={onOpenFullSheet}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl transition-colors"
            >
              Full Details
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
