import React from 'react';
import { Plan } from '../../types/plan';
import {
  DollarSign,
  Layers,
  ExternalLink,
  BookOpen,
  Smartphone,
  Wrench,
  Globe,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';

interface ResourcesTabProps {
  plan: Plan;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ plan }) => {
  const totalBudget = (plan.budgetItems || []).reduce((acc, b) => acc + b.estimatedCost, 0);
  const essentialBudget = (plan.budgetItems || [])
    .filter((b) => b.isEssential)
    .reduce((acc, b) => acc + b.estimatedCost, 0);
  const optionalBudget = totalBudget - essentialBudget;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'app':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-indigo-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'equipment':
        return <Dumbbell className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Itemized Budget Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">5. Itemized Budget Allocation</h2>
              <p className="text-xs text-slate-400">Estimated cost projections & essential priorities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Total Est:</span>{' '}
              <span className="font-bold text-emerald-400">${totalBudget}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Core Essentials:</span>{' '}
              <span className="font-bold text-cyan-400">${essentialBudget}</span>
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">Priority Status</th>
                <th className="py-3 px-4">Optimization Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {plan.budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{item.category}</td>
                  <td className="py-3 px-4 text-slate-200">{item.itemName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {item.currency}
                    {item.estimatedCost}
                  </td>
                  <td className="py-3 px-4">
                    {item.isEssential ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Essential
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        Optional / Discretionary
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{item.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 font-semibold text-slate-200 border-t-2 border-slate-700">
                <td colSpan={2} className="py-3 px-4 text-right">
                  Total Projected Investment:
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                  ${totalBudget}
                </td>
                <td colSpan={2} className="py-3 px-4 text-[11px] text-slate-400">
                  (Essentials: ${essentialBudget} | Optional: ${optionalBudget})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2. Recommended Tools, Apps, Materials & Links */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Recommended Tools, Apps & Resources</h2>
            <p className="text-xs text-slate-400">Handpicked materials to accelerate execution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.resources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    {getResourceIcon(res.type)}
                    <span>{res.title}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      res.isFree
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {res.isFree ? 'Free' : 'Paid / Subscription'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{res.description}</p>
              </div>

              {res.url && (
                <div className="pt-2 border-t border-slate-800/80">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
