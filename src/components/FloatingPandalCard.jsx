import React from 'react';
import { X, Navigation, Star, ChevronRight, Clock, MapPin, Leaf, Sparkles, Flame, XCircle, PersonStanding, Car, ImageOff } from 'lucide-react';

// Live Aarti countdown helper
function getNextAartiInfo(aartiTimingsStr) {
  if (!aartiTimingsStr) return null;
  const times = aartiTimingsStr.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi);
  if (!times || times.length === 0) return null;
  const now = new Date();
  let minDiff = Infinity;
  times.forEach(tStr => {
    const parts = tStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!parts) return;
    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const ampm = parts[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const tDate = new Date(now);
    tDate.setHours(hours, minutes, 0, 0);
    if (tDate < now) tDate.setDate(tDate.getDate() + 1);
    const diffMs = tDate - now;
    if (diffMs < minDiff) minDiff = diffMs;
  });
  if (minDiff === Infinity) return null;
  const totalMins = Math.round(minDiff / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const timeLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  return { timeLabel, isSoon: totalMins <= 60 };
}

export default function FloatingPandalCard({
  pandal,
  onClose,
  onOpenFullSheet,
  userLocation,
  nearestPandal,
  onShowDirections,
  onClearDirections,
}) {
  if (!pandal) return null;

  // Aarti Countdown
  const aartiInfo = getNextAartiInfo(pandal.aartiTimings);

  // Is a direction line currently drawn to THIS pandal?
  const isShowingDirections = nearestPandal?.pandal?.id === pandal.id;

  // Travel time helpers (same speeds as MapView)
  const fmtMin = (mins) => {
    if (mins < 1) return '< 1 min';
    if (mins < 60) return `${Math.round(mins)} min`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };
  const walkTime  = isShowingDirections ? fmtMin((nearestPandal.distKm / 4.5) * 60)  : null;
  const driveTime = isShowingDirections ? fmtMin((nearestPandal.distKm / 20)  * 60) : null;

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
          {pandal.coverImage ? (
            <img
              src={pandal.coverImage}
              alt={pandal.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 gap-2">
              <div className="w-12 h-12 rounded-xl bg-slate-300/60 flex items-center justify-center">
                <ImageOff className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400">No Photo</span>
            </div>
          )}
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

          {/* Distance + time badge — shown when directions are active */}
          {isShowingDirections && nearestPandal && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-[#8B1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              <Navigation className="w-2.5 h-2.5 shrink-0" />
              {nearestPandal.distKm < 1
                ? `${Math.round(nearestPandal.distKm * 1000)} m`
                : `${nearestPandal.distKm.toFixed(1)} km`}
              <span className="opacity-60">·</span>
              {driveTime} drive
            </div>
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

          {/* Timings & Aarti Row */}
          <div className="flex items-center justify-between text-xs bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{pandal.darshanTimings || '06:00 AM – 10:00 PM'}</span>
            </div>
            {aartiInfo && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                aartiInfo.isSoon
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Aarti in {aartiInfo.timeLabel}
              </span>
            )}
          </div>

          {/* Travel Time Row — only when directions active */}
          {isShowingDirections && walkTime && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center justify-center bg-[#8B1A1A]/5 border border-[#8B1A1A]/15 rounded-xl py-2">
                <div className="flex items-center gap-1 text-[#8B1A1A] mb-0.5">
                  <PersonStanding className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Walk</span>
                </div>
                <span className="text-sm font-black text-[#8B1A1A]">{walkTime}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-xl py-2">
                <div className="flex items-center gap-1 text-blue-600 mb-0.5">
                  <Car className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Drive</span>
                </div>
                <span className="text-sm font-black text-blue-600">{driveTime}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isShowingDirections ? (
              /* Clear directions button */
              <button
                onClick={onClearDirections}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <XCircle className="w-3 h-3" />
                Clear Route
              </button>
            ) : (
              /* Show directions on map */
              <button
                onClick={() => onShowDirections(pandal)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#8B1A1A] hover:bg-[#6f1515] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <Navigation className="w-3 h-3" />
                {userLocation ? 'Show Directions' : 'Locate & Direct'}
              </button>
            )}
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
