import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Bot } from 'lucide-react';

export const GeneratingStep: React.FC = () => {
  const steps = [
    'Parsing category context, time constraints & core objective...',
    'Synthesizing periodized timeline & multi-phase roadmap...',
    'Assembling morning/afternoon/evening daily focus blocks...',
    'Compiling itemized budget breakdown & curated resources...',
    'Calibrating risk mitigations, pro tips & 25%/50%/75%/100% milestones...',
    'Formatting export-ready deliverable & interactive checklists...',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
      {/* Animated Orb */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 animate-pulse flex items-center justify-center shadow-2xl shadow-indigo-500/50">
          <Bot className="w-12 h-12 text-white animate-bounce" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-indigo-500/30 animate-spin" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
          Generating Your Custom Action Plan
        </h3>
        <p className="text-xs text-slate-400">
          Our AI Plan Generator Agent is tailoring every day, task, and resource to your exact specifications.
        </p>
      </div>

      {/* Progress step indicators */}
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left space-y-3 shadow-xl">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isCurrent
                  ? 'text-indigo-300 font-semibold scale-[1.02]'
                  : isDone
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-600 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
