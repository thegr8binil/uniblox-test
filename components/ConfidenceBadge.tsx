import React from "react";
import { Badge } from "@/components/ui/badge";

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  const getColors = () => {
    // Green (≥0.8)
    if (confidence >= 0.8) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    }
    // Yellow (0.5–0.79)
    if (confidence >= 0.5) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    }
    // Red (<0.5)
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  };

  const percentage = Math.round(confidence * 100);

  return (
    <Badge variant="outline" className={`font-semibold text-[10px] tracking-tight ${getColors()}`}>
      {percentage}%
    </Badge>
  );
};

export default ConfidenceBadge;
