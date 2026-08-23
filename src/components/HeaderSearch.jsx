import { Navigation, Calendar, Plus, ShieldCheck } from 'lucide-react';

const logoImg = 'https://res.cloudinary.com/dtigmagdl/image/upload/v1787463675/927b6a8c-c53d-4267-9960-1ca4c824e8cd_u1drzf.png';

export default function HeaderSearch({
  onLocateMe,
  onOpenAdminDrawer,
  onOpenEventsModal,
  onOpenPrivacyModal,
  onNavigateToAdmin,
  verifiedCount
}) {
  return (
    <header className="pointer-events-auto bg-white border border-gray-200 rounded-2xl shadow-lg px-3 py-2.5 flex items-center justify-between gap-4 font-sans">
      
      {/* Brand Logo */}
      <div className="flex items-center shrink-0">
        <img
          src={logoImg}
          alt="GanapathiMap"
          className="h-11 sm:h-14 w-auto object-contain drop-shadow-sm max-w-[180px] sm:max-w-[240px]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onLocateMe}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1A1A] hover:bg-[#6f1515] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Navigation className="w-3 h-3" />
          <span>Near Me</span>
        </button>

        <button
          onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" />
          <span>Add Pandal</span>
        </button>

        <button
          onClick={onOpenEventsModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 text-xs font-medium rounded-lg transition-colors"
        >
          <Calendar className="w-3 h-3" />
          Events
        </button>

        {onOpenPrivacyModal && (
          <button
            onClick={onOpenPrivacyModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 text-xs font-medium rounded-lg transition-colors"
            title="Privacy & Community Guidelines"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B1A1A]" />
            Privacy & Policy
          </button>
        )}
      </div>
    </header>
  );
}
