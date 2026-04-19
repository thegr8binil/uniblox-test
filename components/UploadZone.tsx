import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { parseFile } from "@/lib/parseSheet";

interface UploadZoneProps {
  onColumnsDetected: (columns: string[], sampleData: any[], file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onColumnsDetected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcessing = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const { columns, rows } = await parseFile(file);
      
      if (columns.length === 0) {
        throw new Error("No headers detected in the file. Please ensure the first row contains column names.");
      }

      // Pass columns, sample data, and the file up
      onColumnsDetected(columns, rows.slice(0, 3), file);
    } catch (err: any) {
      setError(err.message || "Failed to read the file. Please check the format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFileProcessing(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcessing(file);
  };

  return (
    <div className="space-y-4">
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer border-dashed border-2 py-20 transition-all duration-200 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        } ${
          isDragging
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/30"
        }`}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv,.xlsx,.xls"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center gap-4 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={40} className="animate-spin text-primary" />
              <p className="text-sm font-medium animate-pulse">Analyzing your spreadsheet...</p>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-colors ${
                isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
              }`}>
                <UploadCloud size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground font-normal">Excel or CSV files only (max. 10MB)</p>
              </div>
            </>
          )}
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={14} className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
