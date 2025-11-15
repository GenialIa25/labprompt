import React, { useCallback, useState } from 'react';
import { analyzeDocument } from '../services/geminiService';
import type { PromptData } from '../types';

interface DocumentUploaderProps {
    onDataExtracted: (data: Partial<PromptData>) => void;
    isLoading: boolean;
    onLoadingChange: (isLoading: boolean) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDataExtracted, isLoading, onLoadingChange }) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const processFile = async (file: File) => {
        // Gemini inline currently supports PDF and various text formats, but NOT specifically native DOC/DOCX inline.
        // Restricting to reliable formats to prevent 400 Bad Request errors.
        const validTypes = ['application/pdf', 'text/plain', 'text/markdown', 'text/x-markdown', 'text/html', 'text/csv'];
        const isMarkdownExt = file.name.toLowerCase().endsWith('.md');
        
        if (!validTypes.includes(file.type) && !isMarkdownExt) {
            setError('Formato não suportado pela API. Use PDF, TXT ou MD.');
            return;
        }

        setFileName(file.name);
        onLoadingChange(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                // Handle standard base64 extraction
                const base64String = reader.result?.toString().split(',')[1];
                
                if (base64String) {
                    try {
                        // For MD files that might have empty/generic mime types depending on OS
                        const finalMimeType = isMarkdownExt && (!file.type || file.type === '') ? 'text/markdown' : (file.type || 'text/plain');

                        const extractedData = await analyzeDocument(base64String, finalMimeType);
                        onDataExtracted(extractedData);
                    } catch (err: any) {
                        console.error(err);
                        // Improve error message for user if it's still a 400 related to mime type unexpectedly
                        if (err.message?.includes('400') || err.message?.includes('MIME')) {
                             setError('A API rejeitou este formato de arquivo. Tente converter para PDF ou TXT.');
                        } else {
                             setError(err.message || 'Falha na análise do documento.');
                        }
                        setFileName(null);
                    } finally {
                        onLoadingChange(false);
                    }
                }
            };
            reader.onerror = () => {
                setError('Erro ao ler o arquivo local.');
                onLoadingChange(false);
            };
            reader.readAsDataURL(file);
        } catch (e) {
             setError('Erro inesperado no processamento do arquivo.');
             onLoadingChange(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Importar Conhecimento (Upload)</h3>
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                } ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    onChange={handleChange}
                    accept=".pdf,.txt,.md,.html,.csv"
                    disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                    {isLoading ? (
                         <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )}
                    {fileName ? (
                         <p className="text-sm text-cyan-400 font-medium truncate max-w-xs">{fileName}</p>
                    ) : (
                        <>
                            <p className="text-sm text-slate-300 font-medium">
                                Arraste ou clique para upload
                            </p>
                            <p className="text-xs text-slate-500">
                                Suporta PDF, TXT, MD, HTML, CSV
                            </p>
                        </>
                    )}
                </div>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
    );
};