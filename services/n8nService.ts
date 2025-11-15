import type { N8nWorkflow, N8nNode } from '../types';

interface N8nApiConfig {
    url: string;
    apiKey: string;
}

// Helper para padronizar as chamadas fetch
const n8nFetch = async (endpoint: string, config: N8nApiConfig, options: RequestInit = {}) => {
    // Garante que a URL não tenha barras duplas
    const apiUrl = `${config.url.replace(/\/$/, '')}/api/v1${endpoint}`;
    
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
    };

    try {
        const response = await fetch(apiUrl, { ...options, headers });

        if (!response.ok) {
            let errorMessage = `Erro na API do n8n: ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }
        
        if (response.status === 204) { // No Content
            return null;
        }

        return response.json();
    } catch (error: any) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error(
                'Falha na conexão (Failed to fetch). Isso geralmente é um problema de CORS. Verifique se a sua instância n8n está configurada para aceitar requisições deste domínio.'
            );
        }
        throw error;
    }
};

export const fetchWorkflows = async (config: N8nApiConfig): Promise<N8nWorkflow[]> => {
    const response = await n8nFetch('/workflows', config);
    return response.data;
};

// n8n não tem um endpoint para buscar nós de um workflow, então buscamos o workflow inteiro
export const fetchWorkflowDetails = async (config: N8nApiConfig, workflowId: string): Promise<{ nodes: N8nNode[] }> => {
    const response = await n8nFetch(`/workflows/${workflowId}`, config);
    return response; // A resposta da API já contém a estrutura com os nós
};

export const updateNodeParameter = async (
    config: N8nApiConfig,
    workflowId: string,
    nodeId: string,
    parameterKey: string,
    promptContent: string
): Promise<void> => {
    // 1. Obter o estado atual do workflow
    const workflow = await n8nFetch(`/workflows/${workflowId}`, config);

    // 2. Encontrar e modificar o nó
    const nodeIndex = workflow.nodes.findIndex((n: N8nNode) => n.id === nodeId);
    if (nodeIndex === -1) {
        throw new Error(`Nó com ID "${nodeId}" não encontrado no workflow.`);
    }

    // Cria uma cópia profunda para evitar mutação direta
    const updatedWorkflow = JSON.parse(JSON.stringify(workflow));
    
    // Atualiza o parâmetro
    updatedWorkflow.nodes[nodeIndex].parameters[parameterKey] = promptContent;

    // 3. Enviar o workflow modificado de volta via PUT
    await n8nFetch(`/workflows/${workflowId}`, config, {
        method: 'PUT',
        body: JSON.stringify(updatedWorkflow),
    });
};