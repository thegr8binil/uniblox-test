"use client";

import { useState, useMemo } from "react";
import UploadZone from "@/components/UploadZone";
import MappingTable from "@/components/MappingTable";
import ExplanationPanel from "@/components/ExplanationPanel";
import ApproveBar from "@/components/ApproveBar";
import { canonicalSchema } from "@/lib/schema";
import { AlertCircle, Loader2 } from "lucide-react";

export interface MappingItem {
  input_column: string;
  mapped_to: string | null;
  confidence: number;
  reasoning: string;
}

export default function Home() {
  const [detectedColumns, setDetectedColumns] = useState<string[] | null>(null);
  const [mappings, setMappings] = useState<MappingItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Derive metrics for Summary Dashboard
  const metrics = useMemo(() => {
    if (!mappings) return { total: 0, mapped: 0, conflicts: 0, unmapped: 0 };
    
    const mappedItems = mappings.filter(m => m.mapped_to !== null);
    const unmappedItems = mappings.filter(m => m.mapped_to === null);
    
    // Detect conflicts (2+ columns mapping to same canonical field)
    const counts: Record<string, number> = {};
    mappedItems.forEach(m => {
      if (m.mapped_to) counts[m.mapped_to] = (counts[m.mapped_to] || 0) + 1;
    });
    const conflicts = Object.values(counts).filter(count => count > 1).length;

    return {
      total: mappings.length,
      mapped: mappedItems.length,
      conflicts,
      unmapped: unmappedItems.length
    };
  }, [mappings]);

  const handleColumnsDetected = async (columns: string[], sampleData: any[]) => {
    setDetectedColumns(columns);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/map-columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columns }),
      });

      if (!response.ok) throw new Error("AI service unavailable");

      const aiMappings: MappingItem[] = await response.json();
      setMappings(aiMappings);
    } catch (err: any) {
      console.error("Mapping error:", err);
      setError("AI mapping failed. You can map columns manually.");
      
      // Still render table with null mappings
      const manualMappings: MappingItem[] = columns.map(col => ({
        input_column: col,
        mapped_to: null,
        confidence: 0,
        reasoning: "Initialization failed — please map manually."
      }));
      setMappings(manualMappings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!mappings) return;
    const blob = new Blob([JSON.stringify(mappings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insurance-mapping-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setDetectedColumns(null);
    setMappings(null);
    setError(null);
    setShowSummary(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-6 py-20 pb-40">
        {/* Header */}
        <header className="mb-20 space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-secondary text-secondary-foreground">
            Insurance Operations
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              AI Mapping Copilot
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-normal leading-relaxed">
              Upload spreadsheets to map column headers to the canonical insurance schema with AI oversight.
            </p>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 flex items-center gap-3 text-rose-800 dark:text-rose-400 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in duration-700">
            <div className="relative">
              <Loader2 size={48} className="animate-spin text-primary opacity-20" />
              <Loader2 size={48} className="animate-spin text-indigo-600 absolute inset-0 [animation-delay:-0.3s]" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-lg font-medium">AI is analyzing your columns...</p>
              <p className="text-sm text-muted-foreground">Performing semantic similarity analysis on your headers.</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="relative">
          {!detectedColumns && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <UploadZone onColumnsDetected={handleColumnsDetected} />
            </div>
          )}

          {mappings && !isLoading && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Review Results</h2>
                  <p className="text-muted-foreground text-sm">Operator review of canonical insurance mappings.</p>
                </div>
              </div>

              <MappingTable
                mappings={mappings}
                canonicalSchema={[...canonicalSchema]}
                onChange={setMappings}
                onShowExplanation={() => setShowSummary(true)}
              />
            </div>
          )}
        </div>
      </div>

      <ExplanationPanel
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        metrics={metrics}
      />

      {mappings && !isLoading && (
        <ApproveBar
          onApprove={handleExport}
          onReset={resetAll}
          onShowSummary={() => setShowSummary(true)}
          isProcessing={false}
        />
      )}
    </main>
  );
}
