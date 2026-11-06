import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { HygieneItem } from '../../types/foodSafe';

interface HygieneChecklistScreenProps {
  hygieneItems: HygieneItem[];
  onToggleItem: (id: string) => void;
  onResetChecklist: () => void;
}

export const HygieneChecklistScreen: React.FC<HygieneChecklistScreenProps> = ({
  hygieneItems,
  onToggleItem,
  onResetChecklist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Audits' },
    { key: 'handwashing', label: 'Handwashing' },
    { key: 'kitchen', label: 'Kitchen & Surfaces' },
    { key: 'storage', label: 'Food Storage' },
    { key: 'cooking', label: 'Safe Cooking' },
  ];

  const filteredItems = hygieneItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const completedCount = hygieneItems.filter((i) => i.completed).length;
  const totalCount = hygieneItems.length;
  const score = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Food Hygiene Audit</h1>
          <p className="text-xs text-slate-500">Track and maintain daily food safety compliance</p>
        </div>
        <button
          onClick={onResetChecklist}
          title="Reset Daily Checklist"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Day</span>
        </button>
      </div>

      {/* Compliance Progress Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">Hygiene Compliance Score</span>
              <p className="text-[11px] text-slate-500">
                {completedCount} of {totalCount} safety checks verified today
              </p>
            </div>
          </div>
          <span className="text-xl font-black text-emerald-700 font-mono">{score}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-between">
          <span>Target: &ge; 85% for zero cross-contamination risk</span>
          <span className="font-semibold text-emerald-700">
            {score >= 85 ? 'Grade A Safe' : 'Audit Incomplete'}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 shadow-xs ${
              item.completed
                ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-900'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-emerald-600 focus:outline-hidden"
              aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Square className="w-5 h-5 text-slate-300" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-xs font-bold ${
                    item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.frequency.replace('_', ' ')}
                </span>
              </div>
              <p
                className={`text-[11px] mt-1 leading-relaxed ${
                  item.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
