import React from 'react';
// FIX: Corrected import path for types.
import type { FewShotExample } from '../types';

interface FewShotExampleItemProps {
  example: FewShotExample;
  onUpdate: (id: string, field: 'user' | 'agent', value: string) => void;
  onRemove: (id: string) => void;
}

export const FewShotExampleItem: React.FC<FewShotExampleItemProps> = ({ example, onUpdate, onRemove }) => {
  const baseInputClasses = "w-full p-2 bg-slate-600/50 border border-slate-500 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm";
  return (
    <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 space-y-2 relative">
       <button 
        onClick={() => onRemove(example.id)} 
        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"
        title="Remover Exemplo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Usuário:</label>
        <textarea
          value={example.user}
          onChange={(e) => onUpdate(example.id, 'user', e.target.value)}
          rows={2}
          className={baseInputClasses}
          placeholder="Ex: Qual o preço do plano Pro?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Agente:</label>
        <textarea
          value={example.agent}
          onChange={(e) => onUpdate(example.id, 'agent', e.target.value)}
          rows={3}
          className={baseInputClasses}
          placeholder="Ex: O plano Pro custa $29/mês e inclui todos os recursos avançados."
        />
      </div>
    </div>
  );
};