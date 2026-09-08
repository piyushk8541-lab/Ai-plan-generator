import React, { useState } from 'react';
import { Plan, ActionItem } from '../../types/plan';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface ChecklistTabProps {
  plan: Plan;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<ActionItem, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  plan,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDay, setNewTaskDay] = useState<number>(1);
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(30);

  const totalTasks = plan.allActionItems.length;
  const completedTasks = plan.allActionItems.filter((t) => t.completed).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggle = (taskId: string) => {
    onToggleTask(taskId);
    // Check if toggling completes everything or hits 100%
    if (completedTasks + 1 === totalTasks) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dayNumber: newTaskDay,
      estimatedMinutes: newTaskMinutes,
      categoryTag: 'Custom',
    });

    setNewTaskTitle('');
    setIsAddModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = plan.allActionItems.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'pending' && !task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress & Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">4. Action Items & Execution Checklist</h2>
              <p className="text-xs text-slate-400">
                {completedTasks} of {totalTasks} tasks completed ({percentComplete}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>

        {/* Big Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Start</span>
            <span>{percentComplete}% Complete</span>
            <span>Finish</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action items..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Priority & Status Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'pending', 'completed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Priority Chips */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  priorityFilter === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">No action items found matching your filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priorityBadgeColors = {
              high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
              medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              low: 'bg-slate-800 text-slate-400 border-slate-700',
            };

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-900/40 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => handleToggle(task.id)}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-semibold leading-snug transition-all ${
                        task.completed ? 'text-emerald-300 line-through' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                      {task.dayNumber && (
                        <span className="font-mono text-indigo-400">Day {task.dayNumber}</span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes} mins
                        </span>
                      )}
                      {task.categoryTag && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                          {task.categoryTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      priorityBadgeColors[task.priority] || priorityBadgeColors.medium
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-white">Add Custom Action Item</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Read research paper on Transformer architectures"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Day #</label>
                  <input
                    type="number"
                    min={1}
                    max={plan.duration.totalDays}
                    value={newTaskDay}
                    onChange={(e) => setNewTaskDay(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Mins</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:ring-indigo-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
