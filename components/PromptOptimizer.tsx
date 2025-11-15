import React from 'react';
import type { OptimizationPair } from '../types';

interface PromptOptimizerProps {
    onOptimize: () => void;
    isLoading: boolean;
    disabled: boolean;
    optimizationPairs: OptimizationPair[];
    onClearCorrections: () => void;
    manualInstructions: string;
    onManualInstructionsChange: (text: string) => void;
}

export const PromptOptimizer: React.FC<PromptOptimizerProps> = ({ 
    onOptimize, 
    isLoading, 
    disabled, 
    optimizationPairs, 
    onClearCorrections,
    manualInstructions,
    onManualInstructionsChange
}) => {
    const hasCorrections = optimizationPairs.length > 0;
    const hasInstructions = manualInstructions.trim().length > 0;
    const canOptimize = (hasCorrections || hasInstructions) && !disabled && !isLoading;

    if (disabled && !hasCorrections && !hasInstructions) {
        return <div className="p-4 h-full flex items-center justify-center text-slate-500 text-center">Gere ou selecione um prompt para ativar o otimizador.</div>;
    }

    return (
        <div className="p-4 h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">Otimizador de Prompt</h3>
                    <p className="text-sm text-slate-400 mt-1">Refine seu prompt com feedback do chat ou instruções diretas.</p>
                </div>
                {hasCorrections && (
                    <button 
                        onClick={onClearCorrections} 
                        disabled={isLoading}
                        className="text-xs text-slate-400 hover:text-red-400"
                    >
                        Limpar Correções
                    </button>
                )}
            </div>

            <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
                {/* Área de Correções do Chat */}
                <div className={`flex-1 flex flex-col min-h-0 ${hasCorrections ? '' : 'justify-center'}`}>
                    {hasCorrections ? (
                        <div className="bg-slate-800 border border-slate-700 rounded-md overflow-y-auto p-2 space-y-3 h-full">
                            {optimizationPairs.map(pair => (
                                <div key={pair.id} className="bg-slate-900/70 p-3 rounded-lg text-sm">
                                    <p className="text-slate-400"><span className="font-semibold text-slate-300">Usuário:</span> {pair.userQuery}</p>
                                    <p className="text-red-400/80 mt-2 line-through"><span className="font-semibold text-red-300">Agente (Antes):</span> {pair.originalResponse}</p>
                                    <p className="text-green-400/90 mt-1"><span className="font-semibold text-green-300">Agente (Ideal):</span> {pair.correctedResponse}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-slate-500 text-center text-sm italic border border-dashed border-slate-700 rounded-md p-4">
                            Nenhuma correção do chat ainda. Interaja e marque respostas incorretas para adicioná-las aqui.
                        </div>
                    )}
                </div>

                {/* Área de Instruções Manuais */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Instruções Adicionais (Opcional)</label>
                    <textarea
                        value={manualInstructions}
                        onChange={(e) => onManualInstructionsChange(e.target.value)}
                        placeholder="Ex: Torne o tom mais empático, reduza o tamanho, foque mais nas regras..."
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 text-sm"
                        disabled={isLoading}
                    />
                </div>
            </div>
            
            <button
                onClick={onOptimize}
                disabled={!canOptimize}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Otimizando...
                    </span>
                ) : (
                    `Otimizar Prompt`
                )}
            </button>
        </div>
    );
};
