import React, { useState } from 'react';
import { Plan, ActionItem } from '../../types/plan';
import { PlanHeader } from './PlanHeader';
import { PlanOverviewTab } from './PlanOverviewTab';
import { TimelineTab } from './TimelineTab';
import { ChecklistTab } from './ChecklistTab';
import { ResourcesTab } from './ResourcesTab';
import { TipsMilestonesTab } from './TipsMilestonesTab';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  DollarSign,
  Trophy,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface PlanDashboardProps {
  plan: Plan;
  onUpdatePlan: (plan: Plan) => void;
  onOpenExport: () => void;
  onOpenRefine: () => void;
  onPrint: () => void;
  onNewPlan: () => void;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  onUpdatePlan,
  onOpenExport,
  onOpenRefine,
  onPrint,
  onNewPlan,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'checklist' | 'resources' | 'milestones'
  >('overview');

  const handleToggleTask = (taskId: string) => {
    const updatedPlan: Plan = JSON.parse(JSON.stringify(plan));

    // Update in allActionItems
    const task = updatedPlan.allActionItems.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }

    // Update in daySchedules
    updatedPlan.daySchedules.forEach((day) => {
      day.tasks.forEach((t) => {
        if (t.id === taskId) {
          t.completed = !t.completed;
        }
      });
    });

    // Update in phases
    updatedPlan.phases.forEach((p) => {
      p.days.forEach((day) => {
        day.tasks.forEach((t) => {
          if (t.id === taskId) {
            t.completed = !t.completed;
          }
        });
      });
    });

    updatedPlan.updatedAt = new Date().toISOString();
    onUpdatePlan(updatedPlan);
  };

  const handleAddTask = (newTaskData: Omit<ActionItem, 'id'>) => {
    const updatedPlan: Plan = JSON.parse(JSON.stringify(plan));
    const newId = `task_custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newTask: ActionItem = {
      ...newTaskData,
      id: newId,
    };

    updatedPlan.allActionItems.push(newTask);

    // Add to specific day
    const day = updatedPlan.daySchedules.find((d) => d.dayNumber === newTaskData.dayNumber);
    if (day) {
      day.tasks.push(newTask);
    }

    // Add to phase day
    updatedPlan.phases.forEach((p) => {
      p.days.forEach((d) => {
        if (d.dayNumber === newTaskData.dayNumber) {
          d.tasks.push(newTask);
        }
      });
    });

    updatedPlan.updatedAt = new Date().toISOString();
    onUpdatePlan(updatedPlan);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedPlan: Plan = JSON.parse(JSON.stringify(plan));
    updatedPlan.allActionItems = updatedPlan.allActionItems.filter((t) => t.id !== taskId);

    updatedPlan.daySchedules.forEach((day) => {
      day.tasks = day.tasks.filter((t) => t.id !== taskId);
    });

    updatedPlan.phases.forEach((p) => {
      p.days.forEach((d) => {
        d.tasks = d.tasks.filter((t) => t.id !== taskId);
      });
    });

    updatedPlan.updatedAt = new Date().toISOString();
    onUpdatePlan(updatedPlan);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedPlan: Plan = JSON.parse(JSON.stringify(plan));
    const m = updatedPlan.milestones.find((item) => item.id === milestoneId);
    if (m) {
      m.completed = !m.completed;
    }
    updatedPlan.updatedAt = new Date().toISOString();
    onUpdatePlan(updatedPlan);
  };

  const completedTasksCount = plan.allActionItems.filter((t) => t.completed).length;
  const totalTasksCount = plan.allActionItems.length;

  const tabs = [
    { id: 'overview', label: '1 & 2. Overview & Goals', icon: LayoutDashboard },
    { id: 'timeline', label: '3. Timeline & Schedules', icon: CalendarDays },
    {
      id: 'checklist',
      label: `4. Action Checklist (${completedTasksCount}/${totalTasksCount})`,
      icon: CheckSquare,
    },
    { id: 'resources', label: '5. Resources & Budget', icon: DollarSign },
    { id: 'milestones', label: '6 & 7. Tips & Milestones', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sticky Top Header Banner */}
      <PlanHeader
        plan={plan}
        onOpenExport={onOpenExport}
        onOpenRefine={onOpenRefine}
        onPrint={onPrint}
        onNewPlan={onNewPlan}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />

      {/* Tabs Navigation Bar */}
      <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <PlanOverviewTab
            plan={plan}
            onNavigateToTimeline={() => setActiveTab('timeline')}
            onNavigateToChecklist={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab plan={plan} onToggleTask={handleToggleTask} />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTab
            plan={plan}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'resources' && <ResourcesTab plan={plan} />}

        {activeTab === 'milestones' && (
          <TipsMilestonesTab plan={plan} onToggleMilestone={handleToggleMilestone} />
        )}

        {/* Step 4 Follow-up Refinement Callout Box */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Step 4 Follow-up Options</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Want to adjust duration, budget, or intensity?
            </h3>
            <p className="text-xs text-slate-400">
              Customize or scale this plan instantly with 1-click modifications or custom AI instructions.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenRefine}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span>Refine This Plan</span>
            </button>
            <button
              onClick={onOpenExport}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              Export as PDF / Markdown
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
