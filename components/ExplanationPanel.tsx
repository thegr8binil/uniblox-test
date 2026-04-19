import React from "react";
import { CanonicalColumn } from "@/lib/schema";

interface Mapping {
  target: CanonicalColumn | null;
  confidence: number;
  explanation: string;
}

interface ExplanationPanelProps {
  sourceColumn: string | null;
  mapping: Mapping | null;
  onClose: () => void;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ sourceColumn, mapping, onClose }) => {
  if (!sourceColumn) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-black border-l-4 border-zinc-800 shadow-[20px_0_60px_rgba(0,0,0,1)] p-0 z-[100] animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* Panel Header */}
      <div className="bg-zinc-900 border-b-2 border-zinc-800 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-yellow-400 rounded-none animate-pulse" />
          <h2 className="text-sm font-black text-white tracking-[0.4em] uppercase font-mono">AI_DIAGNOSTICS_v1.2</h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-zinc-600 hover:text-white transition-colors p-2 border border-transparent hover:border-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="p-10 font-mono space-y-12">
        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block">INPUT_PARAMETER</label>
          <div className="p-4 bg-zinc-900 border-2 border-zinc-800 text-yellow-400 font-black text-lg skew-x-[-12deg]">
            <span className="skew-x-[12deg] inline-block">{sourceColumn}</span>
          </div>
        </section>

        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block">PREDICTED_ALLOCATION</label>
          <div className="p-4 bg-emerald-500/10 border-2 border-emerald-900/30 text-emerald-400 font-black text-lg">
            {mapping?.target ? mapping.target.toUpperCase().replace(/_/g, " ") : "[ UNASSIGNED ]"}
          </div>
        </section>

        <section className="space-y-4 relative">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block">RATIONALE_DUMP</label>
          <div className="p-6 bg-zinc-900/50 border-l-4 border-zinc-700 text-zinc-400 text-xs leading-loose font-bold whitespace-pre-wrap">
            {mapping?.explanation ? `> ANALYSIS INITIATED...\n> SCANNING SEMANTIC PATTERNS...\n\n"${mapping.explanation.toUpperCase()}"\n\n> END OF DATA STREAM.` : "> NO DATA AVAILABLE."}
          </div>
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-800" />
        </section>

        <div className="pt-10 border-t border-zinc-900">
          <div className="flex flex-col gap-2 p-4 bg-black border-2 border-zinc-900 text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-yellow-600 text-lg">!</span>
              WARNING: MANUAL OVERRIDE RECOMMENDED FOR CRITICAL SYSTEMS
            </div>
            <div className="absolute inset-0 bg-yellow-400/5 scanline-active opacity-20" />
          </div>
        </div>
      </div>

      {/* Side Metadata */}
      <div className="absolute bottom-10 left-[-60px] rotate-[-90deg] text-[10px] font-black text-zinc-800 tracking-[1em] uppercase">
        MODEL: GEMINI_1.5_PRO_FLASH
      </div>
    </div>
  );
};

export default ExplanationPanel;
