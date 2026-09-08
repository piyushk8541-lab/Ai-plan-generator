import React from 'react';
import { PlanCategory, PlanIntensity, PlanDurationUnit } from '../../types/plan';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../CategoryIcon';
import { Sparkles, ArrowRight, Zap, Target, Clock, ShieldCheck } from 'lucide-react';

interface Step1CategoryGoalProps {
  category: PlanCategory;
  onSelectCategory: (cat: PlanCategory) => void;
  goal: string;
  onChangeGoal: (goal: string) => void;
  durationValue: number;
  onChangeDurationValue: (v: number) => void;
  durationUnit: PlanDurationUnit;
  onChangeDurationUnit: (u: PlanDurationUnit) => void;
  intensity: PlanIntensity;
  onChangeIntensity: (i: PlanIntensity) => void;
  onNext: () => void;
  onApplyPreset: (presetGoal: string, presetDuration: string) => void;
}

export const Step1CategoryGoal: React.FC<Step1CategoryGoalProps> = ({
  category,
  onSelectCategory,
  goal,
  onChangeGoal,
  durationValue,
  onChangeDurationValue,
  durationUnit,
  onChangeDurationUnit,
  intensity,
  onChangeIntensity,
  onNext,
  onApplyPreset,
}) => {
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const intensities: { id: PlanIntensity; label: string; desc: string; icon: string }[] = [
    { id: 'relaxed', label: 'Relaxed', desc: 'Gentle, flexible, low daily load', icon: '🌿' },
    { id: 'balanced', label: 'Balanced', desc: 'Optimal consistency & recovery', icon: '⚖️' },
    { id: 'intensive', label: 'Intensive', desc: 'Fast-paced, high daily yield', icon: '⚡' },
    { id: 'bootcamp', label: 'Bootcamp', desc: 'Maximum immersion & output', icon: '🔥' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Category Selector Cards */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Step 1 — Choose Plan Category</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === category;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <CategoryIcon category={cat.id} className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs leading-snug">{cat.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Inspirations Banner for selected category */}
      {currentCategoryInfo.presetGoals && currentCategoryInfo.presetGoals.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular {currentCategoryInfo.name} Templates (Click to fill):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategoryInfo.presetGoals.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onApplyPreset(preset.title, preset.duration)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-200 transition-all text-left flex items-center gap-1.5"
              >
                <span className="text-indigo-400 font-mono text-[11px]">[{preset.duration}]</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Main Goal Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What is your primary goal or purpose? <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => onChangeGoal(e.target.value)}
            rows={2}
            placeholder={`e.g., ${currentCategoryInfo.presetGoals[0]?.title || 'Master Python in 30 days and build 3 full projects'}`}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
          />
        </div>
      </div>

      {/* 3. Duration and Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Plan Duration</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={durationValue}
              onChange={(e) => onChangeDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-3 gap-1 flex-1 bg-slate-950 p-1 rounded-xl border border-slate-700">
              {(['days', 'weeks', 'months'] as PlanDurationUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onChangeDurationUnit(unit)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    durationUnit === unit
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Intensity Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Target Intensity</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {intensities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeIntensity(item.id)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  intensity === item.id
                    ? 'border-indigo-500 bg-indigo-600/20 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-200 leading-none">{item.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Next Step Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={!goal.trim()}
          onClick={onNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            goal.trim()
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continue to Custom Questions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
