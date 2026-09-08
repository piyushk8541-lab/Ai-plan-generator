import React, { useState, useEffect } from 'react';
import { Plan, PlanCategory } from './types/plan';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { PlanDashboard } from './components/PlanView/PlanDashboard';
import { WizardModal } from './components/PlanWizard/WizardModal';
import { ExportModal } from './components/Modals/ExportModal';
import { PlanRefinerModal } from './components/Modals/PlanRefinerModal';
import { SavedPlansModal } from './components/Modals/SavedPlansModal';
import { SampleGalleryModal } from './components/Modals/SampleGalleryModal';
import { AiSettingsModal } from './components/Modals/AiSettingsModal';
import { PrintView } from './components/PrintView';
import { SAMPLE_PLANS } from './data/samplePlans';
import { Sparkles, PlusCircle, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialCategory, setWizardInitialCategory] = useState<PlanCategory>('study');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load plans on mount
  useEffect(() => {
    const loadedPlans = StorageService.getPlans();
    setPlans(loadedPlans);

    const activeId = StorageService.getActivePlanId();
    const found = loadedPlans.find((p) => p.id === activeId);
    if (found) {
      setActivePlan(found);
    } else if (loadedPlans.length > 0) {
      setActivePlan(loadedPlans[0]);
      StorageService.setActivePlanId(loadedPlans[0].id);
    }

    const savedTheme = StorageService.getTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    StorageService.setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setActivePlan(plan);
    StorageService.setActivePlanId(plan.id);
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    setActivePlan(updatedPlan);
    const updatedList = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
    setPlans(updatedList);
    StorageService.savePlans(updatedList);
  };

  const handlePlanCreated = (newPlan: Plan) => {
    const updatedList = [newPlan, ...plans.filter((p) => p.id !== newPlan.id)];
    setPlans(updatedList);
    setActivePlan(newPlan);
    StorageService.savePlans(updatedList);
    StorageService.setActivePlanId(newPlan.id);
  };

  const handleDeletePlan = (planId: string) => {
    const remaining = plans.filter((p) => p.id !== planId);
    setPlans(remaining);
    StorageService.savePlans(remaining);

    if (activePlan?.id === planId) {
      const nextActive = remaining.length > 0 ? remaining[0] : null;
      setActivePlan(nextActive);
      if (nextActive) StorageService.setActivePlanId(nextActive.id);
    }
  };

  const handleDuplicatePlan = (planToDuplicate: Plan) => {
    const copy: Plan = JSON.parse(JSON.stringify(planToDuplicate));
    copy.id = 'plan_copy_' + Date.now();
    copy.title = `${copy.title} (Copy)`;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    const updatedList = [copy, ...plans];
    setPlans(updatedList);
    setActivePlan(copy);
    StorageService.savePlans(updatedList);
    StorageService.setActivePlanId(copy.id);
  };

  const handleOpenWizardForCategory = (category: PlanCategory) => {
    setWizardInitialCategory(category);
    setIsWizardOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* App Navbar */}
      <div className="print:hidden">
        <Navbar
          onNewPlan={() => {
            setWizardInitialCategory('study');
            setIsWizardOpen(true);
          }}
          onOpenSaved={() => setIsSavedModalOpen(true)}
          onOpenSamples={() => setIsSampleModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onSelectCategoryQuick={handleOpenWizardForCategory}
          savedPlansCount={plans.length}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>

      {/* Main Interactive View */}
      <div className="flex-1 print:hidden">
        {activePlan ? (
          <PlanDashboard
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
            onOpenExport={() => setIsExportModalOpen(true)}
            onOpenRefine={() => setIsRefineModalOpen(true)}
            onPrint={handlePrint}
            onNewPlan={() => {
              setWizardInitialCategory('study');
              setIsWizardOpen(true);
            }}
          />
        ) : (
          /* Empty State (No active plan) */
          <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Create Your First AI Action Plan</h2>
              <p className="text-xs text-slate-400">
                Generate tailored study blueprints, travel itineraries, fitness schedules, business
                roadmaps, or project timelines in seconds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setWizardInitialCategory('study');
                  setIsWizardOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Launch Plan Generator</span>
              </button>
              <button
                onClick={() => setIsSampleModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Sample Plans</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clean Printable Layout for Browser Print Dialog */}
      {activePlan && <PrintView plan={activePlan} />}

      {/* Modals */}
      <WizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPlanCreated={handlePlanCreated}
        initialCategory={wizardInitialCategory}
      />

      {activePlan && (
        <>
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            plan={activePlan}
            onPrint={handlePrint}
          />

          <PlanRefinerModal
            isOpen={isRefineModalOpen}
            onClose={() => setIsRefineModalOpen(false)}
            plan={activePlan}
            onPlanRefined={handleUpdatePlan}
          />
        </>
      )}

      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        plans={plans}
        activePlanId={activePlan?.id}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
        onDuplicatePlan={handleDuplicatePlan}
        onNewPlan={() => {
          setWizardInitialCategory('study');
          setIsWizardOpen(true);
        }}
      />

      <SampleGalleryModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onLoadSample={handleSelectPlan}
      />

      <AiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default App;
