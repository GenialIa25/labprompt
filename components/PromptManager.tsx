

import React, { useState, useEffect, useRef } from 'react';
import { PromptInputForm } from './PromptInputForm';
import { OutputDisplay } from './OutputDisplay';
import { HistoryPanel } from './HistoryPanel';
import { ChatInterface } from './ChatInterface';
import { PromptOptimizer } from './PromptOptimizer';
import { AssistantPanel } from './AssistantPanel';
import { PasteModal } from './PasteModal';
import { ExplanationModal } from './ExplanationModal';
import type { PromptData, PromptVersion, ChatMessage, FewShotExample, OptimizationPair } from '../types';
import { INITIAL_PROMPT_DATA } from '../constants';
import { createFinalPrompt, startChat, continueChat, optimizePrompt, generateExamples, processAudioCommand, explainPrompt } from '../services/geminiService';
import type { GenerateContentResponse } from '@google/genai';

declare const jspdf: any;

interface N8nConfig {
    url: string;
    apiKey: string;
}

export const PromptManager: React.FC = () => {
    const [versionHistory, setVersionHistory] = useState<PromptVersion[]>([]);
    const [activeVersion, setActiveVersion] = useState<PromptVersion | null>(null);
    const [validatedVersionId, setValidatedVersionId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PromptData>(INITIAL_PROMPT_DATA);
    const [optimizationPairs, setOptimizationPairs] = useState<OptimizationPair[]>([]);
    const [manualOptInstructions, setManualOptInstructions] = useState('');
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Explanation State
    const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
    const [explanationContent, setExplanationContent] = useState('');
    const [isExplanationLoading, setIsExplanationLoading] = useState(false);
    const [explanationError, setExplanationError] = useState<string | null>(null);

    // Assistant State
    const [isApiKeySelected, setIsApiKeySelected] = useState(false);
    const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);
    const [assistantError, setAssistantError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // n8n State
    const [n8nConfig, setN8nConfig] = useState<N8nConfig>({
        url: '',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDY4MTY1Ny00ZTA4LTQzZGMtOWUyYi03ZThkMWJhOGZiYzgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYzMTc1NTczfQ.YmsWG6QNaIEvaMWX5M8yww6XoJyzcddpSshhfxe1cZQ',
    });

    // Load n8n config from localStorage on initial render
    useEffect(() => {
        const savedN8nConfig = localStorage.getItem('n8nConfig');
        if (savedN8nConfig) {
            setN8nConfig(JSON.parse(savedN8nConfig));
        }
    }, []);

    // Save n8n config to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('n8nConfig', JSON.stringify(n8nConfig));
    }, [n8nConfig]);


    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsApiKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);

    useEffect(() => {
        if (activeVersion) {
            startChat(activeVersion.content);
            setChatMessages([]);
            setFormData(activeVersion.sourceData);
        } else {
             setFormData(INITIAL_PROMPT_DATA);
        }
    }, [activeVersion]);
    
    const handleAssistantToolCall = (toolCall: any) => {
        const { name, args } = toolCall;
        
        switch (name) {
            case 'updatePersona':
                setFormData(prev => ({ ...prev, persona: args.text }));
                break;
            case 'updateObjetivo':
                setFormData(prev => ({ ...prev, objetivo: args.text }));
                break;
            case 'updateContextoNegocio':
                setFormData(prev => ({ ...prev, contextoNegocio: args.text }));
                break;
            case 'updateContextoInteracao':
                setFormData(prev => ({ ...prev, contexto: args.text }));
                break;
            case 'addRegra':
                setFormData(prev => ({ ...prev, regras: [...prev.regras, args.text] }));
                break;
            case 'addExemplo':
                 setFormData(prev => ({ ...prev, exemplos: [...prev.exemplos, { ...args, id: crypto.randomUUID() }] }));
                 break;
            default:
                console.warn(`Função ${name} não reconhecida.`);
        }
    };
    
    const processAssistantResponse = (response: GenerateContentResponse) => {
        if (response.functionCalls && response.functionCalls.length > 0) {
            response.functionCalls.forEach(handleAssistantToolCall);
        }
        const responseText = response.text.trim();
        if (responseText) {
            const transcriptionMatch = responseText.match(/\[TRANSCRIÇÃO:\s*(.*?)\]/i);
            const userTranscription = transcriptionMatch ? transcriptionMatch[1] : "Comando de áudio não transcrito.";
            setAssistantMessages(prev => [
                ...prev, 
                { author: 'user', text: userTranscription },
                { author: 'agent', text: responseText.replace(/\[TRANSCRIÇÃO:.*?\]\s*/i, '') }
            ]);
        }
    }

    const startRecording = async () => {
        if (isRecording) return;
        setAssistantError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result?.toString().split(',')[1];
                    if (base64Audio) {
                        setIsAssistantLoading(true);
                        try {
                            const response = await processAudioCommand(base64Audio, audioBlob.type);
                            processAssistantResponse(response);
                        } catch (err: any) {
                            setAssistantError(err.message || "Erro ao processar áudio.");
                        } finally {
                            setIsAssistantLoading(false);
                        }
                    }
                };
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
            setAssistantError("Falha ao iniciar a gravação. Verifique as permissões do microfone.");
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSelectApiKey = async () => {
        try {
            if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
                await window.aistudio.openSelectKey();
                setIsApiKeySelected(true);
                setAssistantError(null);
            }
        } catch (error) {
            console.error("Error opening API key selection:", error);
            setAssistantError("Não foi possível abrir o seletor de chave de API.");
        }
    };

    const handleGeneratePrompt = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const promptContent = await createFinalPrompt(formData);
            const newVersion: PromptVersion = {
                id: crypto.randomUUID(),
                version: versionHistory.length + 1,
                content: promptContent,
                format: formData.formatoSaida,
                masterFormat: formData.masterPromptFormat, // Salva o formato do prompt mestre
                timestamp: new Date().toLocaleString('pt-BR'),
                sourceData: formData,
            };
            setVersionHistory(prev => [...prev, newVersion]);
            setActiveVersion(newVersion);
        } catch (e: any) {
            setError(e.message || "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOptimizePrompt = async () => {
        if (!activeVersion) return;
        if (optimizationPairs.length === 0 && !manualOptInstructions.trim()) return;

        setIsOptimizing(true);
        setError(null);
        try {
            const optimizedContent = await optimizePrompt(activeVersion.content, optimizationPairs, manualOptInstructions);
             const newVersion: PromptVersion = {
                id: crypto.randomUUID(),
                version: versionHistory.length + 1,
                content: optimizedContent,
                format: activeVersion.sourceData.formatoSaida,
                masterFormat: activeVersion.sourceData.masterPromptFormat, // Mantém o formato mestre original
                timestamp: new Date().toLocaleString('pt-BR'),
                sourceData: activeVersion.sourceData,
            };
            setVersionHistory(prev => [...prev, newVersion]);
            setActiveVersion(newVersion);
            setOptimizationPairs([]);
            setManualOptInstructions('');
        } catch (e: any) {
            setError(e.message || "Ocorreu um erro desconhecido ao otimizar.");
        } finally {
            setIsOptimizing(false);
        }
    };
    
    const handleGenerateExamples = async () => {
        setIsGeneratingExamples(true);
        setError(null);
        try {
            const newExamplesData = await generateExamples(formData);
            const newExamplesWithIds: FewShotExample[] = newExamplesData.map(ex => ({
                ...ex,
                id: crypto.randomUUID(),
            }));
            setFormData(prev => ({ ...prev, exemplos: [...prev.exemplos, ...newExamplesWithIds] }));
        } catch (e: any) {
             setError(e.message || "Ocorreu um erro ao gerar exemplos.");
        } finally {
            setIsGeneratingExamples(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        setChatMessages(prev => [...prev, { author: 'user', text: message }]);
        setIsChatLoading(true);
        try {
            const response = await continueChat(message);
            setChatMessages(prev => [...prev, { author: 'agent', text: response }]);
        } catch (e: any) {
            setChatMessages(prev => [...prev, { author: 'agent', text: `Erro: ${e.message}` }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleClearChat = () => {
        if (activeVersion) {
            startChat(activeVersion.content);
            setChatMessages([]);
        }
    };
    
    const handleDownloadChat = (format: 'txt' | 'pdf') => {
        if (chatMessages.length === 0 || !activeVersion) return;

        const header = `Histórico de Chat - Prompt v${activeVersion.version}`;
        const timestamp = `Exportado em: ${new Date().toLocaleString('pt-BR')}`;
        
        if (format === 'txt') {
            const chatContent = chatMessages.map(msg => {
                const author = msg.author === 'user' ? 'Usuário' : 'Agente';
                return `${author}: ${msg.text}`;
            }).join('\n\n');

            const fullContent = `${header}\n${timestamp}\n\n${chatContent}`;

            const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `historico_chat_v${activeVersion.version}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            let y = 20;
            const margin = 10;
            const pageWidth = doc.internal.pageSize.getWidth();

            doc.setFontSize(16);
            doc.text(header, margin, y);
            y += 7;
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(timestamp, margin, y);
            y += 15;

            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);

            chatMessages.forEach(msg => {
                const isUser = msg.author === 'user';
                const text = msg.text;
                const bubbleWidth = pageWidth * 0.7;
                const splitText = doc.splitTextToSize(text, bubbleWidth - 10);
                const bubbleHeight = (splitText.length * 5) + 10;
                
                if (y + bubbleHeight > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = 20;
                }

                const x = isUser ? pageWidth - bubbleWidth - margin : margin;
                const userColor = [8, 145, 178]; // cyan-600
                const agentColor = [51, 65, 85]; // slate-700
                
                doc.setFillColor(isUser ? userColor[0] : agentColor[0], isUser ? userColor[1] : agentColor[1], isUser ? userColor[2] : agentColor[2]);
                doc.roundedRect(x, y, bubbleWidth, bubbleHeight, 3, 3, 'F');
                doc.text(splitText, x + 5, y + 8);
                
                y += bubbleHeight + 5;
            });

            doc.save(`historico_chat_v${activeVersion.version}.pdf`);
        }
    };

    const handleUpdateMessage = (messageIndex: number, update: Partial<ChatMessage>) => {
        setChatMessages(prevMessages =>
            prevMessages.map((msg, index) =>
                index === messageIndex ? { ...msg, ...update } : msg
            )
        );
    };

    const handleSaveCorrection = (messageIndex: number, correctedText: string) => {
        let userQuery = '';
        for (let i = messageIndex - 1; i >= 0; i--) {
            if (chatMessages[i].author === 'user') {
                userQuery = chatMessages[i].text;
                break;
            }
        }
        if (userQuery) {
            const originalMessage = chatMessages[messageIndex];
            setOptimizationPairs(prev => [...prev, {
                id: crypto.randomUUID(),
                userQuery,
                originalResponse: originalMessage.text,
                correctedResponse: correctedText
            }]);
        }
        handleUpdateMessage(messageIndex, { correction: correctedText, isEditing: false });
    };

    const handleSelectVersion = (id: string) => {
        const version = versionHistory.find(v => v.id === id);
        if (version) setActiveVersion(version);
    };

    const handleValidateVersion = (id: string) => setValidatedVersionId(id);

    const handleDeleteVersion = (id: string) => {
        const updatedHistory = versionHistory.filter(v => v.id !== id);
        setVersionHistory(updatedHistory);
        if (validatedVersionId === id) setValidatedVersionId(null);
        if (activeVersion?.id === id) setActiveVersion(updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1] : null);
    };
    
    const handleExplainPrompt = async (content: string) => {
        if (!content) return;
        setIsExplanationModalOpen(true);
        setIsExplanationLoading(true);
        setExplanationContent('');
        setExplanationError(null);
        try {
            const explanation = await explainPrompt(content);
            setExplanationContent(explanation);
        } catch (e: any) {
            setExplanationError(e.message || "Ocorreu um erro desconhecido ao gerar a explicação.");
        } finally {
            setIsExplanationLoading(false);
        }
    };

    const handleDownloadExplanation = (format: 'txt' | 'pdf') => {
        if (!explanationContent) return;
        const title = 'Explicacao_do_Prompt';

        if (format === 'txt') {
            const blob = new Blob([explanationContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            let y = 15;
            const margin = 10;
            const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
            
            doc.setFontSize(18);
            doc.text('Explicação do Prompt', margin, y);
            y += 10;
            
            const lines = explanationContent.split('\n');

            lines.forEach(line => {
                if (y > 280) { // Page break check
                    doc.addPage();
                    y = 15;
                }
                
                line = line.replace(/\*\*(.*?)\*\*/g, '$1'); // Basic bold removal for size calculation
                const isHeader1 = line.startsWith('# ');
                const isHeader2 = line.startsWith('## ');
                const isListItem = line.startsWith('- ') || /^\d+\.\s/.test(line);

                let text = line;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);

                if (isHeader1) {
                    text = line.substring(2);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(16);
                } else if (isHeader2) {
                    text = line.substring(3);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                } else if (isListItem) {
                    text = '  • ' + line.replace(/(-|\d+\.)\s/, '');
                }

                const splitText = doc.splitTextToSize(text, maxWidth);
                doc.text(splitText, margin, y);
                y += (splitText.length * 5); // Line height approx 5

                if (isHeader1 || isHeader2) {
                    y += 3; // Extra space after headers
                }
            });

            doc.save(`${title}.pdf`);
        }
    };


    const loadExternalPrompt = (content: string, sourceName: string) => {
        // Tenta detectar se é JSON
        let detectedMasterFormat: 'markdown' | 'json' = 'markdown';
        try {
            JSON.parse(content);
            detectedMasterFormat = 'json';
        } catch (e) {}

        const importedSourceData: PromptData = {
            ...INITIAL_PROMPT_DATA,
            persona: sourceName,
            objetivo: 'Prompt importado externamente.',
            contexto: `Conteúdo carregado via ${sourceName}.`,
            masterPromptFormat: detectedMasterFormat
        };

        const newVersion: PromptVersion = {
            id: crypto.randomUUID(),
            version: versionHistory.length + 1,
            content: content,
            format: 'markdown', // Assume formato de saída padrão se desconhecido
            masterFormat: detectedMasterFormat,
            timestamp: new Date().toLocaleString('pt-BR'),
            sourceData: importedSourceData
        };
        setVersionHistory(prev => [...prev, newVersion]);
        setActiveVersion(newVersion);
    };

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) loadExternalPrompt(content, 'Arquivo Importado');
        };
        reader.onerror = (e) => setError("Falha ao ler o arquivo.");
        reader.readAsText(file);
        if (event.target) event.target.value = '';
    };

    const handlePasteClick = () => setIsPasteModalOpen(true);
    const handlePasteConfirm = (text: string) => loadExternalPrompt(text, 'Prompt Colado');

    const isUIBlocked = isLoading || isOptimizing;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 p-4 h-full text-white relative">
            <ExplanationModal
                isOpen={isExplanationModalOpen}
                onClose={() => setIsExplanationModalOpen(false)}
                content={explanationContent}
                isLoading={isExplanationLoading}
                error={explanationError}
                onDownload={handleDownloadExplanation}
            />
            <PasteModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onConfirm={handlePasteConfirm} />
            <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept=".txt,.md,.json" />
            <div className="col-span-12 lg:col-span-4 lg:row-span-6 bg-slate-800 rounded-lg overflow-hidden">
                <PromptInputForm
                    formData={formData}
                    setFormData={setFormData}
                    onGenerate={handleGeneratePrompt}
                    isLoading={isLoading}
                    onGenerateExamples={handleGenerateExamples}
                    isGeneratingExamples={isGeneratingExamples}
                    n8nConfig={n8nConfig}
                    setN8nConfig={setN8nConfig}
                    activePromptContent={activeVersion?.content ?? ''}
                />
            </div>
            <div className="col-span-12 lg:col-span-5 lg:row-span-4 bg-slate-800 rounded-lg overflow-hidden flex flex-col">
                <OutputDisplay 
                    version={activeVersion} 
                    isLoading={isUIBlocked} 
                    error={error} 
                    isValidated={!!validatedVersionId && activeVersion?.id === validatedVersionId}
                    onValidate={handleValidateVersion}
                    onExplain={handleExplainPrompt}
                />
            </div>
            <div className="col-span-12 lg:col-span-3 lg:row-span-2 bg-slate-800 rounded-lg overflow-hidden">
                <HistoryPanel
                    history={versionHistory}
                    activeVersionId={activeVersion?.id ?? null}
                    onSelectVersion={handleSelectVersion}
                    onDeleteVersion={handleDeleteVersion}
                    validatedVersionId={validatedVersionId}
                    onImport={handleImportClick}
                    onPaste={handlePasteClick}
                />
            </div>
            <div className="col-span-12 lg:col-span-3 lg:row-span-2 bg-slate-800 rounded-lg overflow-hidden">
                <PromptOptimizer 
                    onOptimize={handleOptimizePrompt}
                    isLoading={isOptimizing}
                    disabled={!activeVersion || isUIBlocked}
                    optimizationPairs={optimizationPairs}
                    onClearCorrections={() => setOptimizationPairs([])}
                    manualInstructions={manualOptInstructions}
                    onManualInstructionsChange={setManualOptInstructions}
                 />
            </div>
            <div className="col-span-12 lg:col-span-5 lg:row-span-2 bg-slate-800 rounded-lg overflow-hidden">
                 <ChatInterface 
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onClearChat={handleClearChat}
                    isLoading={isChatLoading}
                    disabled={!activeVersion || isUIBlocked}
                    onUpdateMessage={handleUpdateMessage}
                    onSaveCorrection={handleSaveCorrection}
                    onDownloadChat={handleDownloadChat}
                 />
            </div>
             <div className="col-span-12 lg:col-span-3 lg:row-span-2 bg-slate-800 rounded-lg overflow-hidden">
                <AssistantPanel 
                    messages={assistantMessages}
                    isRecording={isRecording}
                    onToggleRecording={handleToggleRecording}
                    isAssistantLoading={isAssistantLoading}
                    error={assistantError}
                    isApiKeySelected={isApiKeySelected}
                    onSelectKey={handleSelectApiKey}
                 />
            </div>
        </div>
    );
};