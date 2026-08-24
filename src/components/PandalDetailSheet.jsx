import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Navigation,
  Share2,
  Bookmark,
  Leaf,
  Sparkles,
  Utensils,
  ShieldCheck,
  Users,
  ChevronRight,
  ImageOff
} from 'lucide-react';

export default function PandalDetailSheet({
  pandal,
  onClose,
  onUpdateCrowd,
  isSaved,
  onToggleSave,
  onOpenClaimModal,
  onShowDirections
}) {
  if (!pandal) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const currentImg = pandal.images?.[activeImageIndex] || pandal.coverImage;

  const crowdColors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
    Heavy: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="fixed inset-y-0 right-0 z-30 w-full sm:w-[460px] bg-white text-slate-900 shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out font-sans">
      
      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={currentImg} alt={pandal.name} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}

      {/* Top Image Banner */}
      <div className="relative h-72 w-full bg-slate-100 shrink-0 cursor-pointer" onClick={() => currentImg ? setIsLightboxOpen(true) : null}>
        {currentImg ? (
          <img
            src={currentImg}
            alt={pandal.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
          />
        ) : null}
        {!currentImg && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-300/60 flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-slate-400" />
            </div>
            <span className="text-sm font-semibold text-slate-400 tracking-wide">No Photo Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/20" />

        {/* Top Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center transition border border-gray-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center transition border border-gray-200 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(pandal.id); }}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition border border-gray-200 shadow-sm ${
                isSaved ? 'bg-[#8B1A1A] text-white font-bold' : 'bg-white/90 hover:bg-white text-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Copy Toast */}
        {copiedToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl z-20 backdrop-blur-md">
            Link copied to clipboard!
          </div>
        )}

        {/* Cover Image Text */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {pandal.status === 'verified' && (
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
            {pandal.isEcoFriendly && (
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Leaf className="w-3 h-3" /> Eco Clay
              </span>
            )}
            {pandal.isFeatured && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> {pandal.locality}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-extrabold text-white leading-tight drop-shadow-md">
            {pandal.name}
          </h2>
          <p className="text-xs text-slate-200 font-medium tracking-wide mt-1">
            {pandal.edition && <span className="text-amber-300 font-bold">{pandal.edition} • </span>}
            {pandal.theme}
          </p>
        </div>

        {/* Thumbnails */}
        {pandal.images && pandal.images.length > 1 && (
          <div className="absolute bottom-2 right-4 flex gap-1.5 z-10">
            {pandal.images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition ${
                  activeImageIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/80">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-[#8B1A1A] text-[#8B1A1A] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview & Visitor Info
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition ${
            activeTab === 'events'
              ? 'border-[#8B1A1A] text-[#8B1A1A] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Aarti & Events ({pandal.events?.length || 0})
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
        {activeTab === 'overview' && (
          <>
            {/* Quick Action Navigation Bar */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  if (onShowDirections) {
                    onShowDirections(pandal);
                    onClose();
                  } else {
                    window.open(googleMapsUrl, '_blank');
                  }
                }}
                className="bg-[#8B1A1A] hover:bg-[#6f1515] text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md shadow-[#8B1A1A]/20 transition cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-white" />
                Show Directions
              </button>

              <div className="bg-slate-50 p-2.5 rounded-2xl flex items-center justify-between border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Users className="w-4 h-4 text-[#8B1A1A]" />
                  Crowd:
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    crowdColors[pandal.crowdLevel] || 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {pandal.crowdLevel || 'Normal'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8B1A1A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Physical Address</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">{pandal.address}</p>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#8B1A1A]" />
                  Darshan Hours
                </div>
                <p className="text-xs font-extrabold text-slate-800">{pandal.darshanTimings || '06:00 AM - 10:00 PM'}</p>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Aarti Schedule
                </div>
                <p className="text-xs font-extrabold text-slate-800">{pandal.aartiTimings || '07:30 AM & 08:00 PM'}</p>
              </div>
            </div>

            {/* Annadanam Prasad */}
            {pandal.annadanam?.available && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-sm">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Maha Prasad & Annadanam Seva</h4>
                    <p className="text-[11px] font-bold text-amber-800">{pandal.annadanam.timings}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-8 font-medium">
                  {pandal.annadanam.description}
                </p>
              </div>
            )}

            {/* About */}
            {pandal.description && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  About this Festival Pandal
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 font-medium">
                  {pandal.description}
                </p>
              </div>
            )}

            {/* Live Crowd Report */}
            <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl space-y-2 border border-slate-200/80">
              <h4 className="text-xs font-black text-slate-900">Update Live Crowd Status</h4>
              <p className="text-[11px] text-slate-500">Are you visiting this pandal right now? Update crowd status for other devotees:</p>
              <div className="flex gap-2 pt-1">
                {['Low', 'Moderate', 'Heavy'].map((level) => (
                  <button
                    key={level}
                    onClick={() => onUpdateCrowd(pandal.id, level)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      pandal.crowdLevel === level
                        ? 'bg-[#8B1A1A] text-white border-[#8B1A1A] shadow-md font-extrabold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Organizer Claim */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-500">
                Organized by: <span className="font-bold text-slate-800">{pandal.organizer?.name || 'Community Pandal'}</span>
              </div>
              <button
                onClick={() => onOpenClaimModal(pandal)}
                className="text-[#8B1A1A] font-bold hover:underline flex items-center gap-1"
              >
                Claim Listing <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Scheduled Cultural Events & Puja
            </h4>
            {pandal.events && pandal.events.length > 0 ? (
              <div className="space-y-2.5">
                {pandal.events.map((ev, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <span className="bg-[#8B1A1A] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 shadow-sm">
                      {ev.time}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{ev.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Daily recurring festival program</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
                No specific cultural event schedule published yet for this location.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
