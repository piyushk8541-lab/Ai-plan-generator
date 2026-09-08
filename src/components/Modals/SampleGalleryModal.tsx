import React from 'react';
import { Plan } from '../../types/plan';
import { SAMPLE_PLANS } from '../../data/samplePlans';
import { CategoryIcon } from '../CategoryIcon';
import { X, Sparkles, Compass, ArrowRight, Clock, Target } from 'lucide-react';

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSample: (plan: Plan) => void;
}

export const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onLoadSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Explore Sample AI Roadmaps</h3>
              <p className="text-xs text-slate-400">
                Click any pre-generated plan to inspect its timeline, daily schedules, and checklists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SAMPLE_PLANS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => {
                  onLoadSample(sample);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      <CategoryIcon category={sample.category} className="w-3 h-3" />
                      <span>{sample.category}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {sample.duration.value} {sample.duration.unit}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {sample.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {sample.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Load & View Roadmap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
