import React from 'react';
import { X, ShieldCheck, Heart, Users, Eye, AlertTriangle, Mail } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A] flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Privacy & Community Guidelines</h3>
              <p className="text-[11px] text-slate-500 font-medium">How GanapathiMap operates as an open platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Heart className="w-4 h-4 text-[#8B1A1A]" />
              <span>1. 100% Open-Source & Devotee-Driven</span>
            </div>
            <p className="text-slate-600">
              GanapathiMap is built as a non-profit, open-source community platform so devotees and local residents can easily map and share Ganesha Pandals in their area with everyone.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Users className="w-4 h-4 text-[#8B1A1A]" />
              <span>2. Dedicated Pandal Focus Only</span>
            </div>
            <p className="text-slate-600">
              Only authentic Ganesha festival pandals, mandapas, and Utsava locations are encouraged and permitted. Non-festival commercial advertising or irrelevant spam listings are strictly prohibited.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>3. Backend Verification & Moderation</span>
            </div>
            <p className="text-slate-600">
              All community-submitted pandal listings are reviewed at the backend. Any false information, irregularities, duplicate entries, or inappropriate content are removed immediately by platform administrators.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>4. Public Data Acknowledgment & Privacy</span>
            </div>
            <p className="text-slate-600">
              We do <strong>NOT</strong> collect, store, or display personal identification data (PII). Only public festival details (Pandal Name, Locality/Region, Address, Timings, and Photos) are published.
            </p>
            <p className="text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
              By adding or listing any pandal, contributors solely acknowledge and agree that the pandal details and location are intentionally made public and visible to any user accessing the platform.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Questions or removal requests? Contact us at <a href="mailto:contactatonesolutions@gmail.com" className="text-[#8B1A1A] font-bold hover:underline">contactatonesolutions@gmail.com</a></span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-[#8B1A1A] hover:bg-[#6f1515] text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-sm"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
