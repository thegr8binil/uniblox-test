import React, { useRef, useState } from "react";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group cursor-pointer clip-corners industrial-border p-16 transition-all duration-500 bg-zinc-900/40 overflow-hidden ${
        isDragging
          ? "border-yellow-400 bg-yellow-400/5 scanline-active"
          : "border-zinc-800 hover:border-zinc-700"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv,.xlsx,.xls"
      />
      
      <div className="relative z-10 flex flex-col items-center gap-8 text-center uppercase tracking-[0.2em]">
        <div className={`transition-all duration-700 ${
          isDragging ? "scale-110 rotate-180 text-yellow-400" : "text-zinc-600 group-hover:text-zinc-400"
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M12 2v12" />
            <path d="m16 10-4 4-4-4" />
            <rect width="20" height="4" x="2" y="18" />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white decoration-yellow-400 decoration-4 underline-offset-8 group-hover:underline">
            {isDragging ? "Release to Intake" : "Feed Data Object"}
          </h3>
          <p className="text-zinc-500 font-mono text-sm">
            [ CSV / XLSX / XLS ] - MAX BANDWIDTH 10MB
          </p>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-1 w-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-yellow-400 animate-[scan_1.5s_linear_infinite]" />
              </div>
              <p className="text-yellow-400 font-mono animate-pulse font-bold tracking-[0.3em]">PROCESSING SCAN...</p>
            </div>
          </div>
        )}
      </div>

      {/* Side Label */}
      <div className="absolute top-8 left-[-40px] rotate-[-90deg] text-[10px] font-mono text-zinc-700 font-bold whitespace-nowrap">
        PROTOCOL: SECURE_UPLOAD_04
      </div>
    </div>
  );
};

export default UploadZone;
