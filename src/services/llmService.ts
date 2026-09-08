import { LLMConfig, Plan, PlanGenerationRequest } from '../types/plan';
import { PlanGeneratorService } from './planGenerator';

export class LLMService {
  private static SYSTEM_PROMPT = `
You are an expert AI Plan Generator Agent. Your job is to create detailed, practical, and personalized plans for ANY category requested (study, trip, fitness, diet, business, project, budget, event, schedule, custom).

You must output a strictly valid JSON object matching this TypeScript interface without any markdown backticks or commentary:
{
  "title": string,
  "overview": string,
  "goal": {
    "primaryGoal": string,
    "targetDate": string,
    "successMetrics": string[],
    "whyItMatters": string
  },
  "phases": [
    {
      "phaseNumber": number,
      "title": string,
      "durationLabel": string,
      "objective": string,
      "keyDeliverables": string[],
      "days": [
        {
          "dayNumber": number,
          "dayTitle": string,
          "phaseName": string,
          "focusArea": string,
          "morningActivity": string,
          "afternoonActivity": string,
          "eveningActivity": string,
          "targetDeliverable": string,
          "estimatedHours": number,
          "tasks": [
            {
              "id": string,
              "dayNumber": number,
              "title": string,
              "completed": false,
              "priority": "high" | "medium" | "low",
              "estimatedMinutes": number,
              "categoryTag": string
            }
          ]
        }
      ]
    }
  ],
  "budgetItems": [
    {
      "id": string,
      "category": string,
      "itemName": string,
      "estimatedCost": number,
      "currency": string,
      "isEssential": boolean,
      "notes": string
    }
  ],
  "resources": [
    {
      "id": string,
      "title": string,
      "type": "book" | "app" | "tool" | "website" | "equipment" | "course",
      "description": string,
      "url": string,
      "isFree": boolean
    }
  ],
  "tipsAndPrecautions": {
    "proTips": string[],
    "precautionsAndRisks": string[],
    "mitigationStrategies": string[],
    "motivationQuote": string
  },
  "milestones": [
    {
      "id": string,
      "percentMark": number,
      "title": string,
      "targetDateOrDay": string,
      "criteria": string,
      "rewardIdea": string,
      "completed": false
    }
  ]
}

Ensure all action items are specific, practical, realistic, and strictly tailored to the user's constraints.
`;

  public static async generate(
    request: PlanGenerationRequest,
    config: LLMConfig
  ): Promise<Plan> {
    if (!config.apiKey || config.provider === 'built-in') {
      // Use built-in generator
      return PlanGeneratorService.generatePlan(request);
    }

    try {
      if (config.provider === 'openai') {
        return await this.callOpenAI(request, config);
      } else if (config.provider === 'gemini') {
        return await this.callGemini(request, config);
      } else if (config.provider === 'groq') {
        return await this.callGroq(request, config);
      } else if (config.provider === 'anthropic') {
        return await this.callAnthropic(request, config);
      }
    } catch (err: any) {
      console.warn('Live LLM call failed, falling back to built-in generator:', err.message);
    }

    // Graceful fallback
    return PlanGeneratorService.generatePlan(request);
  }

  private static async callOpenAI(request: PlanGenerationRequest, config: LLMConfig): Promise<Plan> {
    const userPrompt = JSON.stringify(request, null, 2);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: `Generate a complete structured plan for this request:\n${userPrompt}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawJson = data.choices[0].message.content;
    const parsed = JSON.parse(rawJson);
    return this.wrapLLMResponseToPlan(parsed, request);
  }

  private static async callGemini(request: PlanGenerationRequest, config: LLMConfig): Promise<Plan> {
    const userPrompt = `${this.SYSTEM_PROMPT}\n\nGenerate a plan for this request:\n${JSON.stringify(request, null, 2)}`;
    const model = config.model || 'gemini-1.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawJson = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(rawJson);
    return this.wrapLLMResponseToPlan(parsed, request);
  }

  private static async callGroq(request: PlanGenerationRequest, config: LLMConfig): Promise<Plan> {
    const userPrompt = JSON.stringify(request, null, 2);
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: `Generate a structured plan:\n${userPrompt}` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawJson = data.choices[0].message.content;
    const parsed = JSON.parse(rawJson);
    return this.wrapLLMResponseToPlan(parsed, request);
  }

  private static async callAnthropic(request: PlanGenerationRequest, config: LLMConfig): Promise<Plan> {
    const userPrompt = `Create a complete structured plan matching the required JSON format for:\n${JSON.stringify(request, null, 2)}`;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: this.SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.content[0].text;
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return this.wrapLLMResponseToPlan(parsed, request);
  }

  private static wrapLLMResponseToPlan(parsed: any, request: PlanGenerationRequest): Plan {
    let totalDays = request.durationValue;
    if (request.durationUnit === 'weeks') totalDays *= 7;
    if (request.durationUnit === 'months') totalDays *= 30;

    const daySchedules = [];
    const allActionItems = [];

    if (Array.isArray(parsed.phases)) {
      for (const ph of parsed.phases) {
        if (Array.isArray(ph.days)) {
          for (const d of ph.days) {
            daySchedules.push(d);
            if (Array.isArray(d.tasks)) {
              for (const t of d.tasks) {
                allActionItems.push(t);
              }
            }
          }
        }
      }
    }

    return {
      id: 'plan_llm_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: request.category,
      title: parsed.title || `${request.goal} — Action Plan`,
      overview: parsed.overview || '',
      goal: parsed.goal || {
        primaryGoal: request.goal,
        successMetrics: [],
      },
      duration: {
        value: request.durationValue,
        unit: request.durationUnit,
        totalDays,
      },
      intensity: request.intensity,
      constraints: {
        budget: request.answers.budgetTier || request.answers.startingBudget || 'Standard',
        dailyCommitmentHours: request.answers.hoursPerDay ? parseInt(request.answers.hoursPerDay) || 3 : 3,
        skillLevel: request.answers.currentLevel || 'Intermediate',
      },
      phases: parsed.phases || [],
      daySchedules,
      allActionItems,
      budgetItems: parsed.budgetItems || [],
      resources: parsed.resources || [],
      tipsAndPrecautions: parsed.tipsAndPrecautions || {
        proTips: [],
        precautionsAndRisks: [],
        mitigationStrategies: [],
      },
      milestones: parsed.milestones || [],
      notes: request.customNotes || '',
    };
  }
}
