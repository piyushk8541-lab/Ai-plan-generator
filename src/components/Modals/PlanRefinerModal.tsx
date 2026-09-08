import React, { useState } from 'react';
import { Plan } from '../../types/plan';
import { PlanGeneratorService } from '../../services/planGenerator';
import { StorageService } from '../../services/storageService';
import {
  X,
  Sliders,
  Zap,
  Leaf,
  Clock,
  DollarSign,
  Coffee,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react';

interface PlanRefinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onPlanRefined: (updatedPlan: Plan) => void;
}

export const PlanRefinerModal: React.FC<PlanRefinerModalProps> = ({
  isOpen,
  onClose,
  plan,
  onPlanRefined,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApplyRefinement = (modType: string, customText?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const refined = PlanGeneratorService.refinePlan(plan, modType, customText);
      StorageService.savePlan(refined);
      onPlanRefined(refined);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleApplyRefinement('custom_instruction', customPrompt.trim());
  };

  const presetOptions = [
    {
      id: 'intensity_up',
      title: '⚡ Increase Intensity (Bootcamp Mode)',
      desc: 'Add extra challenge blocks and expand daily output expectations',
      color: 'border-amber-500/30 hover:border-amber-500 text-amber-300',
    },
    {
      id: 'intensity_down',
      title: '🌿 Make More Relaxed & Flexible',
      desc: 'Lighten daily hourly commitments and create wider buffer margins',
      color: 'border-emerald-500/30 hover:border-emerald-500 text-emerald-300',
    },
    {
      id: 'double_duration',
      title: '⏳ Double Timeline Duration',
      desc: 'Spread milestones across 2x more days for a calm, sustainable pace',
      color: 'border-cyan-500/30 hover:border-cyan-500 text-cyan-300',
    },
    {
      id: 'budget_cut',
      title: '💸 Cut Discretionary Budget by 50%',
      desc: 'Prioritize free alternative tools and eliminate optional expenses',
      color: 'border-purple-500/30 hover:border-purple-500 text-purple-300',
    },
    {
      id: 'add_rest_days',
      title: '🧘 Add Buffer & Strategic Rest Days',
      desc: 'Designate periodic active recovery and catch-up days',
      color: 'border-blue-500/30 hover:border-blue-500 text-blue-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adjust / Refine Plan</h3>
              <p className="text-xs text-slate-400">
                Want to adjust duration, budget, or intensity?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Modifiers */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-300">
            1-Click Preset Adjustments
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presetOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isProcessing}
                onClick={() => handleApplyRefinement(opt.id)}
                className={`p-3.5 rounded-2xl bg-slate-950/80 border text-left transition-all ${opt.color} hover:bg-slate-800/40`}
              >
                <div className="text-xs font-bold leading-snug">{opt.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Freeform AI Instruction */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Or describe your specific adjustment:</span>
          </label>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Make Sunday full rest days and focus heavily on mock tests..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!customPrompt.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
