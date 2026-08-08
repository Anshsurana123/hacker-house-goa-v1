'use client';
import React from 'react';

interface FormatPickerProps {
  selected: 'pfp' | 'card';
  onSelect: (format: 'pfp' | 'card') => void;
}

export default function FormatPicker({ selected, onSelect }: FormatPickerProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={() => onSelect('pfp')}
        className={`flex-1 flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200 relative overflow-hidden group
          ${selected === 'pfp' 
            ? 'border-[#E3A730] shadow-[0_0_15px_rgba(227,167,48,0.5)] scale-[1.02] bg-[#173C2E]' 
            : 'border-[#3F9C8C]/30 bg-[#173C2E]/80 hover:border-[#E3A730] hover:-translate-y-1'
          }
        `}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F3E9D2 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="text-4xl mb-3">🖼️</div>
        <h3 className="font-['Alfa_Slab_One'] text-[#E3A730] text-xl mb-2 tracking-wider z-10">PFP Frame</h3>
        <p className="font-['Space_Mono'] text-[#F3E9D2] text-sm opacity-90 text-center z-10">Profile picture overlay — upload & done</p>
      </button>

      <button
        onClick={() => onSelect('card')}
        className={`flex-1 flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200 relative overflow-hidden group
          ${selected === 'card' 
            ? 'border-[#E3A730] shadow-[0_0_15px_rgba(227,167,48,0.5)] scale-[1.02] bg-[#173C2E]' 
            : 'border-[#3F9C8C]/30 bg-[#173C2E]/80 hover:border-[#E3A730] hover:-translate-y-1'
          }
        `}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F3E9D2 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="text-4xl mb-3">🪪</div>
        <h3 className="font-['Alfa_Slab_One'] text-[#E3A730] text-xl mb-2 tracking-wider z-10">Builder ID Card</h3>
        <p className="font-['Space_Mono'] text-[#F3E9D2] text-sm opacity-90 text-center z-10">Event badge with your name, role & QR</p>
      </button>
    </div>
  );
}
