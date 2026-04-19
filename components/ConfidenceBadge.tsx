import React from "react";

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  const getStyles = () => {
    if (confidence >= 0.9) return "bg-zinc-900 text-emerald-500 border-emerald-900 border-l-[6px] border-l-emerald-500";
    if (confidence >= 0.7) return "bg-zinc-900 text-yellow-500 border-yellow-900 border-l-[6px] border-l-yellow-500";
    return "bg-zinc-900 text-rose-500 border-rose-900 border-l-[6px] border-l-rose-500";
  };

  const percentage = Math.round(confidence * 100);

  return (
    <div className={`inline-flex items-center px-4 py-1 font-mono text-[11px] font-black tracking-widest border transition-all hover:scale-105 ${getStyles()}`}>
      <span className="opacity-50 mr-2">I_INDEX:</span>
      {percentage}%
    </div>
  );
};

export default ConfidenceBadge;
