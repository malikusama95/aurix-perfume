import React from 'react';

interface ScentPyramidProps {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
}

export const ScentPyramid: React.FC<ScentPyramidProps> = ({ topNotes, middleNotes, baseNotes }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-8 space-y-4">
      {/* Top Notes */}
      <div 
        className="w-1/2 border border-perfume-gold/40 bg-neutral-900/40 p-4 text-center backdrop-blur-sm relative group hover:border-perfume-gold/80 transition-colors animate-fade-in"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
      >
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-neutral-900 px-3 text-[9px] uppercase tracking-widest text-perfume-gold font-semibold whitespace-nowrap">
          Top Notes
        </div>
        <span className="text-gray-200 text-sm font-medium">{topNotes.join(" • ")}</span>
      </div>
      
      {/* Heart Notes */}
      <div 
        className="w-3/4 border border-perfume-gold/40 bg-neutral-900/40 p-5 text-center backdrop-blur-sm relative group hover:border-perfume-gold/80 transition-colors animate-fade-in"
        style={{ animationDelay: '300ms', animationFillMode: 'both' }}
      >
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-neutral-900 px-3 text-[9px] uppercase tracking-widest text-perfume-gold font-semibold whitespace-nowrap">
          Heart Notes
        </div>
        <span className="text-gray-200 text-sm font-medium">{middleNotes.join(" • ")}</span>
      </div>
      
      {/* Base Notes */}
      <div 
        className="w-full border border-perfume-gold/40 bg-neutral-900/40 p-6 text-center backdrop-blur-sm relative group hover:border-perfume-gold/80 transition-colors animate-fade-in"
        style={{ animationDelay: '500ms', animationFillMode: 'both' }}
      >
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-neutral-900 px-3 text-[9px] uppercase tracking-widest text-perfume-gold font-semibold whitespace-nowrap">
          Base Notes
        </div>
        <span className="text-gray-200 text-sm font-medium">{baseNotes.join(" • ")}</span>
      </div>
    </div>
  );
};
