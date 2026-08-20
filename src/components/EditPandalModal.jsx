import React, { useState, useEffect } from 'react';
import { X, Save, Image, MapPin, Sparkles, Leaf, ShieldCheck, Trash2 } from 'lucide-react';
import { LOCALITIES } from '../data/pandalsData';

export default function EditPandalModal({ isOpen, onClose, pandal, onSave, onDelete }) {
  if (!isOpen || !pandal) return null;

  const [formData, setFormData] = useState({ ...pandal });

  useEffect(() => {
    if (pandal) {
      setFormData({ ...pandal });
    }
  }, [pandal]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          coverImage: reader.result,
          images: [reader.result, ...(prev.images || [])]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Admin Edit Pandal</h3>
              <p className="text-xs text-slate-400 font-medium">Update photo, name, coordinates & details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Pandal Photo Preview & Replace */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Pandal Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-amber-400 overflow-hidden shrink-0 relative shadow-inner">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                    No Photo
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 font-medium">
                  Upload a new photo or capture from device camera
                </p>
              </div>
            </div>
          </div>

          {/* Name & Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Pandal Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Locality / Area
              </label>
              <select
                value={formData.locality || 'Basavanagudi'}
                onChange={(e) => handleChange('locality', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {LOCALITIES.filter(l => l !== 'All').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Street / Full Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
            <div>
              <label className="block text-[11px] font-extrabold text-amber-900 uppercase mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude || 0}
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-xl border border-amber-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-amber-900 uppercase mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude || 0}
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-xl border border-amber-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Description & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Theme / Mandap Style
              </label>
              <input
                type="text"
                value={formData.theme || ''}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Darshan Timings
              </label>
              <input
                type="text"
                value={formData.darshanTimings || ''}
                onChange={(e) => handleChange('darshanTimings', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Aarti Timings
              </label>
              <input
                type="text"
                value={formData.aartiTimings || ''}
                onChange={(e) => handleChange('aartiTimings', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Annadanam */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800">Annadanam / Prasad Seva</span>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.annadanam?.available || false}
                  onChange={(e) => handleNestedChange('annadanam', 'available', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                Available
              </label>
            </div>
            {formData.annadanam?.available && (
              <input
                type="text"
                placeholder="Annadanam timings & details..."
                value={formData.annadanam?.description || ''}
                onChange={(e) => handleNestedChange('annadanam', 'description', e.target.value)}
                className="w-full px-3 py-1.5 bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-300"
              />
            )}
          </div>

          {/* Badges & Status */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEcoFriendly || false}
                onChange={(e) => handleChange('isEcoFriendly', e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              🌿 Eco-Friendly Idol
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured || false}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              👑 Featured
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending || false}
                onChange={(e) => handleChange('isTrending', e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              🔥 Trending
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete "${pandal.name}"?`)) {
                    onDelete(pandal.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-red-200 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Pandal
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-600/30 flex items-center gap-1.5 transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
