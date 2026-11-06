import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  FileText,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';
import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../../data/flutterFiles';

export const FlutterCodebaseHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[1]); // default main.dart
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  const filteredFiles = FLUTTER_PROJECT_FILES.filter((f) =>
    f.path.toLowerCase().includes(filterQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each flutter file to the zip maintaining folder structure
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Add AndroidManifest.xml template
      zip.file(
        'android/app/src/main/AndroidManifest.xml',
        `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.foodsafe.app">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <application
        android:label="FoodSafe"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'foodsafe_flutter_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              Flutter 3.x · Dart · SQLite · Provider
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Android Mobile Architecture</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            FoodSafe Flutter Source Code & Deployment Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Complete, compilable Dart codebase engineered for your college group project. Includes full sqflite database implementation, Provider state management, Material 3 green & white design, and release APK instructions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Full Project (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {zipSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>foodsafe_flutter_project.zip has been generated and downloaded to your computer!</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'code'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Flutter Codebase Explorer ({FLUTTER_PROJECT_FILES.length} Files)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>How to Run & Generate Release APK</span>
        </button>
      </div>

      {activeTab === 'code' ? (
        /* Code Explorer Grid */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* File Tree List */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 space-y-3 shadow-xs h-[640px] flex flex-col">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search Flutter files..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <FileCode
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-[11px]">{file.path}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                        {file.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden h-[640px]">
            {/* Code Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-bold text-slate-200 truncate">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  ({selectedFile.code.split('\n').length} lines)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description Banner */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-emerald-400/90 font-mono">
              // {selectedFile.description}
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed selection:bg-emerald-900 selection:text-white">
              <pre className="tab-size-2">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* Instructions & APK Generation Guide */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              College Project Execution & Android APK Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these verified steps to run the application on Android devices or generate a submission APK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold">1</span>
                <span>Unzip & Install Dependencies</span>
              </div>
              <p className="text-xs text-slate-600">
                Extract the downloaded zip, open a terminal in the project directory, and fetch all packages:
              </p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2.5 rounded-lg border border-slate-800">
                flutter pub get
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold">2</span>
                <span>Run in Development Mode</span>
              </div>
              <p className="text-xs text-slate-600">
                Connect an Android device with USB debugging enabled or launch an Android emulator, then run:
              </p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2.5 rounded-lg border border-slate-800">
                flutter run
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold">3</span>
                <span>Run Automated Tests</span>
              </div>
              <p className="text-xs text-slate-600">
                Verify the unit tests and widget initialization pass without errors:
              </p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2.5 rounded-lg border border-slate-800">
                flutter test
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-900">4</span>
                <span>Generate Release APK for Submission</span>
              </div>
              <p className="text-xs text-emerald-900/90">
                Run the release build command to produce the standalone APK file:
              </p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2.5 rounded-lg border border-slate-800">
                flutter build apk --release
              </div>
              <p className="text-[11px] text-emerald-800 font-mono pt-1">
                Output path: build/app/outputs/flutter-apk/app-release.apk
              </p>
            </div>
          </div>

          {/* Presentation & Viva Tips */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              College Viva & Group Project Highlights
            </h3>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>Architecture:</strong> Layered MVC pattern cleanly separating Models, Providers (State), Services (Database & Preferences), and UI Screens.</li>
              <li><strong>Data Persistence:</strong> SQLite (<code className="text-emerald-300">sqflite</code>) ensures food inventory survives app kills and device reboots.</li>
              <li><strong>State Management:</strong> <code className="text-emerald-300">Provider</code> (<code className="text-emerald-300">ChangeNotifier</code>) handles reactive updates with zero unnecessary widget rebuilds.</li>
              <li><strong>Food Safety Science:</strong> Temperature danger zone logic and pathogen references grounded in international WHO/FDA protocols.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
