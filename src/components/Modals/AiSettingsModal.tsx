import React, { useState } from 'react';
import { LLMConfig } from '../../types/plan';
import { StorageService } from '../../services/storageService';
import { X, Settings, Bot, Key, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<LLMConfig>(StorageService.getLLMConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveLLMConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Generation Engine</h3>
              <p className="text-xs text-slate-400">Configure AI provider and live LLM keys</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Generation Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  id: 'built-in',
                  name: 'Built-in AI Planner',
                  desc: 'Instant, offline, zero setup required',
                  badge: 'Recommended',
                },
                {
                  id: 'openai',
                  name: 'OpenAI (GPT-4o)',
                  desc: 'Requires custom OpenAI API Key',
                },
                {
                  id: 'gemini',
                  name: 'Google Gemini',
                  desc: 'Gemini 1.5 Flash / Pro',
                },
                {
                  id: 'groq',
                  name: 'Groq (Llama 3.3)',
                  desc: 'Ultra-fast Llama 3.3 70B',
                },
              ].map((p) => {
                const isSelected = config.provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setConfig({ ...config, provider: p.id as any })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs">{p.name}</span>
                      {p.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key Input (if not built-in) */}
          {config.provider !== 'built-in' && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>{config.provider.toUpperCase()} API Key</span>
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-slate-500" />
                <span>Your API key is stored only in your browser local storage.</span>
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
