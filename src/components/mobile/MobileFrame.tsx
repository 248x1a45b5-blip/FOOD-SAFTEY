import React from 'react';
import { ShieldCheck, Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isExpandedView: boolean;
  onToggleExpandedView: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  isExpandedView,
  onToggleExpandedView,
}) => {
  // Current time for the Android status bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      {/* Viewport switch toolbar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            FoodSafe Live Simulator
          </span>
          <span className="hidden sm:inline">· Android Material 3 Design</span>
        </div>

        <button
          onClick={onToggleExpandedView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
        >
          {isExpandedView ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Switch to Phone Frame</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-emerald-600" />
              <span>Expand to Full View</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`transition-all duration-300 ${
          isExpandedView
            ? 'w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'
            : 'w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800'
        }`}
      >
        <div
          className={`flex flex-col bg-slate-50 overflow-hidden relative ${
            isExpandedView ? 'h-[750px]' : 'rounded-[34px] h-[780px]'
          }`}
        >
          {/* Android Status Bar (Only in phone frame mode) */}
          {!isExpandedView && (
            <div className="h-9 bg-white flex items-center justify-between px-6 pt-1 select-none shrink-0 border-b border-slate-100 z-30">
              <span className="text-xs font-semibold text-slate-800 tracking-tight font-mono">
                {currentTime}
              </span>
              {/* Camera punch hole */}
              <div className="w-3.5 h-3.5 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-700">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">5G</span>
                <Battery className="w-4 h-4 fill-slate-700" />
              </div>
            </div>
          )}

          {/* Screen Body */}
          <div className="flex-1 overflow-y-auto relative">{children}</div>

          {/* Material 3 Bottom Navigation Bar */}
          <nav className="h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 shrink-0 z-30">
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-h-[44px] ${
                activeTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'home' ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeTab === 'home' ? '2.4' : '2'}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-[11px] mt-0.5">Home</span>
            </button>

            <button
              onClick={() => onTabChange('tracker')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-h-[44px] ${
                activeTab === 'tracker' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'tracker' ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeTab === 'tracker' ? '2.4' : '2'}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span className="text-[11px] mt-0.5">Tracker</span>
            </button>

            <button
              onClick={() => onTabChange('safety')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-h-[44px] ${
                activeTab === 'safety' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'safety' ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeTab === 'safety' ? '2.4' : '2'}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-[11px] mt-0.5">Safety Hub</span>
            </button>

            <button
              onClick={() => onTabChange('hygiene')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-h-[44px] ${
                activeTab === 'hygiene' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'hygiene' ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeTab === 'hygiene' ? '2.4' : '2'}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span className="text-[11px] mt-0.5">Hygiene</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-h-[44px] ${
                activeTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'profile' ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeTab === 'profile' ? '2.4' : '2'}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-[11px] mt-0.5">Profile</span>
            </button>
          </nav>

          {/* Android Home Navigation Line (Phone mode) */}
          {!isExpandedView && (
            <div className="h-4 bg-white flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
