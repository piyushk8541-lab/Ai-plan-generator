import React, { useState } from 'react';
import { Plan } from '../../types/plan';
import { ExportService } from '../../services/exportService';
import {
  X,
  FileText,
  Download,
  Calendar,
  FileCode,
  Copy,
  Check,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan, onPrint }) => {
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<'markdown' | 'link' | null>(null);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const md = ExportService.generateMarkdown(plan);
    navigator.clipboard.writeText(md);
    setCopiedType('markdown');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedType('link');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Download & Share Your Plan</h3>
              <p className="text-xs text-slate-400">
                Export to clean formats ready for Notion, Calendar, or printing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. PDF Export */}
          <button
            onClick={() => ExportService.downloadPDF(plan)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Download PDF</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Formatted multi-page document with styled tables
              </div>
            </div>
          </button>

          {/* 2. Markdown (.md) Export */}
          <button
            onClick={() => ExportService.downloadMarkdown(plan)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Markdown (.md)</div>
              <div className="text-xs text-slate-400 mt-0.5">
                For Notion, Obsidian, GitHub, or text editors
              </div>
            </div>
          </button>

          {/* 3. iCalendar (.ics) Export */}
          <button
            onClick={() => ExportService.downloadICalendar(plan)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Add to Calendar (.ics)</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Sync day-by-day plan with Google / Apple iCal
              </div>
            </div>
          </button>

          {/* 4. JSON Data Export */}
          <button
            onClick={() => ExportService.downloadJSON(plan)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Full JSON Backup</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Raw structured data for import & backup
              </div>
            </div>
          </button>
        </div>

        {/* Quick Actions (Copy / Print) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Quick Copy & Print</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              {copied && copiedType === 'markdown' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Markdown Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              {copied && copiedType === 'link' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Clean Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
