import { useState } from 'react';
import { Bot, Cpu, Zap, Coins, Sliders, Check, ShieldAlert } from 'lucide-react';
import { MODELS, ModelInfo } from '../modelsData';

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [filterFamily, setFilterFamily] = useState<'All' | 'Gemini 3' | 'Gemini 2.5' | 'Specialized'>('All');

  const filteredModels = MODELS.filter(model => {
    if (filterFamily === 'All') return true;
    return model.family === filterFamily;
  });

  const activeModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const renderMetric = (label: string, value: number, colorClass: string, icon: React.ReactNode) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium">
            {icon}
            {label}
          </span>
          <span className="font-mono text-neutral-200">{value}/5</span>
        </div>
        <div className="flex gap-1 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                i < value ? colorClass : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col space-y-6">
      {/* Selector Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="size-5 text-orange-500" />
          Model Selector
        </h3>
        <span className="text-[11px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
          Selectable
        </span>
      </div>

      {/* Dynamic Info Panel for Active Model */}
      <div className="p-4 bg-orange-950/20 border border-orange-900/30 rounded-2xl space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Bot className="size-4 text-orange-500" />
              {activeModel.name}
            </h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
              activeModel.isSupported 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {activeModel.badge}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            {activeModel.desc}
          </p>
        </div>

        {/* Meters */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-orange-900/20">
          {renderMetric(
            'Speed & Latency', 
            activeModel.speed, 
            'bg-amber-500 shadow-sm shadow-amber-500/20', 
            <Zap className="size-3.5 text-amber-400" />
          )}
          {renderMetric(
            'Reasoning Power', 
            activeModel.reasoning, 
            'bg-indigo-500 shadow-sm shadow-indigo-500/20', 
            <Cpu className="size-3.5 text-indigo-400" />
          )}
          {renderMetric(
            'Cost Efficiency', 
            activeModel.cost, 
            'bg-emerald-500 shadow-sm shadow-emerald-500/20', 
            <Coins className="size-3.5 text-emerald-400" />
          )}
        </div>

        {/* Incompatibility Helper Alert inside the info card */}
        {!activeModel.isSupported && (
          <div className="mt-3 p-3 bg-red-950/20 border border-red-900/30 rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="size-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-300 leading-relaxed">
                <strong>Incompatible model selected.</strong> This specialized model is optimized for image or real-time voice, and cannot process standard file audio transcriptions.
              </p>
            </div>
            <button
              onClick={() => onSelectModel('gemini-3.5-flash')}
              className="w-full text-center py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              Force Switch to Gemini 3.5 Flash
            </button>
          </div>
        )}
      </div>

      {/* Filtering Tabs */}
      <div className="flex bg-neutral-950 p-1 rounded-xl gap-1">
        {(['All', 'Gemini 3', 'Gemini 2.5', 'Specialized'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterFamily(tab)}
            className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all text-center shrink-0 cursor-pointer ${
              filterFamily === tab
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.replace('Gemini ', 'G')}
          </button>
        ))}
      </div>

      {/* Model Selection Grid List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {filteredModels.map(model => {
          const isSelected = model.id === selectedModel;
          return (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 group relative cursor-pointer ${
                isSelected
                  ? 'bg-orange-600/10 border-orange-500 shadow-md shadow-orange-500/5'
                  : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-xs transition-colors ${
                    isSelected ? 'text-orange-400 font-bold' : 'text-neutral-200 group-hover:text-white'
                  }`}>
                    {model.name}
                  </span>
                  
                  {!model.isSupported && (
                    <span className="text-[9px] bg-red-950 text-red-400 px-1.5 rounded font-mono border border-red-900/30 shrink-0">
                      Spec
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 truncate group-hover:text-neutral-400">
                  {model.desc}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center">
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
                    <Check className="size-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-neutral-800 group-hover:border-neutral-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
