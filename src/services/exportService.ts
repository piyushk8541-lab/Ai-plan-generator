import jsPDF from 'jspdf';
import { Plan } from '../types/plan';

export class ExportService {
  /**
   * Generates a clean, professional Markdown representation of the Plan.
   */
  public static generateMarkdown(plan: Plan): string {
    const lines: string[] = [];

    lines.push(`# ${plan.title}`);
    lines.push(`\n**Category:** ${plan.category.toUpperCase()} | **Duration:** ${plan.duration.value} ${plan.duration.unit} (${plan.duration.totalDays} Days) | **Intensity:** ${plan.intensity.toUpperCase()}`);
    lines.push(`**Generated On:** ${new Date(plan.createdAt).toLocaleDateString()} | **Target Completion:** ${plan.goal.targetDate || 'Flexible'}`);
    lines.push(`\n---\n`);

    // Section 1: Overview
    lines.push(`## 1. Executive Overview`);
    lines.push(`${plan.overview}\n`);

    // Section 2: SMART Goal
    lines.push(`## 2. SMART Goal & Success Metrics`);
    lines.push(`- **Primary Goal:** ${plan.goal.primaryGoal}`);
    if (plan.goal.whyItMatters) {
      lines.push(`- **Strategic Significance:** ${plan.goal.whyItMatters}`);
    }
    lines.push(`\n### Key Success Metrics:`);
    plan.goal.successMetrics.forEach((metric) => {
      lines.push(`- [ ] ${metric}`);
    });
    lines.push(`\n---\n`);

    // Section 3: Timeline Breakdown (Phases & Day-wise tables)
    lines.push(`## 3. Timeline & Phase Breakdown`);
    plan.phases.forEach((phase) => {
      lines.push(`\n### Phase ${phase.phaseNumber}: ${phase.title} (${phase.durationLabel})`);
      lines.push(`*Objective:* ${phase.objective}\n`);
      lines.push(`*Key Phase Deliverables:*`);
      phase.keyDeliverables.forEach((d) => lines.push(`  - ${d}`));
      lines.push(``);

      // Markdown Table for Days in this Phase
      lines.push(`| Day | Focus Topic | Morning | Afternoon | Evening | Key Deliverable |`);
      lines.push(`| :--- | :--- | :--- | :--- | :--- | :--- |`);
      phase.days.forEach((d) => {
        const morning = (d.morningActivity || '-').replace(/\|/g, '/');
        const afternoon = (d.afternoonActivity || '-').replace(/\|/g, '/');
        const evening = (d.eveningActivity || '-').replace(/\|/g, '/');
        const deliverable = (d.targetDeliverable || '-').replace(/\|/g, '/');
        lines.push(`| **Day ${d.dayNumber}** | ${d.focusArea.replace(/\|/g, '/')} | ${morning} | ${afternoon} | ${evening} | ${deliverable} |`);
      });
      lines.push(``);
    });
    lines.push(`\n---\n`);

    // Section 4: Action Items Checklist
    lines.push(`## 4. Master Action Items Checklist`);
    plan.daySchedules.forEach((day) => {
      lines.push(`\n### Day ${day.dayNumber}: ${day.dayTitle}`);
      day.tasks.forEach((task) => {
        const check = task.completed ? 'x' : ' ';
        const priorityTag = task.priority ? ` [Priority: ${task.priority.toUpperCase()}]` : '';
        const timeTag = task.estimatedMinutes ? ` (${task.estimatedMinutes}m)` : '';
        lines.push(`- [${check}] **${task.title}**${priorityTag}${timeTag}`);
      });
    });
    lines.push(`\n---\n`);

    // Section 5: Resources & Budget
    lines.push(`## 5. Resources & Budget Breakdown`);
    if (plan.budgetItems && plan.budgetItems.length > 0) {
      lines.push(`\n### Itemized Budget Breakdown:`);
      lines.push(`| Category | Item Name | Estimated Cost | Essential? | Notes |`);
      lines.push(`| :--- | :--- | :--- | :--- | :--- |`);
      let totalCost = 0;
      plan.budgetItems.forEach((b) => {
        totalCost += b.estimatedCost;
        lines.push(`| ${b.category} | ${b.itemName} | ${b.currency}${b.estimatedCost} | ${b.isEssential ? 'Yes' : 'Optional'} | ${b.notes || '-'} |`);
      });
      lines.push(`| **TOTAL ESTIMATED** | | **$${totalCost}** | | |`);
      lines.push(``);
    }

    if (plan.resources && plan.resources.length > 0) {
      lines.push(`\n### Recommended Tools & Materials:`);
      plan.resources.forEach((r) => {
        const urlStr = r.url ? ` — [Link](${r.url})` : '';
        const freeBadge = r.isFree ? ' (Free)' : ' (Paid)';
        lines.push(`- **${r.title}** [${r.type.toUpperCase()}]${freeBadge}: ${r.description}${urlStr}`);
      });
      lines.push(``);
    }
    lines.push(`\n---\n`);

    // Section 6: Tips & Precautions
    lines.push(`## 6. Expert Tips, Precautions & Risk Mitigations`);
    if (plan.tipsAndPrecautions.motivationQuote) {
      lines.push(`> *${plan.tipsAndPrecautions.motivationQuote}*\n`);
    }
    lines.push(`### Pro Tips:`);
    plan.tipsAndPrecautions.proTips.forEach((tip) => lines.push(`- ${tip}`));

    lines.push(`\n### Precautions & Common Pitfalls:`);
    plan.tipsAndPrecautions.precautionsAndRisks.forEach((risk) => lines.push(`- ⚠️ ${risk}`));

    lines.push(`\n### Mitigation Strategies:`);
    plan.tipsAndPrecautions.mitigationStrategies.forEach((mit) => lines.push(`- 🛡️ ${mit}`));
    lines.push(`\n---\n`);

    // Section 7: Milestones
    lines.push(`## 7. Progress Milestones & Checkpoints`);
    plan.milestones.forEach((m) => {
      const check = m.completed ? 'x' : ' ';
      lines.push(`- [${check}] **${m.percentMark}% Mark — ${m.title}** (${m.targetDateOrDay})`);
      lines.push(`  - Criteria: ${m.criteria}`);
      if (m.rewardIdea) lines.push(`  - Reward Milestone: 🎁 ${m.rewardIdea}`);
    });

    lines.push(`\n\n*Generated with AI Plan Generator Agent*`);
    return lines.join('\n');
  }

  /**
   * Downloads plan as a .md file
   */
  public static downloadMarkdown(plan: Plan): void {
    const md = this.generateMarkdown(plan);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.sanitizeFilename(plan.title)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Exports the plan as a styled PDF document using jsPDF
   */
  public static downloadPDF(plan: Plan): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header Banner Background
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(plan.title, contentWidth);
    doc.text(titleLines[0] || plan.title, margin, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(
      `Category: ${plan.category.toUpperCase()}  |  Duration: ${plan.duration.value} ${plan.duration.unit}  |  Intensity: ${plan.intensity.toUpperCase()}  |  Target: ${plan.goal.targetDate || 'Flexible'}`,
      margin,
      20
    );

    y = 36;

    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      checkPageBreak(14);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y - 4, contentWidth, 8, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(title, margin + 3, y + 1.5);
      y += 10;
    };

    // 1. Overview
    addSectionHeader('1. Executive Overview');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const overviewLines = doc.splitTextToSize(plan.overview, contentWidth);
    checkPageBreak(overviewLines.length * 4.5);
    doc.text(overviewLines, margin, y);
    y += overviewLines.length * 4.5 + 4;

    // 2. Goal
    addSectionHeader('2. Primary Goal & Success Metrics');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Primary Goal: ${plan.goal.primaryGoal}`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    plan.goal.successMetrics.forEach((m) => {
      checkPageBreak(5);
      doc.text(`• ${m}`, margin + 3, y);
      y += 4.5;
    });
    y += 4;

    // 3. Phases & Timeline
    addSectionHeader('3. Timeline & Phase Breakdown');
    plan.phases.forEach((phase) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 58, 138); // Blue
      doc.text(`Phase ${phase.phaseNumber}: ${phase.title} (${phase.durationLabel})`, margin, y);
      y += 4.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const objLines = doc.splitTextToSize(`Objective: ${phase.objective}`, contentWidth);
      doc.text(objLines, margin, y);
      y += objLines.length * 4 + 3;

      // Print first 5 days in compact format
      phase.days.forEach((day) => {
        checkPageBreak(14);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y - 3, contentWidth, 12, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`Day ${day.dayNumber}: ${day.focusArea.slice(0, 50)}`, margin + 2, y + 1);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const actStr = `Morn: ${day.morningActivity?.slice(0, 35) || '-'} | Aft: ${day.afternoonActivity?.slice(0, 35) || '-'} | Eve: ${day.eveningActivity?.slice(0, 35) || '-'}`;
        doc.text(actStr, margin + 2, y + 5.5);
        y += 14;
      });
      y += 2;
    });

    // 4. Master Checklist
    addSectionHeader('4. Master Action Items & Tasks');
    plan.daySchedules.slice(0, 12).forEach((day) => {
      checkPageBreak(8 + day.tasks.length * 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Day ${day.dayNumber} Tasks:`, margin, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      day.tasks.forEach((t) => {
        checkPageBreak(4.5);
        const check = t.completed ? '[X]' : '[ ]';
        const tLines = doc.splitTextToSize(`${check} ${t.title} (${t.priority.toUpperCase()})`, contentWidth - 4);
        doc.text(tLines, margin + 3, y);
        y += tLines.length * 3.8;
      });
      y += 2;
    });

    // 5. Budget & Resources
    if (plan.budgetItems && plan.budgetItems.length > 0) {
      addSectionHeader('5. Budget & Resources');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('Item / Category', margin, y);
      doc.text('Estimated Cost', margin + 90, y);
      doc.text('Essential', margin + 130, y);
      y += 4;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y - 1, margin + contentWidth, y - 1);
      y += 2;

      doc.setFont('helvetica', 'normal');
      plan.budgetItems.forEach((b) => {
        checkPageBreak(4.5);
        doc.text(`${b.itemName} (${b.category})`, margin, y);
        doc.text(`${b.currency}${b.estimatedCost}`, margin + 90, y);
        doc.text(b.isEssential ? 'Yes' : 'Optional', margin + 130, y);
        y += 4.5;
      });
      y += 4;
    }

    // 6. Tips & Precautions
    addSectionHeader('6. Pro Tips & Precautions');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    plan.tipsAndPrecautions.proTips.forEach((tip) => {
      checkPageBreak(5);
      const lines = doc.splitTextToSize(`• Tip: ${tip}`, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 3.8 + 1;
    });
    plan.tipsAndPrecautions.precautionsAndRisks.forEach((risk) => {
      checkPageBreak(5);
      const lines = doc.splitTextToSize(`• Caution: ${risk}`, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 3.8 + 1;
    });
    y += 4;

    // 7. Milestones
    addSectionHeader('7. Milestones & Progress Checkpoints');
    plan.milestones.forEach((m) => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`[${m.percentMark}%] ${m.title} (${m.targetDateOrDay})`, margin, y);
      y += 3.5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Criteria: ${m.criteria}`, margin + 4, y);
      y += 4.5;
    });

    // Footer page numbers
    const totalPdfPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPdfPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`AI Plan Generator — Page ${i} of ${totalPdfPages}`, margin, pageHeight - 6);
    }

    doc.save(`${this.sanitizeFilename(plan.title)}.pdf`);
  }

  /**
   * Generates an iCalendar (.ics) string for importing into Google/Apple/Outlook calendars.
   */
  public static downloadICalendar(plan: Plan, startFromDate: Date = new Date()): void {
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Plan Generator//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    plan.daySchedules.forEach((day, index) => {
      const eventDate = new Date(startFromDate);
      eventDate.setDate(eventDate.getDate() + index);

      const yyyy = eventDate.getFullYear();
      const mm = String(eventDate.getMonth() + 1).padStart(2, '0');
      const dd = String(eventDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}${mm}${dd}`;

      const summary = `Day ${day.dayNumber}: ${day.focusArea}`;
      const description = `Morning: ${day.morningActivity || 'Focus'}\\nAfternoon: ${day.afternoonActivity || 'Work'}\\nEvening: ${day.eveningActivity || 'Review'}\\nDeliverable: ${day.targetDeliverable || 'Milestone'}`;

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:plan-${plan.id}-day-${day.dayNumber}@aiplangenerator.app`);
      lines.push(`DTSTAMP:${dateStr}T090000Z`);
      lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
      lines.push(`SUMMARY:${summary.replace(/,/g, '\\,')}`);
      lines.push(`DESCRIPTION:${description}`);
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.sanitizeFilename(plan.title)}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Exports full JSON data for backup/import
   */
  public static downloadJSON(plan: Plan): void {
    const jsonStr = JSON.stringify(plan, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.sanitizeFilename(plan.title)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 50);
  }
}
