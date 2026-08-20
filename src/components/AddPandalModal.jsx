import React, { useState } from 'react';
import { X, MapPin, Leaf, Sparkles, Utensils, Image, CheckCircle, Info } from 'lucide-react';
import { LOCALITIES, BENGALURU_CENTER } from '../data/pandalsData';

export default function AddPandalModal({ isOpen, onClose, onSubmitPandal }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    locality: 'Basavanagudi',
    address: '',
    latitude: 12.9716,
    longitude: 77.5946,
    theme: '',
    description: '',
    coverImage: '',
    isEcoFriendly: true,
    darshanTimings: '07:00 AM - 10:00 PM',
    aartiTimings: '08:00 AM & 08:00 PM',
    hasAnnadanam: false,
    annadanamTimings: '12:30 PM - 03:00 PM',
    organizerName: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    const newPandal = {
      id: `pandal-user-${Date.now()}`,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-0]/g, '-'),
      locality: formData.locality,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      establishmentYear: new Date().getFullYear(),
      edition: '1st Year',
      theme: formData.theme || 'Community Ganesha Festival',
      idolType: formData.isEcoFriendly ? 'Eco Clay Idol' : 'Traditional Idol',
      isEcoFriendly: formData.isEcoFriendly,
      isFeatured: false,
      isTrending: false,
      status: 'pending',
      darshanTimings: formData.darshanTimings,
      aartiTimings: formData.aartiTimings,
      annadanam: {
        available: formData.hasAnnadanam,
        timings: formData.annadanamTimings,
        description: formData.hasAnnadanam ? 'Community Prasad Distribution.' : ''
      },
      facilities: {
        parking: true,
        toilets: true,
        drinkingWater: true,
        accessibility: true,
        firstAid: false
      },
      crowdLevel: 'Low',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80',
      images: [
        formData.coverImage || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80'
      ],
      description: formData.description || 'Community submitted Ganesh Pandal.',
      events: [{ time: formData.aartiTimings.split('&')[0] || '08:00 AM', title: 'Daily Aarti' }],
      organizer: {
        claimed: false,
        name: formData.organizerName || 'Community Member',
        contact: ''
      },
      likesCount: 1,
      checkinsCount: 1
    };

    onSubmitPandal(newPandal);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-auto border border-amber-200/80">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🪔</span>
            <div>
              <h3 className="font-serif font-bold text-lg leading-none">Add a Ganesh Pandal</h3>
              <p className="text-amber-100 text-xs mt-1 font-medium">Pin an undiscovered pandal location on GanapathiMap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submittedSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-serif font-extrabold text-slate-900">Pandal Submitted Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto font-medium">
              Your submission has been logged as <span className="font-bold text-amber-700">Pending Verification</span> and is now active on the map!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 font-medium">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Submissions appear on the map immediately as gray pending pins until reviewed by moderators.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pandal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vijayanagar 4th Main Eco Ganesha"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Locality / Area *
                </label>
                <select
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {LOCALITIES.filter(l => l !== 'All').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organizer / Contributor Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name / Welfare Trust"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Street Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Near Bus Stand, Main Road, Vijayanagar..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white font-medium rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white font-medium rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mandap Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Lotus Clay Temple"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 flex-1">
                <input
                  type="checkbox"
                  checked={formData.isEcoFriendly}
                  onChange={(e) => setFormData({ ...formData, isEcoFriendly: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Eco Clay Idol
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">100% organic clay</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer bg-orange-50/80 p-3 rounded-2xl border border-orange-200 flex-1">
                <input
                  type="checkbox"
                  checked={formData.hasAnnadanam}
                  onChange={(e) => setFormData({ ...formData, hasAnnadanam: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-orange-900 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-orange-600" /> Annadanam Prasad
                  </span>
                  <span className="text-[10px] text-orange-700 font-medium">Free meal seva</span>
                </div>
              </label>
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition"
              >
                Submit Pandal Pin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
