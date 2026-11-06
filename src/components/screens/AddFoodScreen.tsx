import React, { useState } from 'react';
import {
  X,
  Plus,
  Calendar,
  AlertCircle,
  Thermometer,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { FoodCategory, FoodItem, StorageLocation } from '../../types/foodSafe';
import { PRESET_FOOD_ITEMS } from '../../data/defaultData';

interface AddFoodScreenProps {
  onClose: () => void;
  onAddItem: (item: Omit<FoodItem, 'id'>) => void;
}

export const AddFoodScreen: React.FC<AddFoodScreenProps> = ({ onClose, onAddItem }) => {
  const today = new Date().toISOString().split('T')[0];

  // Helper for adding days
  const addDays = (baseDateStr: string, days: number): string => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('dairy');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('fridge');
  const [purchaseDate, setPurchaseDate] = useState<string>(today);
  const [expiryDate, setExpiryDate] = useState<string>(addDays(today, 5));
  const [quantity, setQuantity] = useState('1 unit');
  const [notes, setNotes] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [handlingTip, setHandlingTip] = useState('Store at consistent temperature below 4°C.');

  // Form errors
  const [errors, setErrors] = useState<{ name?: string; dates?: string }>({});

  // Preset quick fill
  const handleSelectPreset = (preset: typeof PRESET_FOOD_ITEMS[0]) => {
    setName(preset.name);
    setCategory(preset.category as FoodCategory);
    setStorageLocation(preset.defaultLocation as StorageLocation);
    setExpiryDate(addDays(purchaseDate, preset.shelfLifeDays));
    setRiskLevel(preset.risk as any);
    setHandlingTip(`Ideal temperature: ${preset.idealTemp}. Check freshness before use.`);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; dates?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Food item name is required.';
    }

    if (new Date(expiryDate) < new Date(purchaseDate)) {
      newErrors.dates = 'Expiry date cannot be earlier than purchase date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Determine ideal temps
    let minT = 1;
    let maxT = 4;
    if (storageLocation === 'freezer') {
      minT = -24;
      maxT = -18;
    } else if (storageLocation === 'pantry') {
      minT = 15;
      maxT = 22;
    }

    onAddItem({
      name: name.trim(),
      category,
      storageLocation,
      purchaseDate,
      expiryDate,
      quantity: quantity.trim() || '1 pack',
      notes: notes.trim(),
      idealTempMinC: minT,
      idealTempMaxC: maxT,
      riskLevel,
      handlingTip: handlingTip || 'Keep chilled and consume before expiry.',
      isConsumed: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Food Item</h2>
            <p className="text-xs text-slate-500">Record storage location & expiry parameters</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Quick Preset Selection (Auto-sets shelf life)
              </label>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {PRESET_FOOD_ITEMS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium whitespace-nowrap transition-colors border border-emerald-200"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Food Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Food Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Fresh Milk, Raw Chicken Breast, Leftover Pasta"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Category & Storage Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs capitalize focus:outline-hidden focus:border-emerald-600"
              >
                <option value="dairy">Dairy</option>
                <option value="poultry">Poultry</option>
                <option value="meat">Red Meat</option>
                <option value="seafood">Seafood</option>
                <option value="produce">Fresh Produce</option>
                <option value="leftovers">Cooked Leftovers</option>
                <option value="bakery">Bakery</option>
                <option value="pantry">Pantry Dry Goods</option>
                <option value="canned">Canned Food</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storage Location</label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value as StorageLocation)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs capitalize focus:outline-hidden focus:border-emerald-600"
              >
                <option value="fridge">Refrigerator (&lt; 4°C)</option>
                <option value="freezer">Freezer (&lt; -18°C)</option>
                <option value="pantry">Pantry / Ambient</option>
              </select>
            </div>
          </div>

          {/* Dates: Purchase & Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  if (errors.dates) setErrors((prev) => ({ ...prev, dates: undefined }));
                }}
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-hidden ${
                  errors.dates ? 'border-red-400' : 'border-slate-300 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>
          {errors.dates && (
            <p className="text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.dates}
            </p>
          )}

          {/* Quantity & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity / Pack</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500g, 1L, 2 steaks"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contamination Risk</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs capitalize focus:outline-hidden focus:border-emerald-600"
              >
                <option value="low">Low Risk (Bread, Dry)</option>
                <option value="medium">Medium Risk (Dairy, Cooked)</option>
                <option value="high">High Risk (Raw Meat/Seafood)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Storage Notes & Guidance</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Keep on bottom shelf; opened today; seal tightly in airtight container."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Recommendation Info Banner */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Food items stored in the refrigerator should stay strictly under <strong>4°C (40°F)</strong>. Store raw meats inside sealed containers at the lowest shelf to prevent drip contamination.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Save to Tracker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
