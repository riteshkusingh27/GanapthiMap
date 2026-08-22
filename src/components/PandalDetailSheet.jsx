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
  Flame,
  Users,
  Car,
  Bath,
  Droplets,
  Accessibility,
  HeartPulse,
  Calendar,
  MessageSquare,
  Building,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert
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
    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Heavy: 'bg-red-500/20 text-red-400 border-red-500/40'
  };

  return (
    <div className="fixed inset-y-0 right-0 z-30 w-full sm:w-[460px] bg-slate-950 text-white shadow-2xl flex flex-col border-l border-amber-500/30 transition-transform duration-300 ease-in-out font-sans">
      
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
      <div className="relative h-72 w-full bg-slate-950 shrink-0 cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        <img
          src={currentImg}
          alt={pandal.name}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30" />

        {/* Top Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition border border-white/20"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => onToggleSave(pandal.id)}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition border border-white/20 ${
                isSaved ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950/70 hover:bg-slate-900 text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Copy Toast */}
        {copiedToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 border border-amber-500/40 text-xs font-bold px-4 py-2 rounded-full shadow-2xl z-20 backdrop-blur-md">
            Link copied to clipboard!
          </div>
        )}

        {/* Cover Image Text */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {pandal.status === 'verified' && (
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-400/40">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
            {pandal.isEcoFriendly && (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/40">
                <Leaf className="w-3 h-3" /> Eco Clay
              </span>
            )}
            {pandal.isFeatured && (
              <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300/40">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> {pandal.locality}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-extrabold text-white leading-tight drop-shadow-md">
            {pandal.name}
          </h2>
          <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
            {pandal.edition && <span className="text-amber-400 font-bold">{pandal.edition} • </span>}
            {pandal.theme}
          </p>
        </div>

        {/* Thumbnails */}
        {pandal.images && pandal.images.length > 1 && (
          <div className="absolute bottom-2 right-4 flex gap-1.5 z-10">
            {pandal.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
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
      <div className="flex border-b border-slate-800 bg-slate-900/90">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-400 bg-slate-950'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview & Visitor Info
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition ${
            activeTab === 'events'
              ? 'border-amber-500 text-amber-400 bg-slate-950'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Aarti & Events ({pandal.events?.length || 0})
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
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
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                Show Directions
              </button>

              <div className="bg-slate-900/90 p-2.5 rounded-2xl flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Users className="w-4 h-4 text-amber-400" />
                  Crowd:
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    crowdColors[pandal.crowdLevel] || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {pandal.crowdLevel || 'Normal'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Physical Address</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-medium">{pandal.address}</p>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Darshan Hours
                </div>
                <p className="text-xs font-extrabold text-white">{pandal.darshanTimings || '06:00 AM - 10:00 PM'}</p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-orange-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Aarti Schedule
                </div>
                <p className="text-xs font-extrabold text-white">{pandal.aartiTimings || '07:30 AM & 08:00 PM'}</p>
              </div>
            </div>

            {/* Annadanam Prasad */}
            {pandal.annadanam?.available && (
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-orange-600 text-white shadow-sm">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Maha Prasad & Annadanam Seva</h4>
                    <p className="text-[11px] font-bold text-amber-400">{pandal.annadanam.timings}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed pl-8 font-medium">
                  {pandal.annadanam.description}
                </p>
              </div>
            )}

            {/* About */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
                About this Festival Pandal
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 font-medium">
                {pandal.description}
              </p>
            </div>

            {/* Visitor Facilities */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
                Visitor Facilities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <FacilityItem icon={<Car className="w-3.5 h-3.5" />} label="Parking" available={pandal.facilities?.parking} />
                <FacilityItem icon={<Bath className="w-3.5 h-3.5" />} label="Toilets" available={pandal.facilities?.toilets} />
                <FacilityItem icon={<Droplets className="w-3.5 h-3.5" />} label="Water" available={pandal.facilities?.drinkingWater} />
                <FacilityItem icon={<Accessibility className="w-3.5 h-3.5" />} label="Accessible" available={pandal.facilities?.accessibility} />
                <FacilityItem icon={<HeartPulse className="w-3.5 h-3.5" />} label="First Aid" available={pandal.facilities?.firstAid} />
              </div>
            </div>

            {/* Live Crowd Report */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
              <h4 className="text-xs font-extrabold text-amber-400">Update Live Crowd Status</h4>
              <p className="text-[11px] text-slate-300">Are you visiting this pandal right now? Update crowd status for other devotees:</p>
              <div className="flex gap-2 pt-1">
                {['Low', 'Moderate', 'Heavy'].map((level) => (
                  <button
                    key={level}
                    onClick={() => onUpdateCrowd(pandal.id, level)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      pandal.crowdLevel === level
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Organizer Claim */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Organized by: <span className="font-bold text-amber-400">{pandal.organizer?.name || 'Community Pandal'}</span>
              </div>
              <button
                onClick={() => onOpenClaimModal(pandal)}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                Claim Listing <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Scheduled Cultural Events & Puja
            </h4>
            {pandal.events && pandal.events.length > 0 ? (
              <div className="space-y-2.5">
                {pandal.events.map((ev, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 flex items-start gap-3">
                    <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 shadow-sm">
                      {ev.time}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{ev.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">Daily recurring festival program</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-6 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
                No specific cultural event schedule published yet for this location.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FacilityItem({ icon, label, available }) {
  return (
    <div
      className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition ${
        available
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-900 text-slate-500 border-slate-800 opacity-50 line-through'
      }`}
    >
      <span className={available ? 'text-emerald-400' : 'text-slate-500'}>{icon}</span>
      {label}
    </div>
  );
}
