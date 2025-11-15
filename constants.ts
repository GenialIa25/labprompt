import type { PromptData } from './types';

export const INITIAL_PROMPT_DATA: PromptData = {
  persona: 'Você é um assistente de IA prestativo e especialista no assunto X.',
  objetivo: 'O objetivo principal é responder perguntas sobre Y de forma clara e concisa.',
  contextoNegocio: 'A Empresa X é líder de mercado em soluções de software para pequenas e médias empresas. Nosso principal produto é o "Software Y", que ajuda na automação de tarefas de marketing.',
  contexto: 'O usuário está interagindo com você através de um chat em nosso website. Ele pode ter dúvidas sobre funcionalidades, preços, ou solução de problemas comuns.',
  regras: [
    'Seja sempre educado e profissional.',
    'Não forneça informações falsas ou enganosas.',
    'Se não souber a resposta, admita e diga que não pode ajudar com aquela questão específica.',
  ],
  exemplos: [],
  variaveisDinamicas: [],
  ferramentas: [],
  formatoSaida: 'text', // Padrão alterado para texto, já que é o mais comum para chatbots
  masterPromptFormat: 'markdown', // Novo padrão
  estruturaSaida: 'Responda em um parágrafo curto, seguido por uma lista de pontos chave.',
  fluxos: [],
  promptSize: 5000
};