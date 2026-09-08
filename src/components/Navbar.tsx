import React from 'react';
import {
  Sparkles,
  PlusCircle,
  FolderKanban,
  Settings,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { PlanCategory } from '../types/plan';
import { CATEGORIES } from '../data/categories';

interface NavbarProps {
  onNewPlan: () => void;
  onOpenSaved: () => void;
  onOpenSamples: () => void;
  onOpenSettings: () => void;
  onSelectCategoryQuick: (cat: PlanCategory) => void;
  savedPlansCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewPlan,
  onOpenSaved,
  onOpenSamples,
  onOpenSettings,
  onSelectCategoryQuick,
  savedPlansCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNewPlan}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  AI Plan Generator
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                  Agent
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400 font-medium">
                Personalized, actionable roadmaps for any goal
              </p>
            </div>
          </div>

          {/* Quick Category Chips (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategoryQuick(cat.id)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-full transition-all"
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSamples}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all"
              title="Browse pre-built sample roadmaps"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Explore Samples</span>
            </button>

            <button
              onClick={onOpenSaved}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all"
              title="Saved Plans"
            >
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">My Plans</span>
              {savedPlansCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white">
                  {savedPlansCount}
                </span>
              )}
            </button>

            <button
              onClick={onNewPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Plan</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
              title="AI Generation Engine Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
