import React from 'react';
import { Plan } from '../../types/plan';
import { CategoryIcon } from '../CategoryIcon';
import {
  Download,
  Share2,
  Sliders,
  Printer,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  PlusCircle,
  Flame,
} from 'lucide-react';

interface PlanHeaderProps {
  plan: Plan;
  onOpenExport: () => void;
  onOpenRefine: () => void;
  onPrint: () => void;
  onNewPlan: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  plan,
  onOpenExport,
  onOpenRefine,
  onPrint,
  onNewPlan,
  completedTasksCount,
  totalTasksCount,
}) => {
  const percentComplete =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const totalBudget = (plan.budgetItems || []).reduce((acc, item) => acc + item.estimatedCost, 0);

  const intensityColors = {
    relaxed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    balanced: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    intensive: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    bootcamp: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 pb-6 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Top badges & action buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              <CategoryIcon category={plan.category} className="w-3.5 h-3.5" />
              <span>{plan.category} PLAN</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${intensityColors[plan.intensity] || intensityColors.balanced}`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{plan.intensity} Intensity</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{plan.duration.value} {plan.duration.unit} ({plan.duration.totalDays} Days)</span>
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenRefine}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all active:scale-95"
              title="Want to adjust duration, budget, or intensity?"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adjust / Refine Plan</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Export as PDF, Markdown, iCal, or share"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download & Share</span>
            </button>

            <button
              onClick={onPrint}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              title="Print Plan"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onNewPlan}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {plan.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Target Goal: <span className="text-indigo-300 font-medium">{plan.goal.primaryGoal}</span>
          </p>
        </div>

        {/* Quick Stats Grid & Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Timeline</div>
              <div className="text-sm font-bold text-white">{plan.duration.totalDays} Days</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Daily Load</div>
              <div className="text-sm font-bold text-white">~{plan.constraints.dailyCommitmentHours || 3} hrs/day</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Est. Budget</div>
              <div className="text-sm font-bold text-white">{totalBudget > 0 ? `$${totalBudget}` : 'Minimal'}</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Progress</span>
                <span className="font-bold text-purple-400">{percentComplete}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
