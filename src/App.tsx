import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Code2,
  Download,
  Plus,
  RefreshCw,
  Bell,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { FoodItem, HygieneItem, UserProfile } from './types/foodSafe';
import {
  getStoredFoodItems,
  saveFoodItems,
  getStoredHygieneItems,
  saveHygieneItems,
  getStoredUserProfile,
  saveUserProfile,
  resetAllData
} from './services/storage';
import { MobileFrame } from './components/mobile/MobileFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExpiryTrackerScreen } from './components/screens/ExpiryTrackerScreen';
import { AddFoodScreen } from './components/screens/AddFoodScreen';
import { FoodDetailsScreen } from './components/screens/FoodDetailsScreen';
import { SafetyInfoScreen } from './components/screens/SafetyInfoScreen';
import { HygieneChecklistScreen } from './components/screens/HygieneChecklistScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { FlutterCodebaseHub } from './components/codebase/FlutterCodebaseHub';

export default function App() {
  // App views: 'simulator' or 'codebase'
  const [currentView, setCurrentView] = useState<'simulator' | 'codebase'>('simulator');

  // Mobile navigation tab inside the simulator
  const [mobileTab, setMobileTab] = useState<string>('home');

  // Selected item for Food Details Screen
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);

  // Add Food Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Expanded View vs Phone Frame mode
  const [isExpandedView, setIsExpandedView] = useState(false);

  // Persistent States
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [hygieneItems, setHygieneItems] = useState<HygieneItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());

  // Load stored state on mount
  useEffect(() => {
    setFoodItems(getStoredFoodItems());
    setHygieneItems(getStoredHygieneItems());
    setUserProfile(getStoredUserProfile());
  }, []);

  // Update storage on food items change
  const handleUpdateFoodItems = (newItems: FoodItem[]) => {
    setFoodItems(newItems);
    saveFoodItems(newItems);
  };

  // Add new food item
  const handleAddFoodItem = (newItemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
    };
    const updated = [newItem, ...foodItems];
    handleUpdateFoodItems(updated);
    setMobileTab('tracker');
  };

  // Mark item as consumed
  const handleConsumeItem = (id: string) => {
    const updated = foodItems.map((item) =>
      item.id === id ? { ...item, isConsumed: true } : item
    );
    handleUpdateFoodItems(updated);
    setSelectedFoodItem(null);
  };

  // Discard food item
  const handleDiscardItem = (id: string) => {
    const updated = foodItems.filter((item) => item.id !== id);
    handleUpdateFoodItems(updated);
    setSelectedFoodItem(null);
  };

  // Extend item expiry date
  const handleExtendItem = (id: string, daysToAdd: number) => {
    const updated = foodItems.map((item) => {
      if (item.id === id) {
        const curExp = new Date(item.expiryDate);
        curExp.setDate(curExp.getDate() + daysToAdd);
        return { ...item, expiryDate: curExp.toISOString().split('T')[0] };
      }
      return item;
    });
    handleUpdateFoodItems(updated);
    if (selectedFoodItem && selectedFoodItem.id === id) {
      const curExp = new Date(selectedFoodItem.expiryDate);
      curExp.setDate(curExp.getDate() + daysToAdd);
      setSelectedFoodItem({
        ...selectedFoodItem,
        expiryDate: curExp.toISOString().split('T')[0],
      });
    }
  };

  // Toggle hygiene item completion
  const handleToggleHygiene = (id: string) => {
    const updated = hygieneItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setHygieneItems(updated);
    saveHygieneItems(updated);
  };

  // Reset daily hygiene checklist
  const handleResetHygiene = () => {
    const updated = hygieneItems.map((item) => ({ ...item, completed: false }));
    setHygieneItems(updated);
    saveHygieneItems(updated);
  };

  // Update user profile
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  // Reset all application data to seed state
  const handleResetAllData = () => {
    resetAllData();
    setFoodItems(getStoredFoodItems());
    setHygieneItems(getStoredHygieneItems());
    setUserProfile(getStoredUserProfile());
    setSelectedFoodItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Universal Top Bar Contract: 3 Zones: Brand - Nav Links - 1 Action */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single Brand Wordmark in display face */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              FoodSafe
            </a>
          </div>

          {/* Zone 2: Single-line clean text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                setCurrentView('simulator');
                setMobileTab('home');
                setSelectedFoodItem(null);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'simulator' && mobileTab === 'home' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView('simulator');
                setMobileTab('tracker');
                setSelectedFoodItem(null);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'simulator' && mobileTab === 'tracker' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Expiry Tracker
            </button>
            <button
              onClick={() => {
                setCurrentView('simulator');
                setMobileTab('safety');
                setSelectedFoodItem(null);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'simulator' && mobileTab === 'safety' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Safety Hub
            </button>
            <button
              onClick={() => {
                setCurrentView('simulator');
                setMobileTab('hygiene');
                setSelectedFoodItem(null);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'simulator' && mobileTab === 'hygiene' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Hygiene Audit
            </button>
            <button
              onClick={() => setCurrentView('codebase')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'codebase' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Flutter Source Code
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentView === 'simulator' ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Food Item</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('simulator')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Test Live Simulator</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col">
        {/* View Mode Toggle Strip */}
        <div className="bg-white border-b border-slate-200 py-2 px-4 shadow-2xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setCurrentView('simulator')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  currentView === 'simulator'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Interactive Mobile App</span>
              </button>
              <button
                onClick={() => setCurrentView('codebase')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  currentView === 'codebase'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Flutter & Dart Codebase (.ZIP)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-500">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                {foodItems.filter((i) => !i.isConsumed).length} Foods Monitored
              </span>
              <span>·</span>
              <span className="text-[11px]">SQLite Schema Sync Active</span>
            </div>
          </div>
        </div>

        {/* View Switch */}
        {currentView === 'simulator' ? (
          <div className="flex-1 p-2 sm:p-4 flex items-center justify-center">
            <MobileFrame
              activeTab={mobileTab}
              onTabChange={(tab) => {
                setMobileTab(tab);
                setSelectedFoodItem(null);
              }}
              isExpandedView={isExpandedView}
              onToggleExpandedView={() => setIsExpandedView(!isExpandedView)}
            >
              {/* If an item is selected, render Food Details Screen */}
              {selectedFoodItem ? (
                <FoodDetailsScreen
                  item={selectedFoodItem}
                  onBack={() => setSelectedFoodItem(null)}
                  onConsume={handleConsumeItem}
                  onDiscard={handleDiscardItem}
                  onExtend={handleExtendItem}
                />
              ) : (
                <>
                  {mobileTab === 'home' && (
                    <HomeScreen
                      foodItems={foodItems}
                      hygieneItems={hygieneItems}
                      userProfile={userProfile}
                      onNavigate={(tab) => setMobileTab(tab)}
                      onOpenAddModal={() => setIsAddModalOpen(true)}
                      onSelectItem={(item) => setSelectedFoodItem(item)}
                    />
                  )}

                  {mobileTab === 'tracker' && (
                    <ExpiryTrackerScreen
                      foodItems={foodItems}
                      onSelectItem={(item) => setSelectedFoodItem(item)}
                      onOpenAddModal={() => setIsAddModalOpen(true)}
                    />
                  )}

                  {mobileTab === 'safety' && <SafetyInfoScreen />}

                  {mobileTab === 'hygiene' && (
                    <HygieneChecklistScreen
                      hygieneItems={hygieneItems}
                      onToggleItem={handleToggleHygiene}
                      onResetChecklist={handleResetHygiene}
                    />
                  )}

                  {mobileTab === 'profile' && (
                    <ProfileScreen
                      userProfile={userProfile}
                      onUpdateProfile={handleUpdateProfile}
                      onResetAllData={handleResetAllData}
                    />
                  )}
                </>
              )}
            </MobileFrame>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <FlutterCodebaseHub />
          </div>
        )}
      </main>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <AddFoodScreen
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddFoodItem}
        />
      )}
    </div>
  );
}
