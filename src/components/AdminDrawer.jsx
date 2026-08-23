import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, XCircle, Leaf, Sparkles, AlertCircle, Trash2, Eye } from 'lucide-react';

export default function AdminDrawer({ isOpen, onClose, pandals, onApprove, onReject, onSelectPandal, onClearAll }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('pending');

  const pendingPandals = pandals.filter(p => p.status === 'pending');
  const verifiedPandals = pandals.filter(p => p.status === 'verified');

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] bg-white shadow-2xl flex flex-col border-l border-slate-200/80 font-sans">
      
      {/* Admin Header */}
      <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-extrabold text-base leading-none text-white">Admin Moderation Console</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">Verify & Moderate Bengaluru Pandals</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Counter */}
      <div className="bg-slate-100/80 p-3.5 border-b border-slate-200 grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xl font-extrabold text-slate-900">{pandals.length}</div>
          <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Total Listed</div>
        </div>
        <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="text-xl font-extrabold text-amber-700">{pendingPandals.length}</div>
          <div className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider">Pending</div>
        </div>
        <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200/80 shadow-sm">
          <div className="text-xl font-extrabold text-emerald-700">{verifiedPandals.length}</div>
          <div className="text-[10px] text-emerald-900 font-extrabold uppercase tracking-wider">Verified</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'pending'
              ? 'border-amber-600 text-amber-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Pending Submissions ({pendingPandals.length})
        </button>

        <button
          onClick={() => setActiveTab('verified')}
          className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'verified'
              ? 'border-amber-600 text-amber-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified Pandals ({verifiedPandals.length})
        </button>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'pending' ? (
          pendingPandals.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-extrabold text-slate-800">All caught up!</p>
              <p className="text-xs text-slate-500 font-medium">All community submitted pandals have been reviewed.</p>
            </div>
          ) : (
            pendingPandals.map((pandal) => (
              <div key={pandal.id} className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pending Review
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{pandal.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{pandal.address}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectPandal(pandal);
                      onClose();
                    }}
                    className="p-2 text-slate-400 hover:text-amber-600 bg-slate-50 rounded-xl border border-slate-200 transition"
                    title="Focus on Map"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-medium">
                  <span>📍 {pandal.locality}</span>
                  {pandal.isEcoFriendly && <span className="text-emerald-700 font-bold">🌿 Eco Clay</span>}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onApprove(pandal.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve & Verify
                  </button>
                  <button
                    onClick={() => onReject(pandal.id)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl border border-red-200 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          verifiedPandals.map((pandal) => (
            <div key={pandal.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-xs">{pandal.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{pandal.locality} • {pandal.theme}</p>
              </div>

              <button
                onClick={() => {
                  onSelectPandal(pandal);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-extrabold bg-white border border-slate-300 rounded-xl hover:bg-slate-100 shadow-sm transition"
              >
                View Pin
              </button>
            </div>
          ))
        )}
      </div>

      {/* Admin Actions Footer */}
      {onClearAll && pandals.length > 0 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClearAll}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All {pandals.length} Pandals from Database
          </button>
        </div>
      )}
    </div>
  );
}
