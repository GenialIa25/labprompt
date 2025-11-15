import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import path for types.
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onClearChat: () => void;
    isLoading: boolean;
    disabled: boolean;
    onUpdateMessage: (index: number, update: Partial<ChatMessage>) => void;
    onSaveCorrection: (index: number, correctedText: string) => void;
    onDownloadChat: (format: 'txt' | 'pdf') => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    messages, 
    onSendMessage, 
    onClearChat,
    isLoading, 
    disabled, 
    onUpdateMessage, 
    onSaveCorrection,
    onDownloadChat 
}) => {
    const [input, setInput] = useState('');
    const [editingText, setEditingText] = useState('');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const downloadRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setIsDownloadOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [downloadRef]);


    const handleSend = () => {
        if (input.trim() && !isLoading && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    const handleFeedback = (index: number, feedback: 'correct' | 'incorrect') => {
        const currentMessage = messages[index];
        if (currentMessage.feedback === feedback) {
            onUpdateMessage(index, { feedback: undefined, isEditing: false });
            return;
        }

        if (feedback === 'incorrect') {
            onUpdateMessage(index, { feedback: 'incorrect', isEditing: true });
            setEditingText(currentMessage.text); 
        } else {
            onUpdateMessage(index, { feedback: 'correct', isEditing: false });
        }
    };

    const handleSaveCorrection = (index: number) => {
        if (editingText.trim()) {
            onSaveCorrection(index, editingText.trim());
            setEditingText('');
        }
    };
    
    const handleDownload = (format: 'txt' | 'pdf') => {
        onDownloadChat(format);
        setIsDownloadOpen(false);
    };

    if (disabled) {
        return (
            <div className="p-4 h-full flex flex-col space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">Teste do Prompt</h3>
                    <p className="text-sm text-slate-400 mt-1">Gere ou selecione uma versão de prompt para ativar o chat.</p>
                </div>
                <div className="flex-grow flex items-center justify-center text-slate-500 bg-slate-800/50 rounded-lg">
                    <p>Chat desativado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 h-full flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">Teste do Prompt</h3>
                    <p className="text-sm text-slate-400 mt-1">Interaja com o prompt da versão ativa para validar o comportamento.</p>
                </div>
                {messages.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <div className="relative" ref={downloadRef}>
                            <button
                                onClick={() => setIsDownloadOpen(prev => !prev)}
                                disabled={isLoading}
                                className="text-xs flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded-md hover:bg-slate-700/50"
                                title="Baixar histórico da conversa"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span>Baixar</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            {isDownloadOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                                    <button onClick={() => handleDownload('txt')} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Baixar TXT</button>
                                    <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Baixar PDF</button>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={onClearChat}
                            disabled={isLoading}
                            className="text-xs flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded-md hover:bg-slate-700/50"
                            title="Limpar histórico e reiniciar conversa"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            <span>Limpar</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-grow bg-slate-900/50 rounded-lg p-2 flex flex-col space-y-2 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-slate-500 text-sm italic">
                        Envie uma mensagem para iniciar o teste.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.author === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-lg px-3 py-2 max-w-xs lg:max-w-md ${
                                msg.author === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                             {msg.author === 'agent' && (
                                <>
                                    <div className="mt-1.5 flex items-center space-x-2">
                                        <button onClick={() => handleFeedback(index, 'correct')} title="Resposta correta" className={`p-1 rounded-full transition-colors ${msg.feedback === 'correct' ? 'bg-green-500/30 text-green-400' : 'text-slate-500 hover:text-green-400 hover:bg-slate-700'}`}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.757a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM2 10a1 1 0 01-1-1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.95 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" /></svg>
                                        </button>
                                        <button onClick={() => handleFeedback(index, 'incorrect')} title="Resposta incorreta" className={`p-1 rounded-full transition-colors ${msg.feedback === 'incorrect' ? 'bg-red-500/30 text-red-400' : 'text-slate-500 hover:text-red-400 hover:bg-slate-700'}`}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                    {msg.isEditing && (
                                        <div className="mt-2 w-full max-w-xs lg:max-w-md">
                                            <p className="text-xs text-slate-400 mb-1">Corrija a resposta do agente:</p>
                                            <textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                rows={4}
                                                className="w-full p-2 text-sm bg-slate-800 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <div className="flex justify-end space-x-2 mt-2">
                                                <button
                                                    onClick={() => onUpdateMessage(index, { isEditing: false })}
                                                    className="text-xs bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded-md transition"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => handleSaveCorrection(index)}
                                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded-md transition"
                                                >
                                                    Salvar Correção
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {msg.correction && !msg.isEditing && (
                                        <div className="mt-2 w-full max-w-xs lg:max-w-md bg-indigo-900/50 border-l-2 border-indigo-500 p-2 rounded-r-md">
                                            <p className="text-xs font-bold text-indigo-300">Sua correção:</p>
                                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{msg.correction}</p>
                                        </div>
                                    )}
                                </>
                             )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="rounded-lg px-3 py-2 bg-slate-700 text-slate-200">
                            <span className="animate-pulse">...</span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-2 rounded-md transition disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center px-4"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </div>
        </div>
    );
};