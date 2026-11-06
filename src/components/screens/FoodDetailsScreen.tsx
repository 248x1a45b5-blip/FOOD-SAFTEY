import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Info
} from 'lucide-react';
import { FoodItem } from '../../types/foodSafe';
import { getDaysRemaining, getExpiryStatus } from '../../services/storage';

interface FoodDetailsScreenProps {
  item: FoodItem;
  onBack: () => void;
  onConsume: (id: string) => void;
  onDiscard: (id: string) => void;
  onExtend: (id: string, days: number) => void;
}

export const FoodDetailsScreen: React.FC<FoodDetailsScreenProps> = ({
  item,
  onBack,
  onConsume,
  onDiscard,
  onExtend,
}) => {
  const days = getDaysRemaining(item.expiryDate);
  const { status, label, badgeClass } = getExpiryStatus(item.expiryDate);

  const getSafetyAdvice = () => {
    switch (item.category) {
      case 'poultry':
        return {
          title: 'Poultry Handling Protocols',
          bullets: [
            'Cook to minimum internal temperature of 74°C (165°F).',
            'Never wash raw chicken under the tap — water splatters Campylobacter & Salmonella.',
            'Store on bottom refrigerator shelf in a sealed container to stop raw juices dripping.',
          ],
        };
      case 'meat':
        return {
          title: 'Red Meat & Minced Beef Safety',
          bullets: [
            'Minced beef must reach 71°C (160°F) throughout; whole steaks require 63°C plus a 3-minute rest.',
            'Keep in refrigerator strictly below 4°C or freeze below -18°C.',
            'Do not allow raw juices to touch ready-to-eat salad items or bread.',
          ],
        };
      case 'seafood':
        return {
          title: 'Fresh Seafood Guidelines',
          bullets: [
            'Cook until flesh is opaque and flakes easily with a fork (min 63°C / 145°F).',
            'Store at 0°C–2°C on ice in refrigerator and consume within 2 days of purchase.',
            'Discard immediately if fish smells strongly sour, ammoniacal, or slimy.',
          ],
        };
      case 'dairy':
        return {
          title: 'Dairy & Milk Guidelines',
          bullets: [
            'Keep on the main central or bottom shelf; door pockets are too warm for fresh milk.',
            'Discard if sour aroma, curdling, or mold occurs.',
            'Always use a clean spoon when scooping yogurt or sour cream.',
          ],
        };
      case 'leftovers':
        return {
          title: 'Safe Leftovers Management',
          bullets: [
            'Follow the 2-Hour Rule: Refrigerate cooked food within 2 hours of cooking.',
            'Divide into shallow containers (< 5cm deep) so it cools down rapidly.',
            'Reheat to a rolling, steaming 74°C (165°F) throughout before serving.',
          ],
        };
      default:
        return {
          title: 'General Food Hygiene',
          bullets: [
            'Check for abnormal odor, texture changes, or mold growth before consuming.',
            'Ensure packaging is sealed against air, insects, and pantry pests.',
            'Store in a cool, dark, dry place below 22°C (72°F).',
          ],
        };
    }
  };

  const advice = getSafetyAdvice();

  return (
    <div className="p-4 space-y-4 pb-24 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Tracker</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">Food Item ID: {item.id.slice(0, 8)}</span>
      </div>

      {/* Main Status Header Card */}
      <div
        className={`rounded-2xl p-4 border text-center space-y-2 shadow-xs ${
          days < 0
            ? 'bg-red-50/80 border-red-200 text-red-950'
            : days <= 2
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {days < 0 ? (
            <ShieldAlert className="w-6 h-6 text-red-600" />
          ) : days <= 2 ? (
            <Clock className="w-6 h-6 text-amber-600" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          )}
          <h2 className="text-xl font-bold">{item.name}</h2>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${badgeClass}`}>
            {label}
          </span>
          <span className="text-xs opacity-75">· {item.quantity}</span>
        </div>

        <p className="text-xs max-w-sm mx-auto opacity-90 leading-relaxed">
          {days < 0
            ? 'This product has exceeded its recommended safe storage period. We strongly advise discarding it to prevent foodborne illness.'
            : days <= 2
            ? 'Expiring very soon! Prioritize this item for your next meal or freeze immediately to preserve safety.'
            : 'Product is currently fresh and within safe consumption parameters.'}
        </p>
      </div>

      {/* Metadata Specification Grid */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Storage Specifications
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Storage Zone</span>
            <span className="font-bold text-slate-800 capitalize flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {item.storageLocation}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Ideal Temperature</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              {item.idealTempMinC}°C to {item.idealTempMaxC}°C
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Purchase Date</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {item.purchaseDate}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Expiry Date</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {item.expiryDate}
            </span>
          </div>
        </div>

        {item.notes && (
          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/50 text-xs">
            <span className="text-amber-800 font-semibold block text-[11px]">User Notes:</span>
            <p className="text-slate-700 mt-0.5">{item.notes}</p>
          </div>
        )}
      </div>

      {/* Safety & Handling Advice Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
            <Info className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{advice.title}</h3>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-600">
          {advice.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => onConsume(item.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark as Safely Consumed</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onExtend(item.id, 3)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Extend (+3 Days)</span>
          </button>

          <button
            onClick={() => onDiscard(item.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Discard Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
