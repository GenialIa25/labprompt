

import React, { useState } from 'react';
import type { PromptData, OutputFormat, MasterPromptFormat } from '../types';
import { InputSection } from './InputSection';
import { FewShotExampleItem } from './FewShotExampleItem';
import { FluxoItem } from './FluxoItem';
import { VariavelDinamicaItem } from './VariavelDinamicaItem';
import { FerramentaItem } from './FerramentaItem';
import { DocumentUploader } from './DocumentUploader';
import { N8nIntegration } from './N8nIntegration';

interface N8nConfig {
    url: string;
    apiKey: string;
}

interface PromptInputFormProps {
  formData: PromptData;
  setFormData: React.Dispatch<React.SetStateAction<PromptData>>;
  onGenerate: () => void;
  isLoading: boolean;
  onGenerateExamples: () => void;
  isGeneratingExamples: boolean;
  n8nConfig: N8nConfig;
  setN8nConfig: React.Dispatch<React.SetStateAction<N8nConfig>>;
  activePromptContent: string;
}

const agentOutputFormats: OutputFormat[] = ['text', 'markdown', 'json', 'xml', 'yaml'];
const masterPromptFormats: MasterPromptFormat[] = ['markdown', 'json'];

export const PromptInputForm: React.FC<PromptInputFormProps> = ({ 
  formData, 
  setFormData, 
  onGenerate, 
  isLoading, 
  onGenerateExamples,
  isGeneratingExamples,
  n8nConfig,
  setN8nConfig,
  activePromptContent
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof PromptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...formData.regras];
    newRules[index] = value;
    handleInputChange('regras', newRules);
  };
  const addRule = () => handleInputChange('regras', [...formData.regras, '']);
  const removeRule = (index: number) => handleInputChange('regras', formData.regras.filter((_, i) => i !== index));

  const addExample = () => handleInputChange('exemplos', [...formData.exemplos, { id: crypto.randomUUID(), user: '', agent: '' }]);
  const updateExample = (id: string, field: 'user' | 'agent', value: string) => {
    handleInputChange('exemplos', formData.exemplos.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };
  const removeExample = (id: string) => handleInputChange('exemplos', formData.exemplos.filter(ex => ex.id !== id));

  const addVariavel = () => handleInputChange('variaveisDinamicas', [...formData.variaveisDinamicas, { id: crypto.randomUUID(), chave: '', valor: '' }]);
  const updateVariavel = (id: string, field: 'chave' | 'valor', value: string) => {
    handleInputChange('variaveisDinamicas', formData.variaveisDinamicas.map(v => v.id === id ? { ...v, [field]: value } : v));
  };
  const removeVariavel = (id: string) => handleInputChange('variaveisDinamicas', formData.variaveisDinamicas.filter(v => v.id !== id));

  const addFerramenta = () => handleInputChange('ferramentas', [...formData.ferramentas, { id: crypto.randomUUID(), nome: '', descricao: '' }]);
  const updateFerramenta = (id: string, field: 'nome' | 'descricao', value: string) => {
    handleInputChange('ferramentas', formData.ferramentas.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  const removeFerramenta = (id: string) => handleInputChange('ferramentas', formData.ferramentas.filter(f => f.id !== id));
  
  const addFluxo = () => {
    const newFluxo = {
      id: crypto.randomUUID(),
      nome: `Novo Fluxo ${formData.fluxos.length + 1}`,
      tipoPrompt: 'Resposta a Pergunta',
      objetivo: '',
      baseConhecimentoRAG: '',
      fewShotExamples: '',
      reforcarCoT: false,
      ativarGuardrails: false,
    };
    handleInputChange('fluxos', [...formData.fluxos, newFluxo]);
  };
  const updateFluxo = (id: string, updatedFluxo: any) => {
      handleInputChange('fluxos', formData.fluxos.map(f => f.id === id ? { ...f, ...updatedFluxo } : f));
  };
  const removeFluxo = (id: string) => handleInputChange('fluxos', formData.fluxos.filter(f => f.id !== id));

  const handleDataExtracted = (extractedData: Partial<PromptData>) => {
      setFormData(prev => ({
          ...prev,
          persona: extractedData.persona || prev.persona,
          objetivo: extractedData.objetivo || prev.objetivo,
          contextoNegocio: extractedData.contextoNegocio || prev.contextoNegocio,
          contexto: extractedData.contexto || prev.contexto,
          regras: extractedData.regras ? [...prev.regras, ...extractedData.regras.filter(r => r)] : prev.regras,
      }));
  };

  const baseInputClasses = "w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500";

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
        
        <DocumentUploader 
            onDataExtracted={handleDataExtracted}
            isLoading={isUploading}
            onLoadingChange={setIsUploading}
        />

        <InputSection title="1. Persona e Objetivo">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Persona</label>
              <textarea value={formData.persona} onChange={(e) => handleInputChange('persona', e.target.value)} rows={3} className={baseInputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Objetivo Principal</label>
              <textarea value={formData.objetivo} onChange={(e) => handleInputChange('objetivo', e.target.value)} rows={3} className={baseInputClasses} />
            </div>
          </div>
        </InputSection>
        
        <InputSection title="2. Contexto do Negócio">
             <textarea value={formData.contextoNegocio} onChange={(e) => handleInputChange('contextoNegocio', e.target.value)} rows={4} className={baseInputClasses} />
        </InputSection>
        
        <InputSection title="3. Contexto da Interação">
             <textarea value={formData.contexto} onChange={(e) => handleInputChange('contexto', e.target.value)} rows={4} className={baseInputClasses} />
        </InputSection>
        
        <InputSection title="4. Regras Invioláveis">
            <div className="space-y-2">
                {formData.regras.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input type="text" value={rule} onChange={e => handleRuleChange(index, e.target.value)} className={baseInputClasses} />
                        <button onClick={() => removeRule(index)} className="p-2 text-red-400 hover:text-red-300">&times;</button>
                    </div>
                ))}
                <button onClick={addRule} className="text-cyan-400 hover:text-cyan-300">+ Adicionar Regra</button>
            </div>
        </InputSection>

        <InputSection title="5. Exemplos (Few-Shot)">
          <div className="space-y-3">
            {formData.exemplos.map(ex => <FewShotExampleItem key={ex.id} example={ex} onUpdate={updateExample} onRemove={removeExample} />)}
             <div className="flex items-center space-x-4 pt-2">
                <button onClick={addExample} className="text-cyan-400 hover:text-cyan-300 font-medium">+ Adicionar Exemplo</button>
                <button 
                  onClick={onGenerateExamples} 
                  disabled={isGeneratingExamples || isLoading || isUploading}
                  className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-medium disabled:text-slate-500 disabled:cursor-wait"
                >
                  {isGeneratingExamples ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.43 2.58a1 1 0 00-1.412-.238l-4.148 2.963a1 1 0 00-.422.82v8.15a1 1 0 00.422.82l4.148 2.963a1 1 0 001.412-.238l4.148-2.963a1 1 0 00.422-.82v-2.438l2.148-1.534a1 1 0 00.422-.82v-1.5a1 1 0 00-.422-.82L14 6.838V4.399a1 1 0 00-.422-.82L9.43 2.58zM12 11.3v2.4l-2 1.428v-2.4L12 11.3zM10 9.9v2.4L8 10.872V8.47L10 9.9zM8 7.128L10 8.5v-2.4L8 4.672v2.456zM12 6.1v2.4L14 7.072V4.672L12 6.1z" /></svg>
                  )}
                  <span>Gerar com IA</span>
                </button>
            </div>
          </div>
        </InputSection>
        
        <InputSection title="6. Variáveis Dinâmicas">
          <div className="space-y-3">
            {formData.variaveisDinamicas.map(v => <VariavelDinamicaItem key={v.id} variavel={v} onUpdate={updateVariavel} onRemove={removeVariavel} />)}
            <button onClick={addVariavel} className="text-cyan-400 hover:text-cyan-300">+ Adicionar Variável</button>
          </div>
        </InputSection>
        
        <InputSection title="7. Ferramentas (Tools)">
          <div className="space-y-3">
            {formData.ferramentas.map(f => <FerramentaItem key={f.id} ferramenta={f} onUpdate={updateFerramenta} onRemove={removeFerramenta} />)}
            <button onClick={addFerramenta} className="text-cyan-400 hover:text-cyan-300">+ Adicionar Ferramenta</button>
          </div>
        </InputSection>
        
        <InputSection title="8. Fluxos de Interação">
            <div className="space-y-3">
                {formData.fluxos.map(fluxo => <FluxoItem key={fluxo.id} fluxo={fluxo} onUpdate={updateFluxo} onRemove={removeFluxo} />)}
                <button onClick={addFluxo} className="text-cyan-400 hover:text-cyan-300">+ Adicionar Fluxo</button>
            </div>
        </InputSection>

        <InputSection title="9. Formatos (Prompt e Agente)">
          <div className="space-y-4">
            <div className="p-3 bg-slate-800/50 border border-indigo-500/30 rounded-md">
              <label className="block text-sm font-bold text-indigo-300 mb-1">Formato do PROMPT MESTRE (Artefato Gerado)</label>
              <p className="text-xs text-slate-500 mb-2">Escolha como você quer que o prompt final seja estruturado.</p>
              <select value={formData.masterPromptFormat} onChange={e => handleInputChange('masterPromptFormat', e.target.value as MasterPromptFormat)} className={baseInputClasses}>
                {masterPromptFormats.map(f => (
                    <option key={f} value={f}>
                        {f.toUpperCase()}
                    </option>
                ))}
              </select>
            </div>
            <div className="p-3 bg-slate-800/50 border border-cyan-500/30 rounded-md">
              <label className="block text-sm font-bold text-cyan-300 mb-1">Formato de Resposta do AGENTE (Final)</label>
              <p className="text-xs text-slate-500 mb-2">Escolha como o agente deve responder ao usuário final.</p>
              <select value={formData.formatoSaida} onChange={e => handleInputChange('formatoSaida', e.target.value as OutputFormat)} className={baseInputClasses}>
                {agentOutputFormats.map(f => (
                    <option key={f} value={f}>
                        {f === 'text' ? 'TEXTO PURO (Chatbot/Natural)' : f.toUpperCase()}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Estrutura de Resposta Esperada (Opcional)</label>
              <textarea 
                value={formData.estruturaSaida} 
                onChange={(e) => handleInputChange('estruturaSaida', e.target.value)} 
                rows={3} 
                className={baseInputClasses} 
                placeholder="Ex: Comece com uma saudação, responda a pergunta e termine oferecendo mais ajuda."
            />
            </div>
          </div>
        </InputSection>

        <InputSection title="10. Tamanho e Complexidade">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tamanho Alvo do Prompt: <span className="font-bold text-cyan-400">{formData.promptSize.toLocaleString('pt-BR')}</span> caracteres</label>
                <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={formData.promptSize}
                    onChange={(e) => handleInputChange('promptSize', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    disabled={isUploading}
                />
                 <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Simples</span>
                    <span>Complexo</span>
                </div>
            </div>
        </InputSection>

        <InputSection title="11. Integração n8n">
            <N8nIntegration
                config={n8nConfig}
                setConfig={setN8nConfig}
                promptContent={activePromptContent}
            />
        </InputSection>
        
        <div className="pt-4 sticky bottom-0 bg-slate-800 -mx-4 px-4 pb-4">
            <button
                onClick={onGenerate}
                disabled={isLoading || isUploading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
                {isLoading ? 'Gerando...' : 'Gerar Prompt Mestre'}
            </button>
        </div>
    </div>
  );
};