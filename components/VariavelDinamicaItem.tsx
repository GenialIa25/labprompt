import React from 'react';
import type { VariavelDinamica } from '../types';

interface VariavelDinamicaItemProps {
  variavel: VariavelDinamica;
  onUpdate: (id: string, field: 'chave' | 'valor', value: string) => void;
  onRemove: (id: string) => void;
}

export const VariavelDinamicaItem: React.FC<VariavelDinamicaItemProps> = ({ variavel, onUpdate, onRemove }) => {
  const baseInputClasses = "w-full p-2 bg-slate-600/50 border border-slate-500 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm";
  return (
    <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 space-y-2 relative">
       <button 
        onClick={() => onRemove(variavel.id)} 
        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"
        title="Remover Variável"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-400 mb-1">Chave</label>
          <input
            type="text"
            value={variavel.chave}
            onChange={(e) => onUpdate(variavel.id, 'chave', e.target.value)}
            className={baseInputClasses}
            placeholder="ex: NOME_CLIENTE"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-400 mb-1">Valor</label>
           <input
            type="text"
            value={variavel.valor}
            onChange={(e) => onUpdate(variavel.id, 'valor', e.target.value)}
            className={baseInputClasses}
            placeholder="ex: João"
          />
        </div>
      </div>
    </div>
  );
};