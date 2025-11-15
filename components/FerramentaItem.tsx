import React from 'react';
import type { Ferramenta } from '../types';

interface FerramentaItemProps {
  ferramenta: Ferramenta;
  onUpdate: (id: string, field: 'nome' | 'descricao', value: string) => void;
  onRemove: (id: string) => void;
}

export const FerramentaItem: React.FC<FerramentaItemProps> = ({ ferramenta, onUpdate, onRemove }) => {
  const baseInputClasses = "w-full p-2 bg-slate-600/50 border border-slate-500 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm";
  return (
    <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 space-y-2 relative">
       <button 
        onClick={() => onRemove(ferramenta.id)} 
        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"
        title="Remover Ferramenta"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Nome da Ferramenta</label>
        <input
            type="text"
            value={ferramenta.nome}
            onChange={(e) => onUpdate(ferramenta.id, 'nome', e.target.value)}
            className={baseInputClasses}
            placeholder="ex: buscar_pedido"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
        <textarea
          value={ferramenta.descricao}
          onChange={(e) => onUpdate(ferramenta.id, 'descricao', e.target.value)}
          rows={2}
          className={baseInputClasses}
          placeholder="ex: Busca os detalhes de um pedido pelo número de identificação."
        />
      </div>
    </div>
  );
};