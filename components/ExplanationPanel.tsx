import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, HelpCircle, LayoutGrid } from "lucide-react";

interface SummaryDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    total: number;
    mapped: number;
    conflicts: number;
    unmapped: number;
  };
}

const ExplanationPanel: React.FC<SummaryDashboardProps> = ({ isOpen, onClose, metrics }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[480px]">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-xl font-semibold">Mapping Summary</SheetTitle>
        </SheetHeader>

        <div className="py-8 space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed font-normal">
            Review the current state of your column mappings. High conflict counts may require manual review before export.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
              <LayoutGrid size={18} className="text-zinc-500" />
              <div>
                <p className="text-2xl font-bold tracking-tight">{metrics.total}</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Columns</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 space-y-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">{metrics.mapped}</p>
                <p className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider">Mapped</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 space-y-2">
              <AlertTriangle size={18} className="text-rose-500" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-rose-700 dark:text-rose-400">{metrics.conflicts}</p>
                <p className="text-[10px] uppercase font-bold text-rose-600/70 tracking-wider">Conflicts</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 space-y-2">
              <HelpCircle size={18} className="text-amber-500" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-400">{metrics.unmapped}</p>
                <p className="text-[10px] uppercase font-bold text-amber-600/70 tracking-wider">Unmapped</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quick Tips</h3>
            <ul className="space-y-3 text-xs text-muted-foreground font-normal leading-relaxed">
              <li className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">•</span>
                <span>Columns mapped to <strong>null</strong> will be excluded from the final insurance ingestion.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">•</span>
                <span>Conflicts occur when multiple input headers are mapped to the same canonical field (e.g. "Salary" and "Base Pay").</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">•</span>
                <span>You can manually override any AI suggestion by clicking the dropdown in the review table.</span>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExplanationPanel;
