import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-3 lg:px-8">
        <div className="flex items-center space-x-4">
          <svg
            className="w-10 h-10 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wider">
              LaBPrompT
            </h1>
            <p className="text-sm text-cyan-400/80">Laboratório de Engenharia de Prompt</p>
          </div>
        </div>
      </div>
    </header>
  );
};