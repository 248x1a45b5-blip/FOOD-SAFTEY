import React, { useState } from 'react';
import {
  Shield,
  Bug,
  Thermometer,
  Layers,
  Flame,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen
} from 'lucide-react';
import { PATHOGENS_DATA, SAFE_COOKING_TEMPS, FOOD_SAFETY_TIPS } from '../../data/defaultData';

export const SafetyInfoScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pathogens' | 'temperatures' | 'prevention' | 'tips'>('pathogens');
  const [expandedPathogen, setExpandedPathogen] = useState<string | null>('path-1');
  const [pathogenSearch, setPathogenSearch] = useState('');

  const filteredPathogens = PATHOGENS_DATA.filter(
    (p) =>
      p.name.toLowerCase().includes(pathogenSearch.toLowerCase()) ||
      p.commonFoods.some((f) => f.toLowerCase().includes(pathogenSearch.toLowerCase())) ||
      p.type.toLowerCase().includes(pathogenSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Food Safety Knowledge Hub</h1>
        <p className="text-xs text-slate-500">
          WHO & USDA grounded standards for food safety and poisoning prevention
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/80 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('pathogens')}
          className={`py-2 px-1 rounded-lg font-bold text-[11px] transition-all truncate ${
            activeTab === 'pathogens' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pathogens
        </button>
        <button
          onClick={() => setActiveTab('temperatures')}
          className={`py-2 px-1 rounded-lg font-bold text-[11px] transition-all truncate ${
            activeTab === 'temperatures' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Temperatures
        </button>
        <button
          onClick={() => setActiveTab('prevention')}
          className={`py-2 px-1 rounded-lg font-bold text-[11px] transition-all truncate ${
            activeTab === 'prevention' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Prevention
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`py-2 px-1 rounded-lg font-bold text-[11px] transition-all truncate ${
            activeTab === 'tips' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Key Tips
        </button>
      </div>

      {/* TAB 1: PATHOGENS & FOODBORNE DISEASES */}
      {activeTab === 'pathogens' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={pathogenSearch}
              onChange={(e) => setPathogenSearch(e.target.value)}
              placeholder="Search Salmonella, E. coli, poultry, milk..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div className="space-y-2.5">
            {filteredPathogens.map((pathogen) => {
              const isExpanded = expandedPathogen === pathogen.id;
              return (
                <div
                  key={pathogen.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setExpandedPathogen(isExpanded ? null : pathogen.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-red-50 text-red-600 shrink-0">
                        <Bug className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900 truncate">{pathogen.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              pathogen.severity === 'Critical'
                                ? 'bg-red-100 text-red-800'
                                : pathogen.severity === 'Severe'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {pathogen.type} · {pathogen.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Sources: {pathogen.commonFoods.join(', ')}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                          Onset & Incubation Period:
                        </span>
                        <p className="text-slate-600 mt-0.5">{pathogen.onsetDuration}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                          Clinical Symptoms:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pathogen.symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                          Temperature Multiplications:
                        </span>
                        <p className="text-slate-600 mt-0.5">{pathogen.dangerTempRange}</p>
                      </div>

                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wide">
                          Certified Prevention Measures:
                        </span>
                        <ul className="mt-1 space-y-1 text-[11px] text-emerald-800">
                          {pathogen.prevention.map((prev, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{prev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SAFE TEMPERATURES & DANGER ZONE */}
      {activeTab === 'temperatures' && (
        <div className="space-y-4">
          {/* Danger Zone Explainer */}
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span>The 4°C to 60°C Danger Zone</span>
            </div>
            <p className="text-xs text-red-950/80 leading-relaxed">
              Between 4°C (40°F) and 60°C (140°F), bacterial populations can double every 20 minutes.
              Perishable foods must never sit at room temperature for longer than <strong>2 hours</strong> (or 1 hour in hot conditions &gt; 32°C).
            </p>
          </div>

          {/* Temperature Spectrum Visual Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Temperature Safety Spectrum
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-900">Cooking & Pathogen Destruction</span>
                  <div className="text-[11px] text-purple-700">74°C–100°C (165°F–212°F)</div>
                </div>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Destroyed
                </span>
              </div>

              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900">Hot Holding (Buffets/Stoves)</span>
                  <div className="text-[11px] text-amber-700">&gt; 60°C (140°F)</div>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Safe Serving
                </span>
              </div>

              <div className="p-2 rounded-lg bg-red-100/70 border border-red-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-red-900">THE DANGER ZONE</span>
                  <div className="text-[11px] text-red-700">4°C to 60°C (Rapid Growth)</div>
                </div>
                <span className="text-[11px] font-bold text-red-800 bg-red-200 px-2 py-0.5 rounded">
                  Max 2 Hours!
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900">Refrigerator Chilling</span>
                  <div className="text-[11px] text-emerald-700">1°C to 4°C (34°F–40°F)</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Growth Slowed
                </span>
              </div>

              <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sky-900">Freezer Storage</span>
                  <div className="text-[11px] text-sky-700">&le; -18°C (0°F)</div>
                </div>
                <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Dormant
                </span>
              </div>
            </div>
          </div>

          {/* Minimum Internal Cooking Temperatures Chart */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>Certified Internal Cooking Temperatures</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {SAFE_COOKING_TEMPS.map((tempItem, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">{tempItem.food}</span>
                    <p className="text-[11px] text-slate-500">{tempItem.dangerNote}</p>
                    {tempItem.restTime && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Rest: {tempItem.restTime}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {tempItem.minTempC}°C
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {tempItem.minTempF}°F
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTAMINATION & PREVENTION */}
      {activeTab === 'prevention' && (
        <div className="space-y-4">
          {/* The 4 Core Principles */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              The 4 Core Pillars of Food Hygiene
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block">1. CLEAN</span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Wash hands for 20 seconds. Disinfect countertops and cutting surfaces between tasks.
                </p>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1">
                <span className="font-bold text-teal-950 block">2. SEPARATE</span>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Keep raw meats isolated from ready-to-eat salads in shopping carts and fridge.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-950 block">3. COOK</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Use probe thermometers. Cook poultry to 74°C; minced red meat to 71°C.
                </p>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                <span className="font-bold text-sky-950 block">4. CHILL</span>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  Refrigerate cooked meals within 2 hours. Keep fridge calibrated under 4°C.
                </p>
              </div>
            </div>
          </div>

          {/* Refrigerator Shelf Hierarchy Diagram */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Fridge Hierarchy (Top to Bottom)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Stack foods based on required cooking temperature to prevent gravity drips:
            </p>

            <div className="space-y-1.5 text-xs font-medium">
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex justify-between">
                <span>Top Shelf: Cooked Leftovers & Ready-to-eat Items</span>
                <span className="text-[10px] text-slate-500 font-bold">No cooking needed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex justify-between">
                <span>2nd Shelf: Dairy, Cheeses & Fresh Milk</span>
                <span className="text-[10px] text-slate-500 font-bold">Chilled & sealed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex justify-between">
                <span>3rd Shelf: Whole Fish & Seafood</span>
                <span className="text-[10px] text-emerald-700 font-bold">Min 63°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex justify-between">
                <span>4th Shelf: Whole Beef & Pork Cuts</span>
                <span className="text-[10px] text-emerald-700 font-bold">Min 63°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex justify-between">
                <span>5th Shelf: Ground Meats (Beef, Pork)</span>
                <span className="text-[10px] text-emerald-700 font-bold">Min 71°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 flex justify-between">
                <span>Bottom Shelf: Raw Poultry (Chicken, Turkey)</span>
                <span className="text-[10px] text-red-700 font-bold">Min 74°C (Highest Risk!)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KEY TIPS & PROCEDURES */}
      {activeTab === 'tips' && (
        <div className="space-y-3">
          {FOOD_SAFETY_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">{tip.title}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{tip.fullContent}</p>

              {tip.recommendedTemp && (
                <div className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg">
                  {tip.recommendedTemp}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
