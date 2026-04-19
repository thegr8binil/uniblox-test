"use client";

import { useState, useEffect } from "react";
import UploadZone from "@/components/UploadZone";
import MappingTable from "@/components/MappingTable";
import ExplanationPanel from "@/components/ExplanationPanel";
import ApproveBar from "@/components/ApproveBar";
import { parseFile, ParsedData } from "@/lib/parseSheet";
import { CanonicalColumn } from "@/lib/schema";

export default function Home() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [mappings, setMappings] = useState<Record<string, any>>({});
  const [isMapping, setIsMapping] = useState(false);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [isApprovable, setIsApprovable] = useState(false);
  const [bootSequence, setBootSequence] = useState(false);

  useEffect(() => {
    setBootSequence(true);
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setIsMapping(true);
      const parsed = await parseFile(file);
      setData(parsed);

      // Trigger AI Mapping
      const response = await fetch("/api/map-columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceColumns: parsed.columns,
          sampleData: parsed.rows.slice(0, 3),
        }),
      });

      if (response.ok) {
        const aiMappings = await response.json();
        setMappings(aiMappings);
        setIsApprovable(true);
      }
    } catch (error) {
      console.error("Critical System Error:", error);
      alert("CRITICAL ERROR: DATA STREAM REJECTED");
    } finally {
      setIsMapping(false);
    }
  };

  const handleMappingChange = (source: string, target: CanonicalColumn | null) => {
    setMappings((prev) => ({
      ...prev,
      [source]: {
        ...prev[source],
        target,
        confidence: 1.0,
        explanation: "MANUAL OVERRIDE DETECTED / USER DEFINED ALLOCATION.",
      },
    }));
  };

  const resetAll = () => {
    setData(null);
    setMappings({});
    setIsApprovable(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden font-mono selection:bg-yellow-400 selection:text-black">
      {/* Structural Grid lines */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-zinc-900/50 z-40 m-4 border-double" />
      
      <div className="max-w-[1600px] mx-auto px-12 py-20 relative z-10">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b-4 border-zinc-900 pb-12">
          <div className="space-y-6 max-w-3xl">
            <div className={`inline-flex items-center gap-3 px-4 py-1 bg-yellow-400 text-black text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-1000 ${bootSequence ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
              <span className="w-2 h-2 bg-black animate-pulse" />
              SYSTEM_LIVE // CO-PILOT_STATION_B
            </div>
            <h1 className="font-sans text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              AI_MAPPING<br />
              <span className="text-yellow-400">INFRASTRUCTURE</span>
            </h1>
            <p className="text-zinc-600 text-sm font-bold max-w-xl leading-relaxed uppercase tracking-widest">
              Automated high-fidelity data allocation protocol. Analyzing semantic structures of disparate registries via Gemini-1.5 kernels. 
              <span className="text-zinc-400 block mt-4">{" >> INITIATE DATA FEED TO BEGIN SCAN."}</span>
            </p>
          </div>
          
          <div className="hidden lg:block space-y-2 text-right">
            <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">Terminal_Stats</div>
            <div className="text-xs text-zinc-500 font-bold">LATENCY: 12ms</div>
            <div className="text-xs text-zinc-500 font-bold">KERNEL: v4.19.0-MAP</div>
            <div className="flex justify-end gap-1 mt-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-zinc-900 border border-zinc-800" />
              ))}
            </div>
          </div>
        </header>

        <div className="relative">
          {!data ? (
            <div className="max-w-4xl animate-in fade-in slide-in-from-left duration-700">
              <UploadZone onFileUpload={handleFileUpload} isProcessing={isMapping} />
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="col-span-12 xl:col-span-9 space-y-8">
                <div className="flex items-center justify-between border-l-8 border-yellow-400 pl-6 py-2 bg-zinc-900/40">
                  <h2 className="text-xl font-black tracking-widest uppercase">Registry_Review_Buffer</h2>
                  <div className="flex items-center gap-4 px-4 font-black">
                    <span className="text-zinc-700 text-[10px]">TOTAL_STREAMS:</span>
                    <span className="text-yellow-400 text-sm">{data.columns.length}</span>
                  </div>
                </div>

                <MappingTable
                  sourceColumns={data.columns}
                  mappings={mappings}
                  onMappingChange={handleMappingChange}
                  onShowExplanation={setSelectedCol}
                />
              </div>

              <div className="hidden xl:block xl:col-span-3 space-y-6">
                <div className="p-8 border-2 border-zinc-900 bg-zinc-900/20 clip-corners">
                  <h3 className="text-[10px] font-black text-zinc-600 mb-6 uppercase tracking-[0.3em]">Operational_Intel</h3>
                  <ul className="space-y-6 text-[10px] font-bold text-zinc-400">
                    <li className="flex gap-4">
                      <span className="text-yellow-400">{" >> "}</span>
                      USE SIDE DIAGNOSTICS FOR FIELD RATIONALE.
                    </li>
                    <li className="flex gap-4">
                      <span className="text-yellow-400">{" >> "}</span>
                      MANUAL ASSIGNMENTS OVERRIDE KERNEL PREDICTIONS.
                    </li>
                    <li className="flex gap-4 opacity-30">
                      <span className="text-zinc-700">{" >> "}</span>
                      EXPERIMENTAL: JSON_EXPORT_ENABLED.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebars and Overlay Components */}
      <ExplanationPanel
        sourceColumn={selectedCol}
        mapping={selectedCol ? mappings[selectedCol] : null}
        onClose={() => setSelectedCol(null)}
      />

      {isApprovable && (
        <ApproveBar
          onApprove={() => alert("COMMITTED: DATA PACKETS SENT TO MAIN REGISTRY")}
          onReset={resetAll}
          isProcessing={false}
        />
      )}

      {/* Persistent UI Elements */}
      <div className="fixed bottom-32 left-8 -rotate-90 origin-left text-[10px] font-black text-zinc-800 tracking-[1em] uppercase z-0">
        UNIBLOX_SECURE_KERNEL
      </div>
    </main>
  );
}
