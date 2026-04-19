import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RotateCcw } from "lucide-react";

interface ApproveBarProps {
  onApprove: () => void; // This will trigger the download
  onReset: () => void;
  onShowSummary: () => void;
  isProcessing?: boolean;
}

const ApproveBar: React.FC<ApproveBarProps> = ({ onApprove, onReset, onShowSummary, isProcessing }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="flex items-center justify-between p-4 shadow-xl border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 pl-2">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-tight">Review Complete</h3>
            <p className="text-xs text-muted-foreground font-normal">Ready to export finalized mapping schema.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowSummary}
            className="h-8 text-[11px] font-bold uppercase tracking-wider px-3"
          >
            View Summary
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isProcessing}
            className="px-6 h-10 text-xs font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isProcessing ? (
              "Exporting..."
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Approve & Export JSON
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ApproveBar;
