import React, { useState } from 'react';
import {
  Search,
  Plus,
  Package,
  Layers,
  Thermometer,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { FoodItem } from '../../types/foodSafe';
import { getDaysRemaining, getExpiryStatus } from '../../services/storage';

interface ExpiryTrackerScreenProps {
  foodItems: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
  onOpenAddModal: () => void;
}

export const ExpiryTrackerScreen: React.FC<ExpiryTrackerScreenProps> = ({
  foodItems,
  onSelectItem,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'expiring' | 'expired' | 'fresh'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'fridge' | 'freezer' | 'pantry'>('all');
  const [sortBy, setSortBy] = useState<'expiry' | 'name' | 'purchase'>('expiry');

  // Filter items
  const filteredItems = foodItems
    .filter((item) => !item.isConsumed)
    .filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesLocation = item.storageLocation.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesLocation) return false;
      }

      // Status filter
      const days = getDaysRemaining(item.expiryDate);
      if (statusFilter === 'expired' && days >= 0) return false;
      if (statusFilter === 'expiring' && (days < 0 || days > 2)) return false;
      if (statusFilter === 'fresh' && days <= 2) return false;

      // Location filter
      if (locationFilter !== 'all' && item.storageLocation !== locationFilter) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'expiry') {
        return a.expiryDate.localeCompare(b.expiryDate);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.purchaseDate.localeCompare(a.purchaseDate);
    });

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'dairy':
        return '🥛';
      case 'meat':
      case 'poultry':
        return '🍗';
      case 'seafood':
        return '🐟';
      case 'produce':
        return '🥬';
      case 'leftovers':
        return '🍲';
      case 'bakery':
        return '🍞';
      case 'canned':
        return '🥫';
      default:
        return '📦';
    }
  };

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Food Inventory Tracker</h1>
          <p className="text-xs text-slate-500">Monitor freshness, storage temps, and expiration dates</p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Food</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search food by name, category, or notes..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Items ({foodItems.filter((i) => !i.isConsumed).length})
        </button>
        <button
          onClick={() => setStatusFilter('expiring')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'expiring'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Expiring Soon
        </button>
        <button
          onClick={() => setStatusFilter('expired')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'expired'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Expired
        </button>
        <button
          onClick={() => setStatusFilter('fresh')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'fresh'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Fresh & Safe
        </button>
      </div>

      {/* Storage Filter & Sort Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location:</span>
          {(['all', 'fridge', 'freezer', 'pantry'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                locationFilter === loc
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-transparent border-none text-[11px] text-slate-600 font-semibold focus:outline-hidden cursor-pointer"
        >
          <option value="expiry">Sort: Expiry Date</option>
          <option value="name">Sort: Name (A-Z)</option>
          <option value="purchase">Sort: Recent Purchase</option>
        </select>
      </div>

      {/* Food Items List */}
      <div className="space-y-2 pt-1">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No Food Items Match</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No items match your active search or filter. Try clearing filters or register a new food item.
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add First Food Item
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const { status, label, badgeClass } = getExpiryStatus(item.expiryDate);
            const days = getDaysRemaining(item.expiryDate);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200">
                      {getCategoryEmoji(item.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                        {item.riskLevel === 'high' && (
                          <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 rounded">
                            High Risk
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize font-medium text-slate-700">{item.storageLocation}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.quantity}</span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 truncate italic">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expiry Badge */}
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${badgeClass}`}>
                      {label}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Exp: {item.expiryDate}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
