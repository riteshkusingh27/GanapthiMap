import React from 'react';
import { Search, Navigation, Calendar, ShieldAlert, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function HeaderSearch({
  onLocateMe,
  onOpenAdminDrawer,
  onOpenEventsModal,
  onNavigateToAdmin,
  verifiedCount
}) {
  return (
    <header className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-md p-2 flex items-center justify-between gap-3 font-sans">
      
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
          <img src={logoImg} alt="GanapathiMap Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="font-serif font-bold text-slate-900 tracking-tight text-base sm:text-lg leading-none">
          Ganapathi<span className="text-[#7A1C1C] font-sans font-black">Map</span>
        </h1>
        <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200">
          Bengaluru
        </span>
      </div>

      {/* Right Minimal Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onLocateMe}
          className="px-3.5 py-1.5 rounded-xl bg-[#7A1C1C] hover:bg-[#601616] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 fill-white" />
          Near Me
        </button>

        <button
          onClick={onOpenEventsModal}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          Events
        </button>

        <button
          onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          /admin
        </button>

        <button
          onClick={onOpenAdminDrawer}
          title="Admin Moderation Console"
          className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition"
        >
          <ShieldCheck className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
