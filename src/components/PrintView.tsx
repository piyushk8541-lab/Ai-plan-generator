import React from 'react';
import { Plan } from '../types/plan';

interface PrintViewProps {
  plan: Plan;
}

export const PrintView: React.FC<PrintViewProps> = ({ plan }) => {
  const totalBudget = (plan.budgetItems || []).reduce((acc, item) => acc + item.estimatedCost, 0);

  return (
    <div className="hidden print:block text-black bg-white p-8 max-w-5xl mx-auto space-y-6 text-sm">
      {/* Print Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{plan.title}</h1>
            <p className="text-xs text-slate-600 mt-1">
              Category: {plan.category.toUpperCase()} | Duration: {plan.duration.value}{' '}
              {plan.duration.unit} ({plan.duration.totalDays} Days) | Intensity:{' '}
              {plan.intensity.toUpperCase()}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Target: {plan.goal.targetDate || 'Flexible'}</div>
            <div>Generated: {new Date(plan.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* 1. Overview */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          1. Executive Overview
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">{plan.overview}</p>
      </section>

      {/* 2. Goal */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          2. SMART Goal & Success Metrics
        </h2>
        <div className="text-xs">
          <strong>Primary Goal:</strong> {plan.goal.primaryGoal}
        </div>
        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
          {plan.goal.successMetrics.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {/* 3. Timeline Breakdown Table */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          3. Timeline Breakdown
        </h2>
        {plan.phases.map((phase) => (
          <div key={phase.phaseNumber} className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">
              Phase {phase.phaseNumber}: {phase.title} ({phase.durationLabel})
            </h3>
            <p className="text-xs text-slate-600 italic">{phase.objective}</p>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-semibold">
                  <th className="p-2 border-r border-slate-300 w-16">Day</th>
                  <th className="p-2 border-r border-slate-300">Focus Topic</th>
                  <th className="p-2 border-r border-slate-300">Morning</th>
                  <th className="p-2 border-r border-slate-300">Afternoon</th>
                  <th className="p-2 border-r border-slate-300">Evening</th>
                  <th className="p-2">Deliverable</th>
                </tr>
              </thead>
              <tbody>
                {phase.days.map((d) => (
                  <tr key={d.dayNumber} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 font-bold">Day {d.dayNumber}</td>
                    <td className="p-2 border-r border-slate-200">{d.focusArea}</td>
                    <td className="p-2 border-r border-slate-200">{d.morningActivity || '-'}</td>
                    <td className="p-2 border-r border-slate-200">{d.afternoonActivity || '-'}</td>
                    <td className="p-2 border-r border-slate-200">{d.eveningActivity || '-'}</td>
                    <td className="p-2">{d.targetDeliverable || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      {/* 4. Action Items */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          4. Master Action Items Checklist
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {plan.allActionItems.map((t) => (
            <div key={t.id} className="flex items-start gap-1.5">
              <span className="font-mono">{t.completed ? '[X]' : '[ ]'}</span>
              <span>
                Day {t.dayNumber}: {t.title} ({t.priority.toUpperCase()})
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Budget & Resources */}
      {plan.budgetItems && plan.budgetItems.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
            5. Resources & Budget Breakdown
          </h2>
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold">
                <th className="p-2 border-r border-slate-300">Category</th>
                <th className="p-2 border-r border-slate-300">Item Name</th>
                <th className="p-2 border-r border-slate-300">Est. Cost</th>
                <th className="p-2 border-r border-slate-300">Essential</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {plan.budgetItems.map((b) => (
                <tr key={b.id} className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200">{b.category}</td>
                  <td className="p-2 border-r border-slate-200">{b.itemName}</td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {b.currency}
                    {b.estimatedCost}
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    {b.isEssential ? 'Yes' : 'Optional'}
                  </td>
                  <td className="p-2">{b.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 6. Tips & Precautions */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          6. Tips & Precautions
        </h2>
        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
          {plan.tipsAndPrecautions.proTips.map((tip, i) => (
            <li key={i}>
              <strong>Tip:</strong> {tip}
            </li>
          ))}
          {plan.tipsAndPrecautions.precautionsAndRisks.map((risk, i) => (
            <li key={i}>
              <strong>Caution:</strong> {risk}
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Milestones */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-300 pb-1">
          7. Progress Milestones
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {plan.milestones.map((m) => (
            <div key={m.id} className="p-2 border border-slate-200 rounded">
              <div className="font-bold">
                [{m.percentMark}%] {m.title} ({m.targetDateOrDay})
              </div>
              <div className="text-slate-600 mt-0.5">{m.criteria}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
