import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Clock,
  Thermometer,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  Bell,
  Info
} from 'lucide-react';
import { FoodItem, HygieneItem, UserProfile } from '../../types/foodSafe';
import { getDaysRemaining } from '../../services/storage';

interface HomeScreenProps {
  foodItems: FoodItem[];
  hygieneItems: HygieneItem[];
  userProfile: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenAddModal: () => void;
  onSelectItem: (item: FoodItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  foodItems,
  hygieneItems,
  userProfile,
  onNavigate,
  onOpenAddModal,
  onSelectItem,
}) => {
  // Test temperature state for interactive danger zone tester
  const [testTemp, setTestTemp] = useState<number>(4);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);

  // Compute metrics
  const activeItems = foodItems.filter((i) => !i.isConsumed);
  const expiredItems = activeItems.filter((i) => getDaysRemaining(i.expiryDate) < 0);
  const expiringSoonItems = activeItems.filter(
    (i) => getDaysRemaining(i.expiryDate) >= 0 && getDaysRemaining(i.expiryDate) <= 2
  );
  const freshItems = activeItems.filter((i) => getDaysRemaining(i.expiryDate) > 2);

  const completedHygiene = hygieneItems.filter((h) => h.completed).length;
  const hygienePercentage = Math.round((completedHygiene / (hygieneItems.length || 1)) * 100);

  // Determine Danger Zone analysis for test temperature
  const getTempSafety = (temp: number) => {
    if (temp < -18) return { label: 'Deep Freeze Safe', color: 'text-sky-700 bg-sky-50 border-sky-200', desc: 'Pathogens dormant. Food safe indefinitely.' };
    if (temp <= 4) return { label: 'Refrigerated Safe', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Slows microbial growth. Safe for 1-7 days depending on food.' };
    if (temp < 60) return { label: 'DANGER ZONE (4°C–60°C)', color: 'text-red-700 bg-red-50 border-red-300 font-bold', desc: 'Bacteria double every 20 minutes! Max 2 hours at this temp.' };
    if (temp < 74) return { label: 'Hot Holding Safe', color: 'text-amber-800 bg-amber-50 border-amber-200', desc: 'Safe for serving hot foods; maintain > 60°C.' };
    return { label: 'Pathogen Destruction Temp (>74°C)', color: 'text-purple-700 bg-purple-50 border-purple-200', desc: 'Thermal death point for Salmonella, E. coli, & Campylobacter.' };
  };

  const currentTempSafety = getTempSafety(testTemp);

  const triggerReminderToast = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3500);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Toast simulated notification */}
      {showNotificationToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>{expiringSoonItems.length} items need attention before expiry!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            FOODSAFE SYSTEM
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, {userProfile.name.split(' ')[0]}
          </h1>
        </div>
        <button
          onClick={triggerReminderToast}
          aria-label="Daily Safety Reminders"
          className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Bell className="w-5 h-5" />
          {expiringSoonItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {expiringSoonItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Hero Hygiene Score Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-emerald-100 font-medium">Daily Food Safety Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{hygienePercentage}%</span>
              <span className="text-xs text-emerald-200">
                {hygienePercentage >= 80 ? 'Optimal Hygiene' : 'Action Recommended'}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 pt-1">
              {completedHygiene} of {hygieneItems.length} hygiene protocols fulfilled today.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('hygiene')}
            className="flex items-center gap-1 text-emerald-100 hover:text-white font-medium underline-offset-2 hover:underline"
          >
            Review Hygiene Checklist
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 bg-white text-emerald-800 font-semibold px-2.5 py-1 rounded-lg text-xs hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Food
          </button>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigate('tracker')}
          className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-emerald-300 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">Soon</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{expiringSoonItems.length}</div>
          <div className="text-[11px] text-slate-500 truncate">Expiring &le; 2d</div>
        </button>

        <button
          onClick={() => onNavigate('tracker')}
          className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-red-300 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-red-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold bg-red-50 text-red-700 px-1.5 py-0.5 rounded">Risk</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{expiredItems.length}</div>
          <div className="text-[11px] text-slate-500 truncate">Expired</div>
        </button>

        <button
          onClick={() => onNavigate('tracker')}
          className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-emerald-300 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Fresh</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{freshItems.length}</div>
          <div className="text-[11px] text-slate-500 truncate">Stored Safely</div>
        </button>
      </div>

      {/* Items Requiring Immediate Attention */}
      {expiringSoonItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Priority Expiry Alerts ({expiringSoonItems.length})</span>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-medium text-amber-800 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-1.5">
            {expiringSoonItems.slice(0, 2).map((item) => {
              const days = getDaysRemaining(item.expiryDate);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-white p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between cursor-pointer hover:bg-amber-50/40 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Location: <span className="capitalize">{item.storageLocation}</span> · {item.quantity}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {days === 0 ? 'Today!' : `${days}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Temperature Danger Zone Gauge */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Thermometer className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Temperature Danger Zone Tester</h2>
          </div>
          <button
            onClick={() => onNavigate('safety')}
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            Full Guide
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The Danger Zone is <strong>4°C to 60°C (40°F–140°F)</strong>. Drag the slider to test food temperatures:
        </p>

        {/* Temperature presets */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <button
            onClick={() => setTestTemp(-18)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-colors border ${
              testTemp === -18 ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            -18°C Freezer
          </button>
          <button
            onClick={() => setTestTemp(3)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-colors border ${
              testTemp === 3 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            3°C Fridge
          </button>
          <button
            onClick={() => setTestTemp(25)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-colors border ${
              testTemp === 25 ? 'bg-red-100 text-red-800 border-red-300' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            25°C Room
          </button>
          <button
            onClick={() => setTestTemp(74)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-colors border ${
              testTemp === 74 ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            74°C Cooked
          </button>
        </div>

        {/* Range slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>-20°C</span>
            <span className="font-bold text-slate-900 text-sm">{testTemp}°C / {Math.round((testTemp * 9) / 5 + 32)}°F</span>
            <span>100°C</span>
          </div>
          <input
            type="range"
            min="-20"
            max="100"
            value={testTemp}
            onChange={(e) => setTestTemp(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Analysis Card */}
        <div className={`p-3 rounded-xl border text-xs space-y-1 ${currentTempSafety.color}`}>
          <div className="font-bold flex items-center justify-between">
            <span>{currentTempSafety.label}</span>
          </div>
          <p className="leading-relaxed opacity-95">{currentTempSafety.desc}</p>
        </div>
      </div>

      {/* Daily Food Safety Tip Card */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-600 text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Today's Safety Protocol
          </span>
        </div>
        <h3 className="text-sm font-bold text-emerald-900">
          Raw Poultry: The 3-Foot Splash Hazard
        </h3>
        <p className="text-xs text-emerald-800/90 leading-relaxed">
          Washing raw chicken with water does not destroy bacteria. High pressure spreads Salmonella droplets up to 1 meter onto surrounding counters. Cooking to <strong>74°C (165°F)</strong> is the only method to destroy pathogens.
        </p>
        <button
          onClick={() => onNavigate('safety')}
          className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 pt-1"
        >
          Explore All Safety Guidelines
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
