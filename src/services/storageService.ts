import { LLMConfig, Plan } from '../types/plan';
import { SAMPLE_PLANS } from '../data/samplePlans';

const STORAGE_KEYS = {
  PLANS: 'ai_plans_collection_v1',
  ACTIVE_PLAN_ID: 'ai_plans_active_id_v1',
  LLM_CONFIG: 'ai_plans_llm_config_v1',
  THEME: 'ai_plans_theme_v1',
};

export class StorageService {
  public static getPlans(): Plan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load plans from storage:', e);
    }
    // Seed with initial sample plans if empty
    this.savePlans(SAMPLE_PLANS);
    return SAMPLE_PLANS;
  }

  public static savePlans(plans: Plan[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed to save plans to storage:', e);
    }
  }

  public static savePlan(plan: Plan): void {
    const plans = this.getPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }
    this.savePlans(plans);
  }

  public static deletePlan(id: string): void {
    const plans = this.getPlans().filter((p) => p.id !== id);
    this.savePlans(plans);
  }

  public static getActivePlanId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN_ID);
  }

  public static setActivePlanId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN_ID, id);
  }

  public static getLLMConfig(): LLMConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse LLM config:', e);
    }
    return {
      provider: 'built-in',
    };
  }

  public static saveLLMConfig(config: LLMConfig): void {
    localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(config));
  }

  public static getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'dark' | 'light') || 'dark';
  }

  public static setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}
