import React from 'react';
import { X, Calendar, Sparkles, Utensils, MapPin, ChevronRight } from 'lucide-react';

export default function EventsModal({ isOpen, onClose, pandals, onSelectPandal }) {
  if (!isOpen) return null;

  const allEvents = pandals.flatMap(pandal =>
    (pandal.events || []).map(ev => ({
      ...ev,
      pandalName: pandal.name,
      locality: pandal.locality,
      pandal: pandal
    }))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-amber-200/80">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-lg leading-none text-white">Bengaluru Festival Events</h3>
              <p className="text-amber-400 text-xs mt-1 font-bold">Concerts, Homam, Aarti & Cultural Schedules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event List */}
        <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {allEvents.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8 font-medium">No scheduled events found.</p>
          ) : (
            allEvents.map((ev, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectPandal(ev.pandal);
                  onClose();
                }}
                className="p-4 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 rounded-2xl border border-amber-200/80 hover:border-amber-400 transition cursor-pointer flex items-center justify-between gap-3 group shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-amber-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shrink-0 shadow-sm">
                    {ev.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-900 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {ev.pandalName} ({ev.locality})
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
