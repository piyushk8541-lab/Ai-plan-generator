import React, { useState } from 'react';
import { Plan, DaySchedule, ActionItem } from '../../types/plan';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  List,
  Table as TableIcon,
  Sun,
  Sunset,
  Moon,
  Flag,
} from 'lucide-react';

interface TimelineTabProps {
  plan: Plan;
  onToggleTask: (taskId: string) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ plan, onToggleTask }) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const filteredPhases =
    selectedPhase === 'all'
      ? plan.phases
      : plan.phases.filter((p) => p.phaseNumber === selectedPhase);

  const allFilteredDays: DaySchedule[] = [];
  filteredPhases.forEach((p) => {
    p.days.forEach((d) => allFilteredDays.push(d));
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Phase Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phases:</span>
          </span>
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all ${
              selectedPhase === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({plan.duration.totalDays} Days)
          </button>
          {plan.phases.map((p) => (
            <button
              key={p.phaseNumber}
              onClick={() => setSelectedPhase(p.phaseNumber)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all ${
                selectedPhase === p.phaseNumber
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Phase {p.phaseNumber}: {p.title.slice(0, 18)}...
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table Format</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Cards Format</span>
          </button>
        </div>
      </div>

      {/* 1. TABLE FORMAT (Preferred per prompt requirements) */}
      {viewMode === 'table' && (
        <div className="space-y-8">
          {filteredPhases.map((phase) => (
            <div
              key={phase.phaseNumber}
              className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden"
            >
              {/* Phase Header Banner */}
              <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-mono">{phase.durationLabel}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{phase.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{phase.objective}</p>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-medium">
                    {phase.days.length} Days
                  </span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 w-20">Day</th>
                      <th className="py-3 px-4 w-60">Focus Area & Target</th>
                      <th className="py-3 px-4">Morning Block</th>
                      <th className="py-3 px-4">Afternoon Block</th>
                      <th className="py-3 px-4">Evening Block</th>
                      <th className="py-3 px-4 w-48">Key Deliverable</th>
                      <th className="py-3 px-4 w-24 text-center">Tasks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {phase.days.map((day) => {
                      const completedCount = day.tasks.filter((t) => t.completed).length;
                      const isExpanded = !!expandedDays[day.dayNumber];

                      return (
                        <React.Fragment key={day.dayNumber}>
                          <tr className="hover:bg-slate-800/30 transition-colors group">
                            {/* Day Number Badge */}
                            <td className="py-3.5 px-4 align-top">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold font-mono text-xs">
                                D{day.dayNumber}
                              </span>
                            </td>

                            {/* Focus Area */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-semibold text-white">{day.focusArea}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                <span>Est. {day.estimatedHours || 3}h</span>
                              </div>
                            </td>

                            {/* Morning Block */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>{day.morningActivity || 'Focus block execution'}</span>
                              </div>
                            </td>

                            {/* Afternoon Block */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                                <Sunset className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                                <span>{day.afternoonActivity || 'Secondary implementation'}</span>
                              </div>
                            </td>

                            {/* Evening Block */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                                <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <span>{day.eveningActivity || 'Review & next day prep'}</span>
                              </div>
                            </td>

                            {/* Target Deliverable */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="flex items-start gap-1.5 text-emerald-400 font-medium">
                                <Flag className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{day.targetDeliverable || 'Complete daily milestone'}</span>
                              </div>
                            </td>

                            {/* Tasks expandable trigger */}
                            <td className="py-3.5 px-4 align-top text-center">
                              <button
                                onClick={() => toggleDayExpanded(day.dayNumber)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  completedCount === day.tasks.length && day.tasks.length > 0
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                <span>
                                  {completedCount}/{day.tasks.length}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded inline checklist for this day */}
                          {isExpanded && (
                            <tr className="bg-slate-950/90 border-b border-slate-800">
                              <td colSpan={7} className="p-4">
                                <div className="space-y-2 max-w-4xl mx-auto">
                                  <div className="text-xs font-semibold text-indigo-300 flex items-center justify-between">
                                    <span>Day {day.dayNumber} Action Items:</span>
                                    <span className="text-[11px] text-slate-400">
                                      Click checkbox to mark complete
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {day.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        onClick={() => onToggleTask(task.id)}
                                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                          task.completed
                                            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 line-through'
                                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={task.completed}
                                          onChange={() => {}}
                                          className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                                        />
                                        <div className="text-xs flex-1 leading-snug">
                                          <span>{task.title}</span>
                                          {task.priority && (
                                            <span className="ml-2 text-[10px] uppercase font-bold text-slate-400">
                                              [{task.priority}]
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. CARDS FORMAT */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFilteredDays.map((day) => {
            const completedCount = day.tasks.filter((t) => t.completed).length;

            return (
              <div
                key={day.dayNumber}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/20">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {day.estimatedHours || 3}h
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{day.focusArea}</h4>

                  <div className="mt-3 space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-start gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{day.morningActivity || '-'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Sunset className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{day.afternoonActivity || '-'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{day.eveningActivity || '-'}</span>
                    </div>
                  </div>

                  {day.targetDeliverable && (
                    <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
                      <Flag className="w-3 h-3 shrink-0" />
                      <span>{day.targetDeliverable}</span>
                    </div>
                  )}
                </div>

                {/* Day Tasks */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Tasks ({completedCount}/{day.tasks.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className={`p-2 rounded-lg text-xs cursor-pointer flex items-start gap-2 border transition-all ${
                          task.completed
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400 line-through'
                            : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-tight text-[11px]">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
