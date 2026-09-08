import React from 'react';
import { Plan, MilestoneItem } from '../../types/plan';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  Trophy,
  Gift,
  CheckCircle2,
  Quote,
} from 'lucide-react';

interface TipsMilestonesTabProps {
  plan: Plan;
  onToggleMilestone: (milestoneId: string) => void;
}

export const TipsMilestonesTab: React.FC<TipsMilestonesTabProps> = ({
  plan,
  onToggleMilestone,
}) => {
  const handleMilestoneClick = (m: MilestoneItem) => {
    onToggleMilestone(m.id);
    if (!m.completed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Motivational Quote Banner */}
      {plan.tipsAndPrecautions.motivationQuote && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-900 border border-indigo-800/40 shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
            <Quote className="w-6 h-6" />
          </div>
          <p className="text-sm italic font-medium text-indigo-200">
            {plan.tipsAndPrecautions.motivationQuote}
          </p>
        </div>
      )}

      {/* 1. Pro Tips, Precautions & Mitigations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pro Tips */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">6. Pro Tips</h2>
              <p className="text-[11px] text-slate-400">High-leverage habits</p>
            </div>
          </div>

          <div className="space-y-3">
            {plan.tipsAndPrecautions.proTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
              >
                💡 {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Precautions & Pitfalls */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Common Pitfalls</h2>
              <p className="text-[11px] text-slate-400">Traps to actively avoid</p>
            </div>
          </div>

          <div className="space-y-3">
            {plan.tipsAndPrecautions.precautionsAndRisks.map((risk, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-rose-300/90 leading-relaxed"
              >
                ⚠️ {risk}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Mitigation Strategies */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mitigation Protocols</h2>
              <p className="text-[11px] text-slate-400">How to recover from friction</p>
            </div>
          </div>

          <div className="space-y-3">
            {plan.tipsAndPrecautions.mitigationStrategies.map((mit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-emerald-300/90 leading-relaxed"
              >
                🛡️ {mit}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Milestones & Progress Checkpoints */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">7. Milestones & Checkpoint Gates</h2>
            <p className="text-xs text-slate-400">
              Track your journey at 25%, 50%, 75%, and 100% completion marks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan.milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => handleMilestoneClick(m)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                m.completed
                  ? 'bg-emerald-950/30 border-emerald-700/60 shadow-lg shadow-emerald-900/20'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                      m.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {m.percentMark}% Mark
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{m.targetDateOrDay}</span>
                </div>

                <h3
                  className={`text-sm font-bold leading-snug mt-2 ${
                    m.completed ? 'text-emerald-300' : 'text-white'
                  }`}
                >
                  {m.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.criteria}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {m.rewardIdea && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300">
                    <Gift className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>Reward: {m.rewardIdea}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <span className={m.completed ? 'text-emerald-400' : 'text-slate-500'}>
                    {m.completed ? 'Completed ✓' : 'Pending Milestone'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      m.completed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
