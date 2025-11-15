
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import type { PromptVersion, OutputFormat } from '../types';

interface OutputDisplayProps {
  version: PromptVersion | null;
  isLoading: boolean;
  error: string | null;
  isValidated: boolean;
  onValidate: (id: string) => void;
  onExplain: (content: string) => void;
}

const fileExtensions: Record<OutputFormat, string> = {
    json: 'json',
    markdown: 'md',
    text: 'txt',
    xml: 'xml',
    yaml: 'yaml',
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ version, isLoading, error, isValidated, onValidate, onExplain }) => {
  const [copySuccess, setCopySuccess] = useState('');

  // O prompt sempre é texto/markdown, independentemente do formato de saída alvo.
  const formattedContent = version?.content || '';

  const charCount = formattedContent.length;
  const tokenCount = Math.round(charCount / 4);

  const handleCopy = () => {
    if (!formattedContent) return;
    navigator.clipboard.writeText(formattedContent).then(() => {
      setCopySuccess('Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Falha.');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDownload = () => {
    if (!version || !formattedContent) return;
    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    // Sempre baixa como .md ou .txt pois é o PROMPT, não a saída final.
    link.href = url;
    link.download = `prompt_v${version.version}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-10">
          <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-lg text-slate-300">Gerando prompt...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="m-4 text-red-400 p-4 bg-red-900 bg-opacity-50 rounded-md">
          <h3 className="font-bold">Erro na Operação</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (!version) {
        return <div className="flex items-center justify-center h-full text-slate-500">Aguardando a geração do prompt...</div>
    }
    return (
      <>
      <div className="flex justify-between items-center border-b border-slate-700 p-3 flex-shrink-0">
          <div className="flex items-center space-x-4">
              <div>
                  <h2 className="text-lg font-bold text-cyan-400">
                    Versão {version.version} 
                    <span className="text-xs font-normal text-slate-400 ml-2 px-2 py-0.5 bg-slate-700 rounded-full">
                      Alvo: {version.format.toUpperCase()}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">{version.timestamp}</p>
              </div>
              {isValidated ? (
                 <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" /></svg>
                    <span>Prompt Validado</span>
                 </div>
              ) : (
                <button onClick={() => onValidate(version.id)} className="bg-green-600/80 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg transition text-sm">Validar Prompt</button>
              )}
          </div>
          <div className="flex items-center space-x-3">
              <div className="text-right">
                  <p className="text-sm font-medium text-slate-300">{charCount.toLocaleString('pt-BR')} <span className="text-xs text-slate-500">chars</span></p>
                  <p className="text-sm font-medium text-slate-300">~{tokenCount.toLocaleString('pt-BR')} <span className="text-xs text-slate-500">tokens</span></p>
              </div>
              <button onClick={() => onExplain(formattedContent)} disabled={!formattedContent} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm">Explicar</button>
              <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm">{copySuccess || 'Copiar'}</button>
              <button onClick={handleDownload} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm">Baixar</button>
          </div>
      </div>
      <div className="flex-grow p-4 overflow-auto font-mono">
          <pre className="text-sm text-slate-200 whitespace-pre-wrap break-all">
              <code>{formattedContent}</code>
          </pre>
      </div>
      </>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-lg h-full flex flex-col relative">
      {renderContent()}
    </div>
  );
};
