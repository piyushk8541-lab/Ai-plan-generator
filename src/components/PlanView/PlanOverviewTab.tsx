import React from 'react';
import { Plan } from '../../types/plan';
import { Target, CheckSquare, Layers, Shield, Sparkles, SlidersHorizontal } from 'lucide-react';

interface PlanOverviewTabProps {
  plan: Plan;
  onNavigateToTimeline: () => void;
  onNavigateToChecklist: () => void;
}

export const PlanOverviewTab: React.FC<PlanOverviewTabProps> = ({
  plan,
  onNavigateToTimeline,
  onNavigateToChecklist,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">1. Executive Overview</h2>
            <p className="text-xs text-slate-400">High-level strategic roadmap summary</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {plan.overview}
        </p>

        {plan.customRefinements && plan.customRefinements.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>
              <strong>Active Custom Refinements:</strong> {plan.customRefinements.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* 2. SMART Goal & Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. SMART Goal Definition</h2>
              <p className="text-xs text-slate-400">Target outcome and strategic rationale</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Primary Goal
              </div>
              <div className="text-sm font-bold text-cyan-300">{plan.goal.primaryGoal}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Deadline
                </div>
                <div className="text-xs font-semibold text-white">{plan.goal.targetDate || 'Flexible'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Pacing Mode
                </div>
                <div className="text-xs font-semibold text-emerald-400 capitalize">{plan.intensity} Pace</div>
              </div>
            </div>

            {plan.goal.whyItMatters && (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Why This Matters
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{plan.goal.whyItMatters}</p>
              </div>
            )}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Target Success Metrics</h2>
              <p className="text-xs text-slate-400">Measurable key results (OKRs)</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {plan.goal.successMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Phases Roadmap Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Phase Architecture</h2>
              <p className="text-xs text-slate-400">Structured progression across {plan.phases.length} phases</p>
            </div>
          </div>

          <button
            onClick={onNavigateToTimeline}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
          >
            <span>View Full Timeline Table &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan.phases.map((phase) => (
            <div
              key={phase.phaseNumber}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    Phase {phase.phaseNumber}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{phase.durationLabel}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{phase.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{phase.objective}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{phase.days.length} Days</span>
                <span className="text-emerald-400 font-medium">{phase.keyDeliverables.length} Deliverables</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Plan Constraints & Environment Context */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Personalized Constraints & Calibration</h2>
            <p className="text-xs text-slate-400">Parameters used to fine-tune this blueprint</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Budget Tier</div>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {plan.constraints.budget || 'Standard'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Daily Hours</div>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {plan.constraints.dailyCommitmentHours || 3} Hours/Day
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Starting Level</div>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {plan.constraints.skillLevel || 'Intermediate'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Setup / Venue</div>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {plan.constraints.locationOrEquipment || 'Standard'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Preferences</div>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {plan.constraints.dietOrPreferences || 'Standard'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Total Tasks</div>
            <div className="text-xs font-semibold text-indigo-400 mt-1">
              {plan.allActionItems.length} Tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
