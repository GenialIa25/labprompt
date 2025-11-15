

export type OutputFormat = 'json' | 'markdown' | 'text' | 'xml' | 'yaml';
export type MasterPromptFormat = 'markdown' | 'json';

export interface VariavelDinamica {
  id: string;
  chave: string;
  valor: string;
}

export interface Ferramenta {
  id:string;
  nome: string;
  descricao: string;
}

export interface PromptData {
  persona: string;
  objetivo: string;
  contextoNegocio: string;
  contexto: string;
  regras: string[];
  exemplos: FewShotExample[];
  variaveisDinamicas: VariavelDinamica[];
  ferramentas: Ferramenta[];
  formatoSaida: OutputFormat; // Formato de resposta do AGENTE
  masterPromptFormat: MasterPromptFormat; // NOVO: Formato do PROMPT MESTRE
  estruturaSaida: string;
  fluxos: Fluxo[];
  promptSize: number;
}

export interface PromptVersion {
  id: string;
  version: number;
  content: string;
  format: OutputFormat; // Mantemos o formato de saída do agente aqui para referência
  masterFormat: MasterPromptFormat; // NOVO
  timestamp: string;
  sourceData: PromptData;
}

export interface ChatMessage {
  author: 'user' | 'agent';
  text: string;
  feedback?: 'correct' | 'incorrect';
  isEditing?: boolean;
  correction?: string;
}

export interface OptimizationPair {
  id: string;
  userQuery: string;
  originalResponse: string;
  correctedResponse: string;
}

export interface FewShotExample {
  id: string;
  user: string;
  agent: string;
}

export interface Fluxo {
  id: string;
  nome: string;
  tipoPrompt: string;
  objetivo: string;
  baseConhecimentoRAG: string;
  fewShotExamples: string;
  reforcarCoT: boolean;
  ativarGuardrails: boolean;
}

// N8N Integration Types
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
}

export interface N8nNode {
  parameters: Record<string, any>;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  id: string;
}
