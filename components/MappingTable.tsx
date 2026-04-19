import React from "react";
import ConfidenceBadge from "./ConfidenceBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MappingItem {
  input_column: string;
  mapped_to: string | null;
  confidence: number;
  reasoning: string;
}

interface MappingTableProps {
  mappings: MappingItem[];
  canonicalSchema: string[];
  onChange: (updated: MappingItem[]) => void;
  onShowExplanation: (source: string) => void;
}

const MappingTable: React.FC<MappingTableProps> = ({
  mappings,
  canonicalSchema,
  onChange,
  onShowExplanation,
}) => {
  const handleSelectChange = (inputColumn: string, value: string) => {
    const updated = mappings.map((m) =>
      m.input_column === inputColumn
        ? { ...m, mapped_to: value === "null" ? null : value, confidence: 1.0, reasoning: "Manually adjusted" }
        : m
    );
    onChange(updated);
  };

  const handleIgnore = (inputColumn: string) => {
    const updated = mappings.map((m) =>
      m.input_column === inputColumn
        ? { ...m, mapped_to: null, confidence: 0, reasoning: "User ignored this column" }
        : m
    );
    onChange(updated);
  };

  const getRowBackground = (item: MappingItem) => {
    if (item.confidence < 0.5) {
      return "bg-rose-50/50 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:hover:bg-rose-900/30";
    }
    if (item.mapped_to === null) {
      return "bg-amber-50/50 hover:bg-amber-100/50 dark:bg-amber-950/20 dark:hover:bg-amber-900/30";
    }
    return "";
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[20%] text-xs font-bold uppercase tracking-wider">Input Column</TableHead>
            <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider">Mapped To</TableHead>
            <TableHead className="w-[10%] text-center text-xs font-bold uppercase tracking-wider">Conf.</TableHead>
            <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider">Reasoning</TableHead>
            <TableHead className="w-[10%] text-right text-xs font-bold uppercase tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((item) => (
            <TableRow 
              key={item.input_column} 
              className={`transition-colors h-16 ${getRowBackground(item)}`}
              onClick={() => onShowExplanation(item.input_column)}
            >
              <TableCell className="font-medium">
                <code className="px-2 py-1 rounded bg-muted text-[11px] font-mono text-zinc-600 dark:text-zinc-400 border border-white/5 shadow-sm">
                  {item.input_column}
                </code>
              </TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={item.mapped_to || "null"}
                    onValueChange={(val) => handleSelectChange(item.input_column, val)}
                  >
                    <SelectTrigger className="w-full h-8 text-xs font-medium">
                      <SelectValue placeholder="-- Unmapped --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null" className="text-zinc-500 font-medium">-- Unmapped --</SelectItem>
                      {canonicalSchema.map((field) => (
                        <SelectItem key={field} value={field} className="text-xs">
                          {field.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <ConfidenceBadge confidence={item.confidence} />
              </TableCell>
              <TableCell>
                <p className="text-[11px] text-muted-foreground italic leading-tight px-1">
                  {item.reasoning}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleIgnore(item.input_column)}
                    title="Ignore column"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MappingTable;
