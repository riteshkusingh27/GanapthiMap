import React from 'react';
import { X, Navigation, Star, ChevronRight } from 'lucide-react';

export default function FloatingPandalCard({
  pandal,
  onClose,
  onOpenFullSheet
}) {
  if (!pandal) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-30 pointer-events-auto font-sans">
      <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-2xl p-3.5 relative overflow-hidden space-y-3">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover Image Header */}
        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
          <img
            src={pandal.coverImage}
            alt={pandal.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Content */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate">
              {pandal.name}
            </h3>
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 bg-[#7A1C1C] hover:bg-[#601616] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            Directions
          </a>
          <button
            onClick={onOpenFullSheet}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center gap-1 transition"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
