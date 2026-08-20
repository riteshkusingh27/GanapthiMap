import React from 'react';
import { Navigation, Calendar, ShieldAlert, ShieldCheck, Menu } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function HeaderSearch({
  onLocateMe,
  onOpenAdminDrawer,
  onOpenEventsModal,
  onNavigateToAdmin,
  verifiedCount
}) {
  return (
    <header className="pointer-events-auto bg-white border border-gray-200 rounded-2xl shadow-lg px-3 py-2.5 flex items-center justify-between gap-4 font-sans">
      
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center p-0.5 shrink-0">
          <img src={logoImg} alt="GanapathiMap Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-900 text-sm tracking-tight leading-none whitespace-nowrap">
            Ganapathi<span className="text-[#8B1A1A]">Map</span>
          </span>
          <span className="hidden sm:inline-block bg-gray-100 text-gray-500 text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
            BLR
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onLocateMe}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] hover:bg-[#6f1515] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Navigation className="w-3 h-3" />
          <span className="hidden sm:inline">Near Me</span>
          <span className="sm:hidden">📍</span>
        </button>

        <button
          onClick={onOpenEventsModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 text-xs font-medium rounded-lg transition-colors"
        >
          <Calendar className="w-3 h-3" />
          Events
        </button>

        <button
          onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 text-xs font-medium rounded-lg transition-colors"
        >
          <ShieldAlert className="w-3 h-3 text-amber-600" />
          Admin
        </button>

        <button
          onClick={onOpenAdminDrawer}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          title="Moderation Panel"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
