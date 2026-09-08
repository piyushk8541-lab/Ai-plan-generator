import {
  Plan,
  PlanCategory,
  PlanGenerationRequest,
  PhaseBreakdown,
  DaySchedule,
  ActionItem,
  BudgetItem,
  ResourceItem,
  MilestoneItem,
} from '../types/plan';

export class PlanGeneratorService {
  /**
   * Generates a fully structured, personalized plan based on user request parameters.
   */
  public static generatePlan(request: PlanGenerationRequest): Plan {
    const { category, goal, durationValue, durationUnit, intensity, answers, customNotes } = request;

    // Calculate total days
    let totalDays = durationValue;
    if (durationUnit === 'weeks') totalDays = durationValue * 7;
    if (durationUnit === 'months') totalDays = durationValue * 30;

    const id = 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    const title = this.generateTitle(category, goal, durationValue, durationUnit);
    const overview = this.generateOverview(category, goal, totalDays, intensity, answers);
    const goalObj = this.generateGoalDetails(category, goal, totalDays, answers);
    const constraints = this.extractConstraints(category, answers, customNotes);

    const phases = this.generatePhasesAndSchedules(category, goal, totalDays, intensity, answers);
    
    // Flatten day schedules
    const daySchedules: DaySchedule[] = [];
    const allActionItems: ActionItem[] = [];

    phases.forEach((phase) => {
      phase.days.forEach((day) => {
        daySchedules.push(day);
        day.tasks.forEach((t) => allActionItems.push(t));
      });
    });

    const budgetItems = this.generateBudgetItems(category, goal, totalDays, answers);
    const resources = this.generateResources(category, goal, answers);
    const tipsAndPrecautions = this.generateTipsAndPrecautions(category, goal, intensity, answers);
    const milestones = this.generateMilestones(category, goal, totalDays, phases);

    return {
      id,
      createdAt: now,
      updatedAt: now,
      category,
      title,
      overview,
      goal: goalObj,
      duration: {
        value: durationValue,
        unit: durationUnit,
        totalDays,
      },
      intensity,
      constraints,
      phases,
      daySchedules,
      allActionItems,
      budgetItems,
      resources,
      tipsAndPrecautions,
      milestones,
      notes: customNotes || '',
    };
  }

  private static generateTitle(
    category: PlanCategory,
    goal: string,
    durationValue: number,
    durationUnit: string
  ): string {
    const cleanGoal = goal.trim().replace(/^to\s+/i, '');
    const capitalizedGoal = cleanGoal.charAt(0).toUpperCase() + cleanGoal.slice(1);
    const durationStr = `${durationValue} ${durationUnit.charAt(0).toUpperCase() + durationUnit.slice(1)}`;

    switch (category) {
      case 'study':
        return `${capitalizedGoal} — ${durationStr} Mastery & Exam Blueprint`;
      case 'trip':
        return `Ultimate ${durationStr} Travel Itinerary: ${capitalizedGoal}`;
      case 'fitness':
        return `${capitalizedGoal} — ${durationStr} High-Impact Training Plan`;
      case 'diet':
        return `${durationStr} Personalized Nutrition & Meal Roadmap: ${capitalizedGoal}`;
      case 'business':
        return `${capitalizedGoal} — ${durationStr} Strategic Launch & Revenue Plan`;
      case 'project':
        return `${capitalizedGoal} — ${durationStr} Sprint & Delivery Architecture`;
      case 'budget':
        return `${durationStr} Financial Mastery Plan: ${capitalizedGoal}`;
      case 'event':
        return `${capitalizedGoal} — ${durationStr} Master Event Production Schedule`;
      case 'schedule':
        return `${durationStr} Optimized Daily & Weekly Life Schedule: ${capitalizedGoal}`;
      default:
        return `${capitalizedGoal} — ${durationStr} Step-by-Step Action Plan`;
    }
  }

  private static generateOverview(
    category: PlanCategory,
    goal: string,
    totalDays: number,
    intensity: string,
    answers: Record<string, any>
  ): string {
    const intensityDescriptions: Record<string, string> = {
      relaxed: 'paced at a steady, sustainable tempo allowing ample buffer for review and balance',
      balanced: 'designed for optimal momentum with structured consistency and built-in recovery',
      intensive: 'structured as a focused sprint prioritizing high-yield milestones and deep immersion',
      bootcamp: 'an accelerated immersion system engineered for aggressive execution and maximum output',
    };

    const intensityNote = intensityDescriptions[intensity] || intensityDescriptions.balanced;

    switch (category) {
      case 'study': {
        const level = answers.currentLevel || 'Intermediate';
        const hours = answers.hoursPerDay || '3-4 hours/day';
        const method = answers.learningStyle || 'Active Recall & Practice Tests';
        return `This ${totalDays}-day academic roadmap is precision-engineered to take you from ${level} to full syllabus mastery. Tailored for a commitment of ${hours}, the curriculum employs ${method} to ensure long-term conceptual retention and peak exam confidence. Daily milestones prevent last-minute cramming while dedicated revision checkpoints reinforce high-weightage topics.`;
      }
      case 'trip': {
        const style = answers.travelStyle || 'Solo explorer';
        const pace = answers.travelPace || 'Balanced';
        const budget = answers.budgetTier || 'Moderate';
        return `An expertly curated ${totalDays}-day travel itinerary designed for a ${style} seeking a ${pace} experience. This guide combines iconic must-see highlights with handpicked local gems, optimized geographic routing to minimize transit fatigue, curated culinary stops, and a realistic ${budget} cost framework.`;
      }
      case 'fitness': {
        const days = answers.daysPerWeek || '4 days/week';
        const equip = answers.equipmentAccess || 'Gym equipment';
        const fitGoal = answers.primaryFitnessGoal || 'Hypertrophy & Strength';
        return `A ${totalDays}-day periodized fitness regimen built for ${fitGoal}. Operating across a ${days} split using ${equip}, this program implements scientific progressive overload, RPE targets, mobility warm-ups, and active recovery intervals to maximize physical adaptations while minimizing injury risk.`;
      }
      case 'diet': {
        const dietGoal = answers.dietaryGoal || 'Fat loss and health';
        const dietType = answers.dietType || 'Balanced whole foods';
        const meals = answers.mealsPerDay || '3 meals + snacks';
        return `A comprehensive ${totalDays}-day personalized nutrition strategy formulated for ${dietGoal}. Centered around a ${dietType} framework structured into ${meals}, this plan balances macronutrient targets, micronutrient density, rapid batch-prep efficiency, and flexible substitution choices to ensure effortless long-term adherence.`;
      }
      case 'business': {
        const stage = answers.currentStage || 'Concept to Launch';
        const budget = answers.startingBudget || 'Bootstrapped';
        return `A pragmatic ${totalDays}-day business execution blueprint taking your venture from ${stage} to market traction. Built within a ${budget} resource envelope, this roadmap prioritizes ruthless customer validation, agile MVP iteration, organic & paid go-to-market channels, and clear unit-economic milestones.`;
      }
      case 'project': {
        const stack = answers.techStackOrTools || 'Modern tech stack';
        const method = answers.methodology || 'Agile Sprints';
        return `A technical project execution plan spanning ${totalDays} days, powered by ${method} using ${stack}. Features modular architecture breakdowns, end-to-end milestone deliverables, dependency mapping, and rigorous automated testing checkpoints to ship on schedule.`;
      }
      case 'budget': {
        const income = answers.monthlyIncome || 'Your monthly revenue';
        const strat = answers.strategyPreference || '50/30/20 budget framework';
        return `A targeted ${totalDays}-day personal finance transformation blueprint. Grounded in a cashflow model of ${income} and utilizing the ${strat}, this system automates savings, attacks liabilities, audits leaky recurring expenses, and builds enduring financial resilience.`;
      }
      case 'event': {
        const guests = answers.guestCount || '50-100 attendees';
        const venue = answers.venueType || 'Event space';
        return `A master event production timeline covering the ${totalDays} days leading up to and executing your event for ${guests} at a ${venue}. Includes vendor contracts, guest communication flows, budget management, run-of-show cues, and emergency contingency protocols.`;
      }
      case 'schedule': {
        const wake = answers.wakeTime || '6:30 AM';
        return `A ${totalDays}-day circadian habit & productivity synchronization schedule. Anchored by a consistent ${wake} wake cycle, this system eliminates attention fragmentation, protects peak cognitive deep work blocks, and establishes restorative evening shutdown routines.`;
      }
      default: {
        return `A custom-tailored ${totalDays}-day actionable plan engineered to accomplish: "${goal}". This plan is ${intensityNote}, balancing structured foundational milestones, continuous progress feedback, and practical risk mitigation.`;
      }
    }
  }

  private static generateGoalDetails(
    category: PlanCategory,
    goal: string,
    totalDays: number,
    answers: Record<string, any>
  ): Plan['goal'] {
    const successMetrics: string[] = [];

    switch (category) {
      case 'study':
        successMetrics.push('100% completion of designated syllabus chapters & core problem sets');
        successMetrics.push('Consistent 85%+ score on full-length timed mock exams');
        successMetrics.push('Comprehensive self-made flashcard deck & summary formula sheets reviewed 3x');
        break;
      case 'trip':
        successMetrics.push('Experience 100% of top bucket-list landmarks without logistical delays');
        successMetrics.push('Stay within ±5% of the total target budget allocation');
        successMetrics.push('Zero missed connections or last-minute booking penalties');
        break;
      case 'fitness':
        successMetrics.push('Maintain 90%+ planned workout adherence across all weeks');
        successMetrics.push('Achieve progressive overload (5-10% increase in working weights or reps)');
        successMetrics.push('Measurable body composition improvement (waist circumference / muscle definition)');
        break;
      case 'diet':
        successMetrics.push('Hit daily caloric & protein goals on at least 6 out of 7 days per week');
        successMetrics.push('Complete Sunday grocery run and batch meal prep consistently');
        successMetrics.push('Eliminate unplanned late-night ultra-processed binge eating');
        break;
      case 'business':
        successMetrics.push('Acquire first cohort of 20-50 verified active users / paying customers');
        successMetrics.push('Deploy fully functioning MVP with live payment integration');
        successMetrics.push('Achieve positive customer feedback and initial repeatable acquisition channel');
        break;
      case 'project':
        successMetrics.push('100% core features developed, tested, and passing CI/CD pipeline');
        successMetrics.push('Production deployment with zero critical blocking bugs');
        successMetrics.push('Complete API documentation & user onboarding walkthrough');
        break;
      case 'budget':
        successMetrics.push('Save / invest the target sum into high-yield account / index funds');
        successMetrics.push('Reduce non-essential discretionary expenses by 25-35%');
        successMetrics.push('Establish automated bill pay & zero late payment fees');
        break;
      case 'event':
        successMetrics.push('100% RSVPs locked and vendor contracts executed on time');
        successMetrics.push('Smooth D-Day execution adhering to the minute-by-minute run of show');
        successMetrics.push('Post-event wrap-up completed within budget with glowing guest feedback');
        break;
      case 'schedule':
        successMetrics.push('Maintain consistent wake/sleep schedule within 30-minute variance');
        successMetrics.push('Complete 4 hours of uninterrupted deep work every single weekday');
        successMetrics.push('Log 30 minutes of physical movement daily with zero missed days');
        break;
      default:
        successMetrics.push(`Complete all core milestones within the ${totalDays}-day timeframe`);
        successMetrics.push('Establish sustainable daily habits that persist beyond the plan');
        successMetrics.push('Track and review progress at each 25% milestone interval');
        break;
    }

    return {
      primaryGoal: goal,
      targetDate: answers.examDate || answers.deadline || `${totalDays} days from start`,
      successMetrics,
      whyItMatters: `Achieving this milestone unlocks measurable long-term leverage, builds mental momentum, and eliminates uncertainty through structured daily execution.`,
    };
  }

  private static extractConstraints(
    category: PlanCategory,
    answers: Record<string, any>,
    customNotes?: string
  ): Plan['constraints'] {
    return {
      budget: answers.budgetTier || answers.startingBudget || answers.eventBudget || answers.budgetConstraint || 'Standard / Balanced',
      dailyCommitmentHours: answers.hoursPerDay ? parseInt(answers.hoursPerDay) || 3 : 2.5,
      skillLevel: answers.currentLevel || answers.fitnessLevel || answers.currentStage || 'Intermediate',
      locationOrEquipment: answers.equipmentAccess || answers.venueType || answers.destination || 'Standard setup',
      dietOrPreferences: answers.dietType || answers.learningStyle || answers.travelStyle || 'Standard preferences',
      otherConstraints: [
        answers.weakAreas,
        answers.injuriesOrLimitations,
        answers.allergiesOrDislikes,
        answers.keyRisks,
        customNotes,
      ]
        .filter(Boolean)
        .join('; '),
    };
  }

  /**
   * Generates Phase breakdowns and granular Day Schedules
   */
  private static generatePhasesAndSchedules(
    category: PlanCategory,
    goal: string,
    totalDays: number,
    intensity: string,
    answers: Record<string, any>
  ): PhaseBreakdown[] {
    const phaseCount = totalDays <= 5 ? 2 : totalDays <= 14 ? 3 : totalDays <= 35 ? 4 : 5;
    const daysPerPhase = Math.max(1, Math.floor(totalDays / phaseCount));

    const phaseTemplates = this.getPhaseTitlesAndObjectives(category, goal, phaseCount);
    const phases: PhaseBreakdown[] = [];

    let currentDayNumber = 1;

    for (let p = 0; p < phaseCount; p++) {
      const isLastPhase = p === phaseCount - 1;
      const phaseDayCount = isLastPhase ? totalDays - currentDayNumber + 1 : daysPerPhase;
      const startDay = currentDayNumber;
      const endDay = currentDayNumber + phaseDayCount - 1;

      const phaseMeta = phaseTemplates[p] || {
        title: `Phase ${p + 1}: Strategic Progression`,
        objective: 'Drive core milestones and refine outputs through targeted action.',
        deliverables: ['Milestone validation report', 'Execution log update'],
      };

      const days: DaySchedule[] = [];

      for (let d = startDay; d <= endDay; d++) {
        const daySchedule = this.generateSpecificDay(
          category,
          goal,
          d,
          totalDays,
          phaseMeta.title,
          intensity,
          answers
        );
        days.push(daySchedule);
      }

      currentDayNumber = endDay + 1;

      phases.push({
        phaseNumber: p + 1,
        title: phaseMeta.title,
        durationLabel: `Days ${startDay} – ${endDay} (${phaseDayCount} days)`,
        objective: phaseMeta.objective,
        keyDeliverables: phaseMeta.deliverables,
        days,
      });
    }

    return phases;
  }

  private static getPhaseTitlesAndObjectives(
    category: PlanCategory,
    goal: string,
    count: number
  ): { title: string; objective: string; deliverables: string[] }[] {
    switch (category) {
      case 'study':
        return [
          {
            title: 'Foundation & Core Concept Mapping',
            objective: 'Build comprehensive conceptual clarity, organize high-yield study materials, and establish initial recall notes.',
            deliverables: ['Formula/Concept cheat sheets created', 'Diagnostic baseline assessment completed', 'Core textbook chapters read'],
          },
          {
            title: 'Deep-Dive Practice & Problem Solving',
            objective: 'Transition from passive learning to active problem solving, targeting high-weightage topics and past paper questions.',
            deliverables: ['250+ solved practice problems', 'Error log journal populated', 'Topic-wise timed quizzes completed'],
          },
          {
            title: 'Full-Length Mocks & Weak Area Triage',
            objective: 'Simulate exact exam conditions under time pressure and rigorously remediate flagged weak spots.',
            deliverables: ['3 full-length timed mock tests completed', 'Deep analysis of every incorrect question', 'Weakness mastery sprint'],
          },
          {
            title: 'Final Polish, Speed Drills & High-Yield Revision',
            objective: 'Rapid spaced repetition of summaries, mental model consolidation, and peak cognitive state preparation.',
            deliverables: ['3 full revision cycles of key notes', 'Exam kit and logistics finalized', 'Confidence score 90%+'],
          },
          {
            title: 'Exam Day Execution & Peak Performance',
            objective: 'Execute test-taking strategy with calm focus and optimal time pacing.',
            deliverables: ['Exam successfully completed', 'Post-test performance retrospective'],
          },
        ].slice(0, count);

      case 'trip':
        return [
          {
            title: 'Arrival, Historic Core & Cultural Immersion',
            objective: 'Settle in, orient with local transit, and explore the iconic historical and architectural landmarks.',
            deliverables: ['Transit pass / eSIM activated', 'Check-in to accommodation', 'Historic quarter walking tour'],
          },
          {
            title: 'Iconic Landmarks & Signature Culinary Quests',
            objective: 'Experience marquee attractions, world-class museums, panoramic vistas, and renowned street food markets.',
            deliverables: ['Key museum & monument tickets redeemed', 'Signature dinner reservation enjoyed', 'Sunset viewpoint visit'],
          },
          {
            title: 'Day Excursion & Nature / Hidden Gem Discovery',
            objective: 'Venture beyond the central city into scenic natural landscapes, quaint neighboring towns, or cultural workshops.',
            deliverables: ['Scenic day trip executed', 'Local artisan shopping', 'Off-the-beaten-path photography'],
          },
          {
            title: 'Neighborhood Vibes, Leisure & Souvenir Hunting',
            objective: 'Relaxed cafe hopping, vibrant boutique shopping, final culinary highlights, and stress-free departure prep.',
            deliverables: ['Souvenirs & gifts secured', 'Farewell celebration dinner', 'Packing & airport transfer organized'],
          },
        ].slice(0, count);

      case 'fitness':
        return [
          {
            title: 'Neuromuscular Priming & Form Baseline',
            objective: 'Establish pristine movement patterns, calibrate working weights (RPE 6-7), and prime joint mobility.',
            deliverables: ['Baseline strength metrics logged', 'Warmup mobility routine internalized', 'Nutrition & hydration sync'],
          },
          {
            title: 'Progressive Overload & Volume Accumulation',
            objective: 'Systematically increase training volume, add 2.5-5% load or extra reps, and enforce strict rest intervals.',
            deliverables: ['Progression logged on compound lifts', 'Zone 2 cardio sessions logged', 'Zero skipped workouts'],
          },
          {
            title: 'Intensity Escalation & Hypertrophy Focus',
            objective: 'Train close to technical failure (RPE 8-9) with drop sets, tempo variations, and targeted conditioning.',
            deliverables: ['Peak weight PRs achieved', 'Midway physique progress photo taken', 'Recovery & sleep optimization'],
          },
          {
            title: 'Deload, Peak Testing & Long-Term Sustainment',
            objective: 'Test new 1RM/rep maxes or endurance benchmarks, deload fatigue, and map the subsequent training block.',
            deliverables: ['Post-program fitness benchmark recorded', 'Deload recovery completed', 'Next meso-cycle programmed'],
          },
        ].slice(0, count);

      case 'diet':
        return [
          {
            title: 'Pantry Cleanse, Baseline Tracking & Meal Prep Setup',
            objective: 'Remove ultra-processed triggers, stock kitchen with nutrient-dense staples, and dial in macro ratios.',
            deliverables: ['Pantry audit completed', 'Grocery haul stocked', 'First 3-day batch meal prep completed'],
          },
          {
            title: 'Metabolic Consistency & Energy Optimization',
            objective: 'Lock in meal timing, eliminate midday brain fog, and sustain a seamless daily hydration & protein routine.',
            deliverables: ['7 consecutive days hitting protein goal', 'Zero unplanned late-night snacking', 'Digestive energy tracking'],
          },
          {
            title: 'Dietary Variety, Dining Out Mastery & Social Proofing',
            objective: 'Practice navigating social dinners, restaurant menus, and travel while effortlessly maintaining macro targets.',
            deliverables: ['Healthy restaurant meal logged accurately', 'New recipe repertoire expanded', 'Weight & measurement trend check'],
          },
          {
            title: 'Sustainable Habit Automation & Lifestyle Integration',
            objective: 'Solidify intuitive portion control and maintain metabolic rate without needing obsessive daily calorie tracking.',
            deliverables: ['Sustainable weekly meal prep rhythm locked in', 'Progress photos & biofeedback review', 'Maintenance plan active'],
          },
        ].slice(0, count);

      case 'business':
        return [
          {
            title: 'Customer Discovery & Value Proposition Validation',
            objective: 'Conduct customer problem interviews, analyze competitors, and validate willingness-to-pay before building.',
            deliverables: ['15 customer discovery interviews completed', 'Competitor matrix & USP doc drafted', 'Landing page waitlist live'],
          },
          {
            title: 'Rapid MVP Prototyping & Core Offer Creation',
            objective: 'Build the simplest viable solution that solves the single biggest customer pain point with payment flow.',
            deliverables: ['Functional MVP deployed', 'Payment gateway connected & tested', 'Product demo video recorded'],
          },
          {
            title: 'Go-To-Market & First Paying Cohort Acquisition',
            objective: 'Launch outbound outreach, content distribution, community seeding, and convert waitlist to paying users.',
            deliverables: ['First 10-25 paying clients onboarded', 'Distribution pipeline active across 2 channels', 'Customer feedback loop established'],
          },
          {
            title: 'Feedback Iteration, Retention & Scalable Growth',
            objective: 'Fix product friction points, improve onboarding conversion, and build repeatable acquisition engine.',
            deliverables: ['Net Promoter Score / testimonial collection', 'Unit economics & CAC/LTV calculated', 'Next quarter scaling roadmap'],
          },
        ].slice(0, count);

      case 'project':
        return [
          {
            title: 'Architecture, Schema & Environment Bootstrap',
            objective: 'Define tech stack, set up repository, configure CI/CD pipeline, and build core database schemas.',
            deliverables: ['GitHub repo initialized with linting & CI', 'Database schema & migrations deployed', 'Wireframes / API contract finalized'],
          },
          {
            title: 'Core Feature Sprint & API Integration',
            objective: 'Implement primary business logic, authentication, core CRUD workflows, and responsive UI components.',
            deliverables: ['Authentication & user management ready', 'Core feature module completed & unit tested', 'Frontend state management hooked up'],
          },
          {
            title: 'Edge Cases, Integrations & Performance Optimization',
            objective: 'Build payment/third-party integrations, handle error states, optimize queries, and run end-to-end tests.',
            deliverables: ['Payment / external APIs integrated', 'Lighthouse performance score > 90', 'E2E Cypress / Playwright test suite green'],
          },
          {
            title: 'Security Audit, Production Deployment & Launch',
            objective: 'Conduct security vulnerability scan, configure domain/SSL, seed demo data, and deploy to production.',
            deliverables: ['Production deployment verified live', 'Error tracking (Sentry) connected', 'Comprehensive README / docs published'],
          },
        ].slice(0, count);

      case 'budget':
        return [
          {
            title: 'Financial Health Audit & Leaks Elimination',
            objective: 'Categorize the past 90 days of transactions, cancel zombie subscriptions, and establish a zero-based budget.',
            deliverables: ['Complete expense audit spreadsheet', '3+ unwanted recurring subscriptions cancelled', 'Emergency fund account opened'],
          },
          {
            title: 'Pay-Yourself-First Automation & Debt Acceleration',
            objective: 'Automate salary day transfers into high-yield savings and execute aggressive payments on high-interest balances.',
            deliverables: ['Automatic savings deposit configured', 'First major debt chunk eliminated', 'Weekly grocery budget strictly met'],
          },
          {
            title: 'Discretionary Optimization & Side Income Boosting',
            objective: 'Negotiate recurring bills (insurance, internet), optimize dining/groceries, and explore extra cashflow avenues.',
            deliverables: ['Monthly fixed utility bills reduced by $50-100', 'Discretionary spending capped under 25%', 'Side hustle / cashflow ideated'],
          },
          {
            title: 'Long-Term Investing & Net-Worth Growth Roadmap',
            objective: 'Set up low-cost index fund dollar-cost averaging, review asset allocation, and establish 12-month wealth goals.',
            deliverables: ['Automated index fund / ETF SIP active', 'Emergency fund milestone reached', '1-year net worth projection model created'],
          },
        ].slice(0, count);

      case 'event':
        return [
          {
            title: 'Vision, Budgeting, Date Lock & Venue Contract',
            objective: 'Finalize concept, guest estimate, lock in event date, and secure primary venue with down payment.',
            deliverables: ['Event budget spreadsheet approved', 'Venue deposit paid & contract signed', 'Master planning calendar created'],
          },
          {
            title: 'Vendor Booking & Catering / Program Selection',
            objective: 'Hire caterer, photographer, audio-visual team, and finalize thematic decor and invitation design.',
            deliverables: ['Catering menu tasting & lock-in', 'Invitations / RSVP portal launched', 'Keynote / entertainment booked'],
          },
          {
            title: 'RSVP Tally, Floor Plan & Minute-by-Minute Run of Show',
            objective: 'Collect RSVPs, finalize seating arrangements, draft MC/host scripts, and coordinate vendor deliveries.',
            deliverables: ['Final guest list confirmed', 'Master timeline / run of show sheet printed', 'AV tech rehearsal scheduled'],
          },
          {
            title: 'D-Day Execution, Real-Time Management & Wrap-up',
            objective: 'Coordinate day-of setup, ensure flawless hospitality, manage transitions, and wrap vendor settlements.',
            deliverables: ['Event successfully delivered without hitches', 'Vendor invoices settled', 'Thank-you notes / photo album dispatched'],
          },
        ].slice(0, count);

      case 'schedule':
        return [
          {
            title: 'Circadian Reset & Friction Elimination',
            objective: 'Lock down fixed sleep/wake anchors, remove bedroom electronics, and establish seamless morning kickoff cues.',
            deliverables: ['Consistent wake time for 7 days', 'Nightstand digital detox established', 'Morning routine checklist in view'],
          },
          {
            title: 'Deep Work Time-Blocking & Distraction Defense',
            objective: 'Establish a sacred 3-4 hour morning deep work fortress, batching emails and meetings into specific afternoon slots.',
            deliverables: ['Calendar time-blocks color-coded & enforced', 'Notification batching active on phone', '15+ deep work hours logged'],
          },
          {
            title: 'Midday Energy Recharge & Habit Stacking',
            objective: 'Integrate physical movement, sunlight walks, healthy nutrition, and 15-minute mental breaks between focus blocks.',
            deliverables: ['Daily steps target (8k+) achieved', 'Hydration tracker logged daily', 'Zero 3 PM caffeine crashes'],
          },
          {
            title: 'Shutdown Ritual & Lifestyle Maintenance',
            objective: 'Master the 6:00 PM work shutdown ritual to completely unplug and enjoy fulfilling guilt-free evenings and weekends.',
            deliverables: ['Evening shutdown checklist completed daily', 'Weekly retrospective habit review conducted', 'High energy score 8+/10'],
          },
        ].slice(0, count);

      default:
        return [
          {
            title: 'Discovery, Setup & Foundation',
            objective: 'Establish core prerequisites, audit current status, and assemble all essential resources.',
            deliverables: ['Resource checklist verified', 'Starting baseline recorded', 'Phase 1 milestones achieved'],
          },
          {
            title: 'Core Implementation & Momentum',
            objective: 'Execute high-leverage action items consistently and track daily iterative progress.',
            deliverables: ['Core tasks completed', 'Weekly review logged', 'Midway target reached'],
          },
          {
            title: 'Refinement, Review & Scaling',
            objective: 'Identify bottlenecks, optimize output quality, and push towards peak benchmark targets.',
            deliverables: ['Performance improvements applied', 'Advanced objectives completed'],
          },
          {
            title: 'Final Mastery, Integration & Review',
            objective: 'Consolidate accomplishments, conduct final retrospective, and maintain new standards.',
            deliverables: ['Final deliverables published/tested', 'Next-stage goals outlined'],
          },
        ].slice(0, count);
    }
  }

  private static generateSpecificDay(
    category: PlanCategory,
    goal: string,
    dayNum: number,
    totalDays: number,
    phaseName: string,
    intensity: string,
    answers: Record<string, any>
  ): DaySchedule {
    const isRestDay = (dayNum % 7 === 0) && (category === 'fitness' || category === 'study');

    let dayTitle = `Day ${dayNum}: ${this.getDayTopic(category, dayNum, totalDays, isRestDay)}`;
    let focusArea = this.getDayFocus(category, dayNum, totalDays, isRestDay);
    let morning = '';
    let afternoon = '';
    let evening = '';
    let deliverable = '';
    let estimatedHours = 3;

    if (intensity === 'intensive') estimatedHours = 5;
    if (intensity === 'bootcamp') estimatedHours = 8;
    if (intensity === 'relaxed') estimatedHours = 2;

    const tasks: ActionItem[] = [];

    switch (category) {
      case 'study':
        if (isRestDay) {
          focusArea = 'Active Recovery, Flashcard Consolidation & Light Reading';
          morning = 'Morning walk & 30-min casual flashcard review (Anki)';
          afternoon = 'Review week’s error log & organize next week’s study desk';
          evening = 'Full leisure, movies/hobbies, early sleep for mental recovery';
          deliverable = 'Consolidated flashcard deck & refreshed mental state';
          estimatedHours = 1.5;
          tasks.push({
            id: `task_${dayNum}_1`,
            dayNumber: dayNum,
            title: 'Review weekly Anki flashcard deck (30 mins)',
            completed: false,
            priority: 'medium',
            categoryTag: 'Revision',
          });
          tasks.push({
            id: `task_${dayNum}_2`,
            dayNumber: dayNum,
            title: 'Audit & organize weekly error log notes',
            completed: false,
            priority: 'low',
            categoryTag: 'Organization',
          });
        } else {
          morning = '2x 50-min Pomodoro: Core theory deep dive & concept mapping';
          afternoon = '2x 50-min Pomodoro: Active practice problem sets & derivations';
          evening = '1x 45-min Pomodoro: Flashcard recall & updating the error log';
          deliverable = `Completed 25+ practice problems on Topic #${Math.ceil(dayNum / 2)}`;
          tasks.push({
            id: `task_${dayNum}_1`,
            dayNumber: dayNum,
            title: `Deep-study Core Module #${dayNum}: Read textbook/notes and annotate key theorems`,
            completed: false,
            priority: 'high',
            estimatedMinutes: 60,
            categoryTag: 'Concept',
          });
          tasks.push({
            id: `task_${dayNum}_2`,
            dayNumber: dayNum,
            title: 'Solve 20 high-yield practice questions under timed conditions',
            completed: false,
            priority: 'high',
            estimatedMinutes: 60,
            categoryTag: 'Practice',
          });
          tasks.push({
            id: `task_${dayNum}_3`,
            dayNumber: dayNum,
            title: 'Log all incorrect answers into the Error Journal with root-cause explanations',
            completed: false,
            priority: 'medium',
            estimatedMinutes: 30,
            categoryTag: 'Review',
          });
        }
        break;

      case 'trip':
        morning = '8:30 AM: Breakfast at local bakery -> Visit morning landmark before tour buses arrive';
        afternoon = '1:00 PM: Authentic lunch -> Explore cultural museum / historic district on foot';
        evening = '6:30 PM: Sunset viewpoint -> Dine at renowned local restaurant -> Night market stroll';
        deliverable = `Explored District #${dayNum} landmarks + tried 2 regional dishes`;
        estimatedHours = 8;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: `Visit prime attraction (Morning slot: 9:00 AM - 11:30 AM)`,
          completed: false,
          priority: 'high',
          estimatedMinutes: 150,
          categoryTag: 'Sightseeing',
        });
          tasks.push({
            id: `task_${dayNum}_2`,
            dayNumber: dayNum,
            title: 'Taste signature regional lunch at recommended neighborhood eatery',
            completed: false,
            priority: 'medium',
            estimatedMinutes: 60,
            categoryTag: 'Culinary',
          });
          tasks.push({
            id: `task_${dayNum}_3`,
            dayNumber: dayNum,
            title: 'Sunset viewpoint walk & evening cultural experience / market exploration',
            completed: false,
            priority: 'medium',
            estimatedMinutes: 120,
            categoryTag: 'Experience',
          });
        break;

      case 'fitness':
        if (isRestDay) {
          focusArea = 'Active Recovery, Foam Rolling & 8,000 Step Nature Walk';
          morning = '15 mins dynamic stretching & hydration with electrolytes';
          afternoon = '45-min outdoor leisurely walk in nature';
          evening = '10 mins foam rolling tight calves/hamstrings & hot shower';
          deliverable = 'Restored central nervous system & hit 8k steps';
          estimatedHours = 1;
          tasks.push({
            id: `task_${dayNum}_1`,
            dayNumber: dayNum,
            title: 'Complete 8,000 steps light walking for blood flow',
            completed: false,
            priority: 'medium',
            categoryTag: 'Mobility',
          });
        } else {
          morning = '10m Joint Mobility Warm-up -> 45m Main Resistance Training (Compound Lifts)';
          afternoon = 'High-protein recovery meal + 20m post-lunch brisk digestion walk';
          evening = '15m Zone 2 cardio (Incline walk / stationary bike) + static stretching';
          deliverable = 'Completed workout session with all sets logged in tracking app';
          estimatedHours = 1.25;
          tasks.push({
            id: `task_${dayNum}_1`,
            dayNumber: dayNum,
            title: `Execute Training Session #${dayNum} (Warmup + 4 Main Compound Movements)`,
            completed: false,
            priority: 'high',
            estimatedMinutes: 50,
            categoryTag: 'Lifting',
          });
          tasks.push({
            id: `task_${dayNum}_2`,
            dayNumber: dayNum,
            title: 'Log working weights, reps, and RPE for every set in fitness log',
            completed: false,
            priority: 'high',
            estimatedMinutes: 10,
            categoryTag: 'Tracking',
          });
          tasks.push({
            id: `task_${dayNum}_3`,
            dayNumber: dayNum,
            title: 'Drink 3.5L water and consume target daily protein',
            completed: false,
            priority: 'medium',
            estimatedMinutes: 15,
            categoryTag: 'Nutrition',
          });
        }
        break;

      case 'diet':
        morning = '8:00 AM: Hydrate with 500ml water + High-protein breakfast (35g+ protein)';
        afternoon = '1:00 PM: Balanced nutrient-dense lunch (Lean protein, complex carbs, greens)';
        evening = '4:30 PM: Healthy snack (Greek yogurt/nuts) -> 7:30 PM: Light wholesome dinner';
        deliverable = 'Hit exact daily calorie target within ±50 kcal and protein target';
        estimatedHours = 1;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: 'Prepare and log High-Protein Breakfast (35g protein)',
          completed: false,
          priority: 'high',
          categoryTag: 'Meals',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Consume balanced lunch + 15 min post-meal digestive walk',
          completed: false,
          priority: 'medium',
          categoryTag: 'Habit',
        });
        tasks.push({
          id: `task_${dayNum}_3`,
          dayNumber: dayNum,
          title: 'Log all food and water intake into tracker before 9:00 PM',
          completed: false,
          priority: 'medium',
          categoryTag: 'Tracking',
        });
        break;

      case 'business':
        morning = '9:00 AM - 12:00 PM: Core product development / MVP building sprint';
        afternoon = '1:30 PM - 3:30 PM: Outbound marketing, 15 cold DMs/emails, content creation';
        evening = '4:30 PM - 5:30 PM: Customer feedback review, metric tracking & next day priorities';
        deliverable = `Shipped feature / milestone + reached out to 15 prospective leads`;
        estimatedHours = 6;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: `Build and deploy feature/asset milestone #${dayNum}`,
          completed: false,
          priority: 'high',
          estimatedMinutes: 180,
          categoryTag: 'Execution',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Conduct outreach to 15 targeted potential users / partners',
          completed: false,
          priority: 'high',
          estimatedMinutes: 60,
          categoryTag: 'Marketing',
        });
        tasks.push({
          id: `task_${dayNum}_3`,
          dayNumber: dayNum,
          title: 'Review day conversion analytics & log key learnings',
          completed: false,
          priority: 'medium',
          estimatedMinutes: 30,
          categoryTag: 'Analytics',
        });
        break;

      case 'project':
        morning = '9:30 AM: Standup / Task prioritization -> Deep coding/design block';
        afternoon = '2:00 PM: API integration, component styling & unit testing';
        evening = '5:00 PM: Git commit, PR review, documentation & QA verification';
        deliverable = `Pull Request merged for Sprint Milestone #${dayNum}`;
        estimatedHours = 5;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: `Implement Module Specification #${dayNum}`,
          completed: false,
          priority: 'high',
          estimatedMinutes: 180,
          categoryTag: 'Dev',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Write automated unit tests & verify edge case coverage',
          completed: false,
          priority: 'high',
          estimatedMinutes: 45,
          categoryTag: 'Testing',
        });
        tasks.push({
          id: `task_${dayNum}_3`,
          dayNumber: dayNum,
          title: 'Commit changes to Git with descriptive commit message and push branch',
          completed: false,
          priority: 'medium',
          estimatedMinutes: 15,
          categoryTag: 'GitOps',
        });
        break;

      case 'budget':
        morning = 'Check daily account balances & log any pending transactions';
        afternoon = 'Implement 1 money-saving micro-action (e.g. meal prep / rate negotiation)';
        evening = 'Review weekly budget ceiling vs actual spend in tracking sheet';
        deliverable = 'Zero unaccounted expenses + 1 savings action executed';
        estimatedHours = 0.5;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: 'Reconcile daily spending in personal budget tracker',
          completed: false,
          priority: 'medium',
          categoryTag: 'Tracking',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Execute daily micro-savings action (No impulse purchase rule)',
          completed: false,
          priority: 'high',
          categoryTag: 'Savings',
        });
        break;

      case 'event':
        morning = 'Vendor checkpoint calls & email correspondence on deliverables';
        afternoon = 'Logistics coordination, guest list RSVP update, and decor ordering';
        evening = 'Master spreadsheet update & briefing key team members';
        deliverable = 'Status clearance on 2 critical vendor workstreams';
        estimatedHours = 2.5;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: `Vendor follow-up: Confirm delivery timelines for milestone #${dayNum}`,
          completed: false,
          priority: 'high',
          categoryTag: 'Logistics',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Update master guest attendance sheet & dietary preferences',
          completed: false,
          priority: 'medium',
          categoryTag: 'Guests',
        });
        break;

      case 'schedule':
        morning = '6:30 AM: Wake up -> 500ml water -> 20m workout -> 8:00 AM: Deep Work Block 1';
        afternoon = '12:30 PM: Wholesome lunch + walk -> 2:00 PM: Deep Work Block 2 / Meetings';
        evening = '6:00 PM: Work shutdown ritual -> 8:00 PM: Digital detox & reading -> 10:30 PM: Bed';
        deliverable = '4 hours of logged Deep Work + zero unbuffered schedule leaks';
        estimatedHours = 8;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: 'Execute morning ritual: Hydration, 20m movement, zero phone first 45 mins',
          completed: false,
          priority: 'high',
          categoryTag: 'Morning',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Complete 2x 90-minute Deep Work focus blocks with phone in Do Not Disturb',
          completed: false,
          priority: 'high',
          categoryTag: 'DeepWork',
        });
        tasks.push({
          id: `task_${dayNum}_3`,
          dayNumber: dayNum,
          title: 'Execute 6:00 PM shutdown ritual: Close tabs, write top 3 priorities for tomorrow',
          completed: false,
          priority: 'medium',
          categoryTag: 'Shutdown',
        });
        break;

      default:
        morning = 'Morning focus block: High-priority core action item execution';
        afternoon = 'Afternoon work session: Secondary tasks, coordination, and practical output';
        evening = 'Evening review: Check progress against daily milestone and organize tomorrow';
        deliverable = `Completed Day ${dayNum} key deliverables`;
        estimatedHours = 3;
        tasks.push({
          id: `task_${dayNum}_1`,
          dayNumber: dayNum,
          title: `Execute core goal task for Day ${dayNum}`,
          completed: false,
          priority: 'high',
          categoryTag: 'Execution',
        });
        tasks.push({
          id: `task_${dayNum}_2`,
          dayNumber: dayNum,
          title: 'Review output against quality criteria and log progress notes',
          completed: false,
          priority: 'medium',
          categoryTag: 'Review',
        });
        break;
    }

    return {
      dayNumber: dayNum,
      dayTitle,
      phaseName,
      focusArea,
      morningActivity: morning,
      afternoonActivity: afternoon,
      eveningActivity: evening,
      targetDeliverable: deliverable,
      estimatedHours,
      tasks,
    };
  }

  private static getDayTopic(
    category: PlanCategory,
    dayNum: number,
    totalDays: number,
    isRestDay: boolean
  ): string {
    if (isRestDay) return 'Rest & Mental Consolidation';

    switch (category) {
      case 'study':
        return `Core Module ${dayNum} & Problem Sets`;
      case 'trip':
        return `Historic Sights, Culinary Gems & Exploration`;
      case 'fitness':
        return `Target Split: Hypertrophy & Power Execution`;
      case 'diet':
        return `Nutrient-Dense Meal Rhythm & Protein Target`;
      case 'business':
        return `Product Build & Market Outreach Sprint`;
      case 'project':
        return `Feature Implementation & Code Quality Review`;
      case 'budget':
        return `Expense Audit & Automated Wealth Allocation`;
      case 'event':
        return `Vendor Coordination & Logistics Runway`;
      case 'schedule':
        return `Deep Work Mastery & Routine Synchronization`;
      default:
        return `Action Progression & Milestone Delivery`;
    }
  }

  private static getDayFocus(
    category: PlanCategory,
    dayNum: number,
    totalDays: number,
    isRestDay: boolean
  ): string {
    if (isRestDay) return 'Systemic recovery, sleep hygiene, and mental decompression.';
    const pct = Math.round((dayNum / totalDays) * 100);

    switch (category) {
      case 'study':
        return `Targeting high-weightage topics (${pct}% of syllabus covered) through active problem solving.`;
      case 'trip':
        return `Experiencing iconic highlights in the morning followed by authentic local culture.`;
      case 'fitness':
        return `Progressive overload on primary compound movements with strict form and high intensity.`;
      case 'diet':
        return `Consistent adherence to caloric target and satisfying protein-rich whole food meals.`;
      case 'business':
        return `Ruthless execution of product features and direct customer outreach.`;
      case 'project':
        return `Writing maintainable code, integrating backend endpoints, and testing edge cases.`;
      case 'budget':
        return `Protecting savings margins, eliminating discretionary waste, and tracking cashflow.`;
      case 'event':
        return `Securing vendor confirmations, tracking invitations, and refining timeline details.`;
      case 'schedule':
        return `Protecting uninterrupted deep work blocks and honoring the evening shutdown boundary.`;
      default:
        return `Driving step-by-step progress towards the primary goal with focused action.`;
    }
  }

  private static generateBudgetItems(
    category: PlanCategory,
    goal: string,
    totalDays: number,
    answers: Record<string, any>
  ): BudgetItem[] {
    switch (category) {
      case 'trip':
        return [
          {
            id: 'b1',
            category: 'Accommodation',
            itemName: 'Boutique Hotel / Well-reviewed Airbnb',
            estimatedCost: Math.round(totalDays * 85),
            currency: '$',
            isEssential: true,
            notes: 'Book centrally located with free cancellation',
          },
          {
            id: 'b2',
            category: 'Transportation',
            itemName: 'Local Transit Metro Pass & Intercity Trains',
            estimatedCost: Math.round(totalDays * 18),
            currency: '$',
            isEssential: true,
            notes: 'Unlimited weekly or tourist travel card',
          },
          {
            id: 'b3',
            category: 'Food & Dining',
            itemName: 'Daily Meals, Street Food & Specialty Dinners',
            estimatedCost: Math.round(totalDays * 45),
            currency: '$',
            isEssential: true,
            notes: 'Mix of authentic street stalls and 2-3 upscale dinners',
          },
          {
            id: 'b4',
            category: 'Activities & Passes',
            itemName: 'Museum Entry, Tours & Experience Tickets',
            estimatedCost: Math.round(totalDays * 25),
            currency: '$',
            isEssential: false,
            notes: 'Pre-book skip-the-line tickets online',
          },
          {
            id: 'b5',
            category: 'Contingency',
            itemName: 'Emergency Buffer & Souvenirs',
            estimatedCost: 150,
            currency: '$',
            isEssential: false,
            notes: 'Emergency medical & SIM card data top-up',
          },
        ];

      case 'study':
        return [
          {
            id: 'b1',
            category: 'Learning Materials',
            itemName: 'Standard Textbooks / Question Banks',
            estimatedCost: 65,
            currency: '$',
            isEssential: true,
            notes: 'Latest edition with solved past papers',
          },
          {
            id: 'b2',
            category: 'Online Subscriptions',
            itemName: 'Mock Test Series / Course Platform Subscription',
            estimatedCost: 40,
            currency: '$',
            isEssential: true,
            notes: 'Provides timed simulations & rank percentiles',
          },
          {
            id: 'b3',
            category: 'Tools & Productivity',
            itemName: 'Anki Pro / Forest App / Noise Cancelling Earplugs',
            estimatedCost: 20,
            currency: '$',
            isEssential: false,
            notes: 'For spaced repetition & deep focus',
          },
        ];

      case 'fitness':
        return [
          {
            id: 'b1',
            category: 'Facility / Equipment',
            itemName: 'Gym Membership or Home Resistance Bands Set',
            estimatedCost: 50,
            currency: '$',
            isEssential: true,
            notes: 'Monthly gym pass or versatile equipment',
          },
          {
            id: 'b2',
            category: 'Supplements',
            itemName: 'Whey Protein Isolate & Creatine Monohydrate',
            estimatedCost: 60,
            currency: '$',
            isEssential: false,
            notes: 'Proven efficacy for recovery & muscle growth',
          },
          {
            id: 'b3',
            category: 'App & Tracking',
            itemName: 'Hevy / Strong Workout Logger (Free tier or Pro)',
            estimatedCost: 0,
            currency: '$',
            isEssential: true,
            notes: 'Free version tracks unlimited workouts',
          },
        ];

      case 'business':
        return [
          {
            id: 'b1',
            category: 'Infrastructure',
            itemName: 'Domain Name & Vercel/Hosting Setup',
            estimatedCost: 25,
            currency: '$',
            isEssential: true,
            notes: '.com domain + free hosting tier',
          },
          {
            id: 'b2',
            category: 'Software & Tools',
            itemName: 'Email Marketing / CRM & Stripe Setup',
            estimatedCost: 35,
            currency: '$',
            isEssential: true,
            notes: 'Free tiers available on Beehiiv/Resend',
          },
          {
            id: 'b3',
            category: 'Marketing / Seed Ads',
            itemName: 'Initial Customer Acquisition / Promo Budget',
            estimatedCost: 150,
            currency: '$',
            isEssential: false,
            notes: 'Targeted test ads on Meta / Google search',
          },
        ];

      default:
        return [
          {
            id: 'b1',
            category: 'Essential Tools',
            itemName: 'Core Software / Material Supplies',
            estimatedCost: 50,
            currency: '$',
            isEssential: true,
            notes: 'Primary resources required to execute the plan',
          },
          {
            id: 'b2',
            category: 'Buffer & Contingency',
            itemName: 'Safety Reserve Fund',
            estimatedCost: 30,
            currency: '$',
            isEssential: false,
            notes: 'Buffer for unforeseen minor expenses',
          },
        ];
    }
  }

  private static generateResources(
    category: PlanCategory,
    goal: string,
    answers: Record<string, any>
  ): ResourceItem[] {
    switch (category) {
      case 'study':
        return [
          {
            id: 'r1',
            title: 'Anki (Spaced Repetition System)',
            type: 'app',
            description: 'Free open-source flashcard tool with active recall algorithm.',
            url: 'https://apps.ankiweb.net',
            isFree: true,
          },
          {
            id: 'r2',
            title: 'Pomofocus / Forest App',
            type: 'app',
            description: 'Clean Pomodoro timer with session statistics and break alerts.',
            url: 'https://pomofocus.io',
            isFree: true,
          },
          {
            id: 'r3',
            title: 'Notion / Obsidian Study Hub',
            type: 'tool',
            description: 'Digital workspace for structured summary notes and error logs.',
            url: 'https://notion.so',
            isFree: true,
          },
          {
            id: 'r4',
            title: '"Make It Stick: The Science of Successful Learning"',
            type: 'book',
            description: 'Definitive guide on active retrieval practice and retention.',
            isFree: false,
          },
        ];

      case 'trip':
        return [
          {
            id: 'r1',
            title: 'Google Maps & Offline Maps',
            type: 'app',
            description: 'Download offline city maps and pin all restaurants and attractions in advance.',
            url: 'https://maps.google.com',
            isFree: true,
          },
          {
            id: 'r2',
            title: 'Citymapper / Local Metro Transit App',
            type: 'app',
            description: 'Real-time routing, train platforms, and step-by-step navigation.',
            url: 'https://citymapper.com',
            isFree: true,
          },
          {
            id: 'r3',
            title: 'Airalo / Holafly eSIM',
            type: 'tool',
            description: 'Instant local data connection without physical SIM swapping.',
            url: 'https://airalo.com',
            isFree: false,
          },
          {
            id: 'r4',
            title: 'Splitwise / Tricount',
            type: 'app',
            description: 'Effortlessly track group or personal expenses across currencies.',
            url: 'https://splitwise.com',
            isFree: true,
          },
        ];

      case 'fitness':
        return [
          {
            id: 'r1',
            title: 'Hevy / Strong Workout Tracker',
            type: 'app',
            description: 'Clean gym logger to record weights, reps, rest timers, and volume graphs.',
            url: 'https://hevyapp.com',
            isFree: true,
          },
          {
            id: 'r2',
            title: 'MyFitnessPal / MacroFactor',
            type: 'app',
            description: 'Barcode food scanner and daily macronutrient tracking.',
            url: 'https://myfitnesspal.com',
            isFree: true,
          },
          {
            id: 'r3',
            title: 'Renaissance Periodization (Dr. Mike Israetel)',
            type: 'website',
            description: 'Evidence-based lifting technique guides and hypertrophy volumes.',
            url: 'https://youtube.com/@RenaissancePeriodization',
            isFree: true,
          },
        ];

      case 'business':
        return [
          {
            id: 'r1',
            title: 'Stripe / LemonSqueezy',
            type: 'tool',
            description: 'Global payment processing and billing infrastructure.',
            url: 'https://stripe.com',
            isFree: true,
          },
          {
            id: 'r2',
            title: 'PostHog / Google Analytics 4',
            type: 'tool',
            description: 'Product analytics, user session recording, and conversion funnels.',
            url: 'https://posthog.com',
            isFree: true,
          },
          {
            id: 'r3',
            title: '"The Mom Test" by Rob Fitzpatrick',
            type: 'book',
            description: 'How to talk to customers & learn if your business is a good idea.',
            isFree: false,
          },
        ];

      default:
        return [
          {
            id: 'r1',
            title: 'Notion Project Workspace',
            type: 'tool',
            description: 'All-in-one workspace for notes, kanban boards, and task tracking.',
            url: 'https://notion.so',
            isFree: true,
          },
          {
            id: 'r2',
            title: 'Google Calendar / Time Blocking',
            type: 'app',
            description: 'Visual time management for scheduling daily action blocks.',
            url: 'https://calendar.google.com',
            isFree: true,
          },
        ];
    }
  }

  private static generateTipsAndPrecautions(
    category: PlanCategory,
    goal: string,
    intensity: string,
    answers: Record<string, any>
  ): Plan['tipsAndPrecautions'] {
    const proTips: string[] = [
      'The 2-Minute Rule: If a task takes less than 2 minutes to complete or initiate, do it immediately to preserve momentum.',
      'Protect Your First 90 Minutes: Dedicate the initial morning block to your #1 highest-leverage task before checking emails or social feeds.',
      'Weekly Retrospective: Spend 15 minutes every Sunday assessing what worked, what stalled, and adjusting the upcoming week accordingly.',
    ];

    const precautionsAndRisks: string[] = [
      'The "All-or-Nothing" Trap: Missing one day or session is an accident; missing two is the start of a bad habit. Never miss twice in a row.',
      'Premature Burnout: Operating at 100% capacity without scheduled decompression leads to cognitive fatigue around Day 14-20.',
      'Scope Creep: Adding unplanned tasks mid-stream dilutes focus from core deliverables.',
    ];

    const mitigationStrategies: string[] = [
      'Emergency Minimums: On days with zero time or high stress, execute the 10-minute "bare minimum" version to maintain the identity streak.',
      'Environment Design: Remove high-friction obstacles the night before (e.g., set up clothes, open tabs, prep water).',
      'Accountability Mirror: Share your weekly checkpoint goal with a trusted friend, partner, or public log.',
    ];

    return {
      proTips,
      precautionsAndRisks,
      mitigationStrategies,
      motivationQuote: `"Discipline is choosing between what you want now and what you want most." — Abraham Lincoln`,
    };
  }

  private static generateMilestones(
    category: PlanCategory,
    goal: string,
    totalDays: number,
    phases: PhaseBreakdown[]
  ): MilestoneItem[] {
    const d25 = Math.max(1, Math.round(totalDays * 0.25));
    const d50 = Math.max(2, Math.round(totalDays * 0.5));
    const d75 = Math.max(3, Math.round(totalDays * 0.75));
    const d100 = totalDays;

    return [
      {
        id: 'm1',
        percentMark: 25,
        title: 'Foundation & Habit Lock-In',
        targetDateOrDay: `Day ${d25}`,
        criteria: 'Initial baseline completed, routine established without friction, zero initial drop-off.',
        rewardIdea: 'Favorite specialty coffee / guilt-free relaxation evening.',
        completed: false,
      },
      {
        id: 'm2',
        percentMark: 50,
        title: 'Halfway Breakthrough & Metric Validation',
        targetDateOrDay: `Day ${d50}`,
        criteria: '50% of core deliverables or problem sets completed with measurable quality gains.',
        rewardIdea: 'Buy a high-quality accessory / dinner at favorite restaurant.',
        completed: false,
      },
      {
        id: 'm3',
        percentMark: 75,
        title: 'High-Performance Acceleration',
        targetDateOrDay: `Day ${d75}`,
        criteria: 'Advanced topics mastered, primary risks mitigated, execution pace locked in.',
        rewardIdea: 'Full half-day weekend leisure or spa/massage session.',
        completed: false,
      },
      {
        id: 'm4',
        percentMark: 100,
        title: 'Full Goal Accomplishment & Victory Lap',
        targetDateOrDay: `Day ${d100}`,
        criteria: '100% of plan executed, final deliverables delivered/tested, target achieved.',
        rewardIdea: 'Celebrate with friends/family and post retrospective achievement.',
        completed: false,
      },
    ];
  }

  /**
   * Refines an existing plan based on a quick modifier or freeform AI prompt
   */
  public static refinePlan(plan: Plan, modificationType: string, customInstruction?: string): Plan {
    const updated = JSON.parse(JSON.stringify(plan)) as Plan;
    updated.updatedAt = new Date().toISOString();

    if (!updated.customRefinements) updated.customRefinements = [];
    const label = customInstruction ? `Custom: ${customInstruction}` : modificationType;
    updated.customRefinements.push(label);

    switch (modificationType) {
      case 'intensity_up':
        updated.intensity = 'intensive';
        updated.daySchedules.forEach((day) => {
          day.estimatedHours = Math.min(10, (day.estimatedHours || 3) + 1.5);
          day.tasks.push({
            id: `task_extra_${day.dayNumber}_${Date.now().toString().slice(-4)}`,
            dayNumber: day.dayNumber,
            title: 'Intensive Sprint: Additional 45-min deep focus / bonus challenge',
            completed: false,
            priority: 'high',
            categoryTag: 'Boost',
          });
        });
        break;

      case 'intensity_down':
        updated.intensity = 'relaxed';
        updated.daySchedules.forEach((day) => {
          day.estimatedHours = Math.max(1.5, (day.estimatedHours || 3) - 1);
        });
        break;

      case 'double_duration': {
        const oldDays = updated.duration.totalDays;
        const newDays = oldDays * 2;
        updated.duration.value = updated.duration.value * 2;
        updated.duration.totalDays = newDays;
        updated.title = updated.title.replace(/\d+\s*(days|weeks|months)/i, `${updated.duration.value} ${updated.duration.unit}`);
        break;
      }

      case 'budget_cut':
        updated.budgetItems.forEach((b) => {
          if (!b.isEssential) {
            b.estimatedCost = Math.round(b.estimatedCost * 0.4);
            b.notes = (b.notes || '') + ' (Optimized budget alternative)';
          }
        });
        break;

      case 'add_rest_days':
        updated.daySchedules.forEach((day) => {
          if (day.dayNumber % 4 === 0) {
            day.focusArea = 'Strategic Recovery, Buffer Time & Active Rest';
            day.morningActivity = 'Light review, stretching, and mental decompression';
            day.afternoonActivity = 'Buffer slot to catch up on any delayed tasks';
            day.eveningActivity = 'Guilt-free personal time and early sleep';
          }
        });
        break;

      default:
        // Freeform AI customization note
        updated.overview = `${updated.overview}\n\n*Updated Note:* Customized according to: "${customInstruction || modificationType}".`;
        break;
    }

    return updated;
  }
}
