import React from 'react';
import { PlanCategory } from '../../types/plan';
import { CATEGORIES } from '../../data/categories';
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';

interface Step2QuestionsProps {
  category: PlanCategory;
  answers: Record<string, any>;
  onAnswerChange: (fieldId: string, value: any) => void;
  customNotes: string;
  onCustomNotesChange: (notes: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Step2Questions: React.FC<Step2QuestionsProps> = ({
  category,
  answers,
  onAnswerChange,
  customNotes,
  onCustomNotesChange,
  onBack,
  onGenerate,
  isGenerating,
}) => {
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const questions = currentCategoryInfo.questions || [];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-200 leading-relaxed">
          <p className="font-semibold text-white mb-0.5">
            Step 2 — Personalizing Your {currentCategoryInfo.name} Blueprint
          </p>
          Answer these targeted questions so the AI can tailor exact timelines, daily workloads, recommended resources, and budget allocations to your situation.
        </div>
      </div>

      {/* Dynamic Questions List */}
      <div className="space-y-4">
        {questions.map((q) => {
          const val = answers[q.id] !== undefined ? answers[q.id] : q.defaultValue || '';

          return (
            <div key={q.id} className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                {q.label} {q.required && <span className="text-rose-400">*</span>}
              </label>

              {q.type === 'select' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = val === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onAnswerChange(q.id, opt)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600/20 text-white font-semibold ring-1 ring-indigo-500'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              {q.type === 'date' && (
                <input
                  type="date"
                  value={val}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  rows={2}
                  value={val}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              )}

              {q.helperText && (
                <span className="text-[11px] text-slate-400 block">{q.helperText}</span>
              )}
            </div>
          );
        })}

        {/* Additional Custom Requirements Field */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-slate-200">
            Any Other Constraints, Preferences, or Specific Tools? (Optional)
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => onCustomNotesChange(e.target.value)}
            placeholder="e.g., I have 1 rest day on Wednesday, need gluten-free meal substitutions, only have $200 total budget..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Generate Complete Action Plan</span>
        </button>
      </div>
    </div>
  );
};
