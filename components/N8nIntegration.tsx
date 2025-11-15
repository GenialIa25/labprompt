import React, { useState, useEffect } from 'react';
import type { N8nWorkflow, N8nNode } from '../types';
import { fetchWorkflows, fetchWorkflowDetails, updateNodeParameter } from '../services/n8nService';

interface N8nConfig {
    url: string;
    apiKey: string;
}

interface N8nIntegrationProps {
    config: N8nConfig;
    setConfig: React.Dispatch<React.SetStateAction<N8nConfig>>;
    promptContent: string;
}

export const N8nIntegration: React.FC<N8nIntegrationProps> = ({ config, setConfig, promptContent }) => {
    const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
    const [nodes, setNodes] = useState<N8nNode[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState('');
    const [nodeParameters, setNodeParameters] = useState<string[]>([]);
    const [selectedParameterKey, setSelectedParameterKey] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleConfigChange = (field: keyof N8nConfig, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const resetSelections = () => {
        setWorkflows([]);
        setSelectedWorkflowId('');
        setNodes([]);
        setSelectedNodeId('');
        setNodeParameters([]);
        setSelectedParameterKey('');
    };

    const handleConnect = async () => {
        if (!config.url || !config.apiKey) {
            setError("URL da instância e Chave de API são obrigatórios.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        resetSelections();
        try {
            const fetchedWorkflows = await fetchWorkflows(config);
            setWorkflows(fetchedWorkflows);
        } catch (e: any) {
            setError(e.message || "Falha ao conectar com a API do n8n.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedWorkflowId) {
            setNodes([]);
            setSelectedNodeId('');
            return;
        }
        const fetchNodes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const workflowDetails = await fetchWorkflowDetails(config, selectedWorkflowId);
                // Mostra TODOS os nodes - o usuário pode escolher qualquer um
                // Nodes de IA são comuns: gemini, openAi, anthropic, mistral, etc.
                setNodes(workflowDetails.nodes || []);
            } catch (e: any) {
                setError(e.message || "Falha ao buscar os nós do workflow.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNodes();
    }, [selectedWorkflowId, config]);

    // Função para buscar campos de prompt em objetos aninhados (movida para fora do useEffect)
    const findPromptFields = React.useCallback((obj: any, prefix: string = '', depth: number = 0): string[] => {
        const fields: string[] = [];
        if (depth > 3) return fields; // Limita profundidade para evitar loops
        
        if (!obj || typeof obj !== 'object') return fields;
        
        // Campos comuns que contêm prompts
        const promptFieldNames = [
            'prompt', 'systemMessage', 'systemPrompt', 'instruction', 'instructions',
            'message', 'messages', 'content', 'text', 'input', 'query',
            'system', 'assistant', 'user', 'context'
        ];
        
        for (const key in obj) {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            
            // Se o nome do campo sugere que é um prompt
            if (promptFieldNames.some(name => key.toLowerCase().includes(name.toLowerCase()))) {
                if (typeof value === 'string' || (typeof value === 'object' && value !== null)) {
                    fields.push(fullPath);
                }
            }
            
            // Se for um objeto, busca recursivamente
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                fields.push(...findPromptFields(value, fullPath, depth + 1));
            }
            
            // Se for um array de objetos (como messages), busca no primeiro item
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                fields.push(...findPromptFields(value[0], `${fullPath}[0]`, depth + 1));
            }
            
            // Também adiciona campos string simples do nível raiz
            if (depth === 0 && typeof value === 'string' && value.length > 0) {
                if (!fields.includes(fullPath)) {
                    fields.push(fullPath);
                }
            }
        }
        
        return fields;
    }, []);

    useEffect(() => {
        if (!selectedNodeId) {
            setNodeParameters([]);
            setSelectedParameterKey('');
            return;
        }
        const selectedNode = nodes.find(n => n.id === selectedNodeId);
        if (selectedNode) {
            // Busca campos de prompt em toda a estrutura de parâmetros
            const promptFields = findPromptFields(selectedNode.parameters);
            
            // Remove duplicatas e ordena
            const uniqueFields = [...new Set(promptFields)].sort();
            
            setNodeParameters(uniqueFields);
        }
    }, [selectedNodeId, nodes, findPromptFields]);

    const handleUpdateNode = async () => {
        if (!selectedWorkflowId || !selectedNodeId || !selectedParameterKey) {
            setError("Selecione um workflow, um nó e um campo para atualizar.");
            return;
        }
        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await updateNodeParameter(config, selectedWorkflowId, selectedNodeId, selectedParameterKey, promptContent);
            setSuccessMessage(`Nó "${nodes.find(n => n.id === selectedNodeId)?.name}" atualizado com sucesso!`);
        } catch (e: any) {
            setError(e.message || "Falha ao atualizar o nó no n8n.");
        } finally {
            setIsUpdating(false);
        }
    };

    const baseInputClasses = "w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50";
    const canUpdate = !!promptContent && !!selectedWorkflowId && !!selectedNodeId && !!selectedParameterKey && !isUpdating;

    return (
        <div className="space-y-4">
            <div className="bg-yellow-900/50 border border-yellow-700/80 rounded-lg p-4 text-yellow-200">
                <h4 className="font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l5.394 10.332c.636 1.21-.213 2.719-1.439 2.719H4.302c-1.226 0-2.075-1.509-1.439-2.719L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    Ação Necessária: Configure o CORS no n8n
                </h4>
                <p className="text-xs mt-2">Para conectar, sua instância n8n precisa permitir requisições deste site. Adicione a seguinte variável de ambiente à sua configuração do n8n e reinicie o serviço:</p>
                <code className="block bg-slate-900/50 p-2 rounded-md text-xs font-mono my-2 break-all">N8N_CORS_ALLOW_ORIGIN=*</code>
                <p className="text-xs">Para mais segurança, substitua `*` pelo domínio exato deste app. 
                    <a href="https://docs.n8n.io/hosting/configuration/environment-variables/cors-and-security/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1 font-semibold">
                        Saiba mais.
                    </a>
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">URL da Instância n8n</label>
                <input
                    type="text"
                    value={config.url}
                    onChange={e => handleConfigChange('url', e.target.value)}
                    placeholder="https://suainstancia.n8n.cloud"
                    className={baseInputClasses}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Chave de API do n8n</label>
                <input
                    type="password"
                    value={config.apiKey}
                    onChange={e => handleConfigChange('apiKey', e.target.value)}
                    className={baseInputClasses}
                />
            </div>
            <button
                onClick={handleConnect}
                disabled={isLoading || !config.url || !config.apiKey}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
                {isLoading ? 'Conectando...' : 'Conectar e Buscar Workflows'}
            </button>

            {workflows.length > 0 && (
                <>
                    <div className="space-y-2 pt-2 border-t border-slate-700/50">
                        <label className="block text-sm font-medium text-slate-300">1. Selecione o Workflow</label>
                        <select value={selectedWorkflowId} onChange={e => setSelectedWorkflowId(e.target.value)} className={baseInputClasses}>
                            <option value="">-- Escolha um workflow --</option>
                            {workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
                        </select>
                    </div>
                    {nodes.length > 0 ? (
                        <>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    2. Selecione o Nó ({nodes.length} {nodes.length === 1 ? 'nó encontrado' : 'nós encontrados'})
                                </label>
                                <select value={selectedNodeId} onChange={e => setSelectedNodeId(e.target.value)} className={baseInputClasses}>
                                    <option value="">-- Escolha um nó --</option>
                                    {nodes.map(node => (
                                        <option key={node.id} value={node.id}>
                                            {node.name} ({node.type})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-400 mt-1">
                                    Dica: Procure por nodes de IA como Gemini, OpenAI, Anthropic, ou qualquer node que aceite prompts.
                                </p>
                            </div>
                            {selectedNodeId && (
                                <>
                                    {nodeParameters.length > 0 ? (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                3. Selecione o Campo do Prompt ({nodeParameters.length} {nodeParameters.length === 1 ? 'campo' : 'campos'} disponível{nodeParameters.length > 1 ? 'eis' : ''})
                                            </label>
                                            <select value={selectedParameterKey} onChange={e => setSelectedParameterKey(e.target.value)} className={baseInputClasses}>
                                                <option value="">-- Escolha um campo --</option>
                                                {nodeParameters.map(param => (
                                                    <option key={param} value={param}>
                                                        {param}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Campos encontrados automaticamente. Se o campo que você procura não aparecer, pode estar em um objeto aninhado.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-yellow-200 text-sm">
                                            <p className="font-semibold mb-1">⚠️ Nenhum campo de prompt encontrado</p>
                                            <p className="text-xs">
                                                Não encontramos campos de prompt neste node. Isso pode acontecer se:
                                            </p>
                                            <ul className="text-xs mt-1 ml-4 list-disc">
                                                <li>O node ainda não foi configurado</li>
                                                <li>Os prompts estão em uma estrutura muito aninhada</li>
                                                <li>Este node não usa prompts de texto</li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-300 text-sm text-center">
                            Nenhum node encontrado neste workflow.
                        </div>
                    )}
                    <button
                        onClick={handleUpdateNode}
                        disabled={!canUpdate}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {isUpdating ? 'Enviando...' : 'Enviar Prompt para o n8n'}
                    </button>
                </>
            )}

            {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
            {successMessage && <p className="text-sm text-green-400 text-center mt-2">{successMessage}</p>}
        </div>
    );
};