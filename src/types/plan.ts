export type PlanCategory =
  | 'study'
  | 'trip'
  | 'fitness'
  | 'diet'
  | 'business'
  | 'project'
  | 'budget'
  | 'event'
  | 'schedule'
  | 'custom';

export type PlanIntensity = 'relaxed' | 'balanced' | 'intensive' | 'bootcamp';

export type PlanDurationUnit = 'days' | 'weeks' | 'months';

export interface PlanDuration {
  value: number;
  unit: PlanDurationUnit;
  totalDays: number;
}

export interface QuestionField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'chips' | 'number' | 'date';
  placeholder?: string;
  options?: string[];
  helperText?: string;
  defaultValue?: string | number;
  required?: boolean;
}

export interface CategoryInfo {
  id: PlanCategory;
  name: string;
  shortDesc: string;
  icon: string;
  color: string;
  gradient: string;
  bgGlow: string;
  presetGoals: { title: string; duration: string; details: string }[];
  questions: QuestionField[];
}

export interface ActionItem {
  id: string;
  phaseId?: string;
  dayNumber?: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes?: number;
  categoryTag?: string;
}

export interface DaySchedule {
  dayNumber: number;
  dayTitle: string;
  phaseName?: string;
  focusArea: string;
  morningActivity?: string;
  afternoonActivity?: string;
  eveningActivity?: string;
  targetDeliverable?: string;
  estimatedHours?: number;
  tasks: ActionItem[];
  notes?: string;
}

export interface PhaseBreakdown {
  phaseNumber: number;
  title: string;
  durationLabel: string;
  objective: string;
  keyDeliverables: string[];
  days: DaySchedule[];
}

export interface BudgetItem {
  id: string;
  category: string;
  itemName: string;
  estimatedCost: number;
  currency: string;
  isEssential: boolean;
  notes?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'book' | 'app' | 'tool' | 'website' | 'equipment' | 'course' | 'document';
  description: string;
  url?: string;
  isFree: boolean;
}

export interface MilestoneItem {
  id: string;
  percentMark: number;
  title: string;
  targetDateOrDay: string;
  criteria: string;
  rewardIdea?: string;
  completed: boolean;
}

export interface Plan {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: PlanCategory;
  title: string;
  overview: string;
  goal: {
    primaryGoal: string;
    targetDate?: string;
    successMetrics: string[];
    whyItMatters?: string;
  };
  duration: PlanDuration;
  intensity: PlanIntensity;
  constraints: {
    budget?: string;
    dailyCommitmentHours?: number;
    skillLevel?: string;
    locationOrEquipment?: string;
    dietOrPreferences?: string;
    otherConstraints?: string;
  };
  phases: PhaseBreakdown[];
  daySchedules: DaySchedule[];
  allActionItems: ActionItem[];
  budgetItems: BudgetItem[];
  resources: ResourceItem[];
  tipsAndPrecautions: {
    proTips: string[];
    precautionsAndRisks: string[];
    mitigationStrategies: string[];
    motivationQuote?: string;
  };
  milestones: MilestoneItem[];
  customRefinements?: string[];
  notes?: string;
}

export interface LLMConfig {
  provider: 'built-in' | 'openai' | 'anthropic' | 'gemini' | 'groq';
  apiKey?: string;
  model?: string;
  customEndpoint?: string;
}

export interface PlanGenerationRequest {
  category: PlanCategory;
  goal: string;
  durationValue: number;
  durationUnit: PlanDurationUnit;
  intensity: PlanIntensity;
  startDate?: string;
  deadline?: string;
  answers: Record<string, any>;
  customNotes?: string;
}
