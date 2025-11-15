
import React, { useState, useRef, useEffect } from 'react';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isLoading: boolean;
    error: string | null;
    onDownload: (format: 'txt' | 'pdf') => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose, content, isLoading, error, onDownload }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setIsDownloadOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, downloadRef]);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falha.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const handleDownload = (format: 'txt' | 'pdf') => {
        onDownload(format);
        setIsDownloadOpen(false);
    };

    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-lg text-slate-300">Analisando e gerando documentação...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="m-4 text-red-400 p-4 bg-red-900 bg-opacity-50 rounded-md">
                  <h3 className="font-bold">Erro na Geração da Explicação</h3>
                  <p>{error}</p>
                </div>
            );
        }
        return (
             <div className="w-full h-96 p-4 bg-slate-900/50 text-slate-200 border border-slate-700 rounded-lg resize-none text-sm overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words font-sans">{content}</pre>
             </div>
        )
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl border border-slate-700/50 animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">Explicação do Prompt</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {renderBody()}
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium">
                        Fechar
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={isLoading || !!error || !content}
                        className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copySuccess || 'Copiar Texto'}
                    </button>
                    <div className="relative" ref={downloadRef}>
                        <button
                            onClick={() => setIsDownloadOpen(prev => !prev)}
                            disabled={isLoading || !!error || !content}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            Baixar
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                        {isDownloadOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-20">
                                <button onClick={() => handleDownload('txt')} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Baixar TXT</button>
                                <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Baixar PDF</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};