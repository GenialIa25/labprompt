import React from 'react';
// FIX: Corrected import path for types.
import type { PromptVersion } from '../types';

interface HistoryPanelProps {
  history: PromptVersion[];
  activeVersionId: string | null;
  onSelectVersion: (id: string) => void;
  onDeleteVersion: (id: string) => void;
  validatedVersionId: string | null;
  onImport: () => void;
  onPaste: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, activeVersionId, onSelectVersion, onDeleteVersion, validatedVersionId, onImport, onPaste }) => {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h3 className="text-lg font-semibold text-slate-200">Histórico de Versões</h3>
        <div className="flex space-x-2">
            <button 
              onClick={onPaste}
              className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-lg transition text-xs"
              title="Colar um prompt da área de transferência"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <span>Colar</span>
            </button>
            <button 
              onClick={onImport}
              className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-lg transition text-xs"
              title="Importar um prompt de um arquivo .txt ou .md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              <span>Importar</span>
            </button>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-slate-500 text-center text-sm p-4">
          Nenhuma versão gerada. Gere um novo prompt ou importe um existente.
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          <ul className="space-y-2">
            {history.slice().reverse().map((version) => (
              <li
                key={version.id}
                onClick={() => onSelectVersion(version.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors group border-l-4 ${
                  activeVersionId === version.id
                    ? 'bg-slate-700/50 border-cyan-400'
                    : 'bg-slate-800/50 border-transparent hover:bg-slate-700/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 overflow-hidden">
                     {validatedVersionId === version.id && (
                       <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" /></svg>
                     )}
                    <div className="truncate">
                        <p className={`font-bold truncate ${activeVersionId === version.id ? 'text-cyan-400' : 'text-slate-300'}`}>
                          v{version.version} <span className="font-normal opacity-70">- {version.sourceData.persona.slice(0, 20)}{version.sourceData.persona.length > 20 ? '...' : ''}</span>
                        </p>
                        <p className="text-xs text-slate-500">{version.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVersion(version.id);
                    }}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                    title="Deletar versão"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
