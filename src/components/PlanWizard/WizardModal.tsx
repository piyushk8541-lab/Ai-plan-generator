import React, { useState } from 'react';
import { PlanCategory, PlanIntensity, PlanDurationUnit, PlanGenerationRequest, Plan } from '../../types/plan';
import { Step1CategoryGoal } from './Step1CategoryGoal';
import { Step2Questions } from './Step2Questions';
import { GeneratingStep } from './GeneratingStep';
import { X, Sparkles } from 'lucide-react';
import { LLMService } from '../../services/llmService';
import { StorageService } from '../../services/storageService';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: Plan) => void;
  initialCategory?: PlanCategory;
}

export const WizardModal: React.FC<WizardModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  initialCategory = 'study',
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<PlanCategory>(initialCategory);
  const [goal, setGoal] = useState<string>('');
  const [durationValue, setDurationValue] = useState<number>(30);
  const [durationUnit, setDurationUnit] = useState<PlanDurationUnit>('days');
  const [intensity, setIntensity] = useState<PlanIntensity>('balanced');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApplyPreset = (presetTitle: string, presetDuration: string) => {
    setGoal(presetTitle);
    // Parse duration string e.g. "60 Days", "12 Weeks", "6 Months"
    const parts = presetDuration.split(' ');
    if (parts.length >= 2) {
      const num = parseInt(parts[0]) || 30;
      const unit = parts[1].toLowerCase();
      if (unit.startsWith('day')) {
        setDurationValue(num);
        setDurationUnit('days');
      } else if (unit.startsWith('week')) {
        setDurationValue(num);
        setDurationUnit('weeks');
      } else if (unit.startsWith('month')) {
        setDurationValue(num);
        setDurationUnit('months');
      }
    }
  };

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleStartGeneration = async () => {
    setCurrentStep(3);
    setIsGenerating(true);

    const request: PlanGenerationRequest = {
      category,
      goal,
      durationValue,
      durationUnit,
      intensity,
      answers,
      customNotes,
    };

    try {
      const llmConfig = StorageService.getLLMConfig();
      // Add slight delay so the animated generation steps can be visually appreciated
      const [generatedPlan] = await Promise.all([
        LLMService.generate(request, llmConfig),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      StorageService.savePlan(generatedPlan);
      StorageService.setActivePlanId(generatedPlan.id);
      onPlanCreated(generatedPlan);
      onClose();
    } catch (e) {
      console.error('Plan generation failed:', e);
    } finally {
      setIsGenerating(false);
      setCurrentStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-slide-up">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                AI Plan Generator Wizard
              </h2>
              <p className="text-[11px] text-slate-400">
                {currentStep === 1 && 'Step 1 of 2: Goal, Timeline & Category'}
                {currentStep === 2 && 'Step 2 of 2: Tailoring Questions & Constraints'}
                {currentStep === 3 && 'Generating Plan...'}
              </p>
            </div>
          </div>

          {currentStep !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <Step1CategoryGoal
              category={category}
              onSelectCategory={(c) => {
                setCategory(c);
                setAnswers({});
              }}
              goal={goal}
              onChangeGoal={setGoal}
              durationValue={durationValue}
              onChangeDurationValue={setDurationValue}
              durationUnit={durationUnit}
              onChangeDurationUnit={setDurationUnit}
              intensity={intensity}
              onChangeIntensity={setIntensity}
              onNext={() => setCurrentStep(2)}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {currentStep === 2 && (
            <Step2Questions
              category={category}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              customNotes={customNotes}
              onCustomNotesChange={setCustomNotes}
              onBack={() => setCurrentStep(1)}
              onGenerate={handleStartGeneration}
              isGenerating={isGenerating}
            />
          )}

          {currentStep === 3 && <GeneratingStep />}
        </div>
      </div>
    </div>
  );
};
