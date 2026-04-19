import React from "react";
import { canonicalSchema, CanonicalColumn } from "@/lib/schema";
import ConfidenceBadge from "./ConfidenceBadge";

interface Mapping {
  target: CanonicalColumn | null;
  confidence: number;
  explanation: string;
}

interface MappingTableProps {
  sourceColumns: string[];
  mappings: Record<string, Mapping>;
  onMappingChange: (source: string, target: CanonicalColumn | null) => void;
  onShowExplanation: (source: string) => void;
}

const MappingTable: React.FC<MappingTableProps> = ({
  sourceColumns,
  mappings,
  onMappingChange,
  onShowExplanation,
}) => {
  return (
    <div className="clip-corners industrial-border bg-black/40 overflow-hidden">
      <table className="w-full text-left border-collapse font-mono">
        <thead className="bg-zinc-900/80 border-b-2 border-zinc-800">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Source_Registry</th>
            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Target_Allocation</th>
            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] text-right">Integrity_Index</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {sourceColumns.map((col, idx) => {
            const mapping = mappings[col];
            return (
              <tr 
                key={col} 
                className="group hover:bg-yellow-400/[0.03] transition-colors cursor-pointer"
                onClick={() => onShowExplanation(col)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <td className="px-8 py-6 relative">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-700 font-bold">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-bold text-zinc-100 group-hover:text-yellow-400 transition-colors uppercase">{col}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="relative max-w-xs">
                    <select
                      value={mapping?.target || ""}
                      onChange={(e) => {
                        e.stopPropagation();
                        onMappingChange(col, (e.target.value as CanonicalColumn) || null);
                      }}
                      className="appearance-none bg-zinc-900 text-zinc-300 text-xs rounded-none border-b-2 border-zinc-700 hover:border-zinc-500 focus:border-yellow-400 px-3 py-2 outline-none w-full transition-all tracking-wider font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">[ IGNORE_STREAM ]</option>
                      {canonicalSchema.map((schemaCol) => (
                        <option key={schemaCol} value={schemaCol}>
                          {schemaCol.toUpperCase().replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  {mapping ? (
                    <ConfidenceBadge confidence={mapping.confidence} />
                  ) : (
                    <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-600 font-black">UNLINKED</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MappingTable;
