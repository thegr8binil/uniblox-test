import React from "react";

interface ApproveBarProps {
  onApprove: () => void;
  onReset: () => void;
  isProcessing?: boolean;
}

const ApproveBar: React.FC<ApproveBarProps> = ({ onApprove, onReset, isProcessing }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-zinc-800 p-6 z-50 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      {/* Decorative Warning Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#facc15_10px,#facc15_20px)] opacity-50" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex gap-8 items-center font-mono">
          <div className="flex flex-col">
            <h3 className="text-white font-black text-sm tracking-[0.3em] uppercase">SYSTEM_READY</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-none animate-pulse" />
              <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">All_Streams_Mapped</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 border-l-2 border-zinc-900 pl-8">
            <div className="text-center">
              <span className="block text-[10px] text-zinc-700 font-black uppercase">Load</span>
              <span className="text-xs text-zinc-400 font-bold tracking-tighter">0.42ms</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-zinc-700 font-black uppercase">Queue</span>
              <span className="text-xs text-zinc-400 font-bold tracking-tighter">0/12</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onReset}
            className="px-6 py-2 text-[10px] font-black text-zinc-600 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors font-mono"
          >
            [ DISCARD_ALL ]
          </button>
          
          <button
            onClick={onApprove}
            disabled={isProcessing}
            className="group relative px-10 py-3 bg-yellow-400 disabled:opacity-30 disabled:grayscale text-black font-black text-xs uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)] font-mono clip-corners"
          >
            <span className="relative z-10">
              {isProcessing ? "COMMITTING..." : "COMMIT_IMPORT"}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </button>
        </div>
      </div>
      
      {/* Background Grid decorative */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
};

export default ApproveBar;
