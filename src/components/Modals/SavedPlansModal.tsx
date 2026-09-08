import React, { useState } from 'react';
import { Plan, PlanCategory } from '../../types/plan';
import { CategoryIcon } from '../CategoryIcon';
import { StorageService } from '../../services/storageService';
import {
  X,
  FolderKanban,
  Search,
  Calendar,
  Trash2,
  Copy,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  activePlanId?: string;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  onDuplicatePlan: (plan: Plan) => void;
  onNewPlan: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onDuplicatePlan,
  onNewPlan,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.goal.primaryGoal.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Saved Plans ({plans.length})</h3>
              <p className="text-xs text-slate-400">Switch between plans, backup, or duplicate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewPlan();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="py-4 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by plan title or goal..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Plans List Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No saved plans found. Create your first plan!
            </div>
          ) : (
            filtered.map((p) => {
              const isActive = p.id === activePlanId;
              const completedTasks = p.allActionItems.filter((t) => t.completed).length;
              const totalTasks = p.allActionItems.length;
              const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-600/60 ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectPlan(p);
                      onClose();
                    }}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                      <CategoryIcon category={p.category} className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                          {p.title}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="capitalize">{p.category}</span>
                        <span>•</span>
                        <span>{p.duration.totalDays} Days</span>
                        <span>•</span>
                        <span className="text-purple-400 font-medium">
                          {completedTasks}/{totalTasks} tasks ({percent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onDuplicatePlan(p)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                      title="Duplicate Plan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {plans.length > 1 && (
                      <button
                        onClick={() => onDeletePlan(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
