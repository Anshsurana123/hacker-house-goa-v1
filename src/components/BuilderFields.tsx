'use client';
import React, { useState } from 'react';

interface BuilderFieldsProps {
  name: string;
  onNameChange: (name: string) => void;
  age: string;
  onAgeChange: (age: string) => void;
  stackRole: string;
  onStackRoleChange: (role: string) => void;
  currentlyShipping: string;
  onCurrentlyShippingChange: (shipping: string) => void;
  builderTitle: string;
  onBuilderTitleChange: (title: string) => void;
  githubUsername: string;
  onGithubUsernameChange: (username: string) => void;
  onRerollTitle: () => void;
}

export default function BuilderFields({
  name,
  onNameChange,
  age,
  onAgeChange,
  stackRole,
  onStackRoleChange,
  currentlyShipping,
  onCurrentlyShippingChange,
  builderTitle,
  githubUsername,
  onGithubUsernameChange,
  onRerollTitle,
}: BuilderFieldsProps) {
  const [isRerolling, setIsRerolling] = useState(false);

  const handleReroll = () => {
    setIsRerolling(true);
    onRerollTitle();
    setTimeout(() => setIsRerolling(false), 400);
  };

  return (
    <div className="flex flex-col gap-4 font-['Space_Mono'] w-full">
      {/* Name + Age row */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your Name"
            className="bg-[#173C2E] text-[#F3E9D2] border border-[#F3E9D2]/20 rounded-md px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#E3A730] focus:shadow-[0_0_12px_rgba(227,167,48,0.2)] transition-all w-full placeholder:text-[#F3E9D2]/20 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 w-[80px]">
          <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
            Age
          </label>
          <input
            type="text"
            value={age}
            onChange={(e) => {
              // Allow only digits, max 2 chars
              const v = e.target.value.replace(/\D/g, '').slice(0, 2);
              onAgeChange(v);
            }}
            placeholder="21"
            maxLength={2}
            className="bg-[#173C2E] text-[#F3E9D2] border border-[#F3E9D2]/20 rounded-md px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#E3A730] focus:shadow-[0_0_12px_rgba(227,167,48,0.2)] transition-all w-full placeholder:text-[#F3E9D2]/20 text-sm text-center"
          />
        </div>
      </div>

      {/* Stack / Role */}
      <div className="flex flex-col gap-1">
        <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
          Stack / Role
        </label>
        <input
          type="text"
          value={stackRole}
          onChange={(e) => onStackRoleChange(e.target.value)}
          placeholder="Full-stack / Rust"
          className="bg-[#173C2E] text-[#F3E9D2] border border-[#F3E9D2]/20 rounded-md px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#E3A730] focus:shadow-[0_0_12px_rgba(227,167,48,0.2)] transition-all w-full placeholder:text-[#F3E9D2]/20 text-sm"
        />
      </div>

      {/* Currently Shipping */}
      <div className="flex flex-col gap-1">
        <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
          🚀 Currently Shipping
        </label>
        <input
          type="text"
          value={currentlyShipping}
          onChange={(e) => onCurrentlyShippingChange(e.target.value)}
          placeholder="AI code review tool"
          className="bg-[#173C2E] text-[#F3E9D2] border border-[#E8237E]/20 rounded-md px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#E8237E] focus:shadow-[0_0_12px_rgba(232,35,126,0.2)] transition-all w-full placeholder:text-[#F3E9D2]/20 text-sm"
        />
      </div>

      {/* Builder Title with reroll */}
      <div className="flex flex-col gap-1">
        <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
          ⚡ Builder Title
        </label>
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 bg-[#0F2A1F] border border-[#E8237E]/30 rounded-md px-3 py-2.5 min-h-[44px] flex items-center text-[#E8237E] font-bold transition-all text-sm ${
              isRerolling ? 'scale-[0.98] opacity-70' : ''
            }`}
            style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <span className="mr-2 text-[#E8237E]/40 text-xs">{'>'}</span>
            <span className="truncate">{builderTitle}</span>
            <span className="ml-1 w-[2px] h-4 bg-[#E8237E]/60 animate-blink inline-block shrink-0" />
          </div>
          <button
            onClick={handleReroll}
            className="bg-[#E8237E]/10 hover:bg-[#E8237E]/25 border border-[#E8237E]/30 hover:border-[#E8237E]/60 text-[#F3E9D2] rounded-md p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all active:scale-90 hover:rotate-12"
            title="Reroll Title"
          >
            🎲
          </button>
        </div>
      </div>

      {/* GitHub Username */}
      <div className="flex flex-col gap-1">
        <label className="text-[#F3E9D2]/60 text-[10px] uppercase tracking-[0.15em]">
          GitHub
        </label>
        <div className="flex bg-[#173C2E] border border-[#F3E9D2]/20 rounded-md focus-within:border-[#E3A730] focus-within:shadow-[0_0_12px_rgba(227,167,48,0.2)] transition-all overflow-hidden min-h-[44px]">
          <span className="flex items-center px-3 bg-[#0F2A1F] text-[#F3E9D2]/30 border-r border-[#F3E9D2]/10 text-xs shrink-0">
            github.com/
          </span>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => onGithubUsernameChange(e.target.value.replace(/\s/g, ''))}
            placeholder="username"
            className="bg-transparent text-[#F3E9D2] px-3 py-2.5 flex-1 focus:outline-none placeholder:text-[#F3E9D2]/20 min-w-0 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
