<div align="center">
  <h1>🚀 LaBPrompT - Laboratório de Engenharia de Prompt</h1>
  <p>Uma plataforma completa para criar, testar, otimizar e gerenciar prompts de IA</p>
  
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-0.0.0-blue.svg" />
    <img alt="License" src="https://img.shields.io/badge/license-Private-red.svg" />
    <img alt="React" src="https://img.shields.io/badge/React-19.2.0-61dafb?logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6.2-646cff?logo=vite" />
  </p>
</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Desenvolvimento](#-desenvolvimento)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**LaBPrompT** (Laboratório de Engenharia de Prompt) é uma aplicação web moderna e completa para engenharia de prompts de IA. Desenvolvida para ajudar desenvolvedores, engenheiros de prompt e equipes a criar, testar, otimizar e gerenciar prompts de forma eficiente usando a API do Google Gemini.

### Por que usar o LaBPrompT?

- 🎨 **Interface Intuitiva**: Interface moderna e fácil de usar
- 🧪 **Teste em Tempo Real**: Teste seus prompts diretamente na interface
- 🔄 **Versionamento**: Mantenha histórico de todas as versões dos seus prompts
- 📊 **Otimização Inteligente**: Melhore seus prompts baseado em feedback real
- 💬 **Chat Interativo**: Converse com seus prompts para validar respostas
- 📄 **Análise de Documentos**: Extraia informações de documentos para criar prompts
- 🎤 **Assistente por Voz**: Preencha formulários usando comandos de voz
- 🔗 **Integração N8N**: Conecte seus prompts com workflows automatizados

---

## ✨ Funcionalidades

### 🎨 Criação de Prompts

- **Persona**: Defina a identidade e expertise do assistente
- **Objetivo Principal**: Especifique o objetivo central do prompt
- **Contexto do Negócio**: Adicione contexto sobre seu negócio
- **Contexto da Interação**: Descreva o cenário de uso
- **Regras Críticas**: Defina regras invioláveis que o agente deve seguir
- **Variáveis Dinâmicas**: Adicione variáveis que podem ser substituídas dinamicamente
- **Ferramentas (Tools)**: Defina ferramentas e funções disponíveis
- **Fluxos Específicos**: Crie fluxos de interação com diferentes configurações

### 📝 Exemplos Few-Shot

- Geração automática de exemplos de interação
- Adicione exemplos manualmente
- Use exemplos para melhorar o aprendizado do modelo

### 🧪 Teste e Validação

- **Chat em Tempo Real**: Converse com seu prompt para testar
- **Histórico de Conversas**: Mantenha histórico das interações
- **Feedback de Respostas**: Marque respostas como corretas ou incorretas
- **Correção de Respostas**: Corrija respostas para otimização

### 🔄 Otimização

- **Otimização Baseada em Feedback**: Melhore prompts baseado em correções
- **Instruções Manuais**: Adicione instruções específicas para otimização
- **Histórico de Versões**: Compare diferentes versões do prompt
- **Análise de Performance**: Veja melhorias entre versões

### 📄 Análise de Documentos

- Upload de documentos (PDF, TXT, MD, HTML, CSV)
- Extração automática de informações do documento
- Preenchimento automático de campos do prompt

### 🎤 Assistente por Voz

- Preencha formulários usando comandos de voz
- Transcrição automática de áudio
- Integração com o modelo Gemini para processamento

### 📊 Gerenciamento

- **Versionamento**: Mantenha histórico de todas as versões
- **Exportação**: Exporte prompts em diferentes formatos (Markdown, JSON)
- **Documentação**: Gere documentação automática dos prompts
- **Histórico Completo**: Acesse versões anteriores a qualquer momento

### 🔗 Integrações

- **Integração N8N**: Conecte seus prompts com workflows N8N
- **API Gemini**: Integração nativa com Google Gemini API
- **Exportação PDF**: Exporte prompts e documentação em PDF

### 🎨 Formatos Suportados

- **Formato de Saída do Agente**: JSON, Markdown, Text, XML, YAML
- **Formato do Prompt Mestre**: Markdown ou JSON
- **Tamanho Customizável**: Defina o tamanho desejado do prompt

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19.2.0** - Biblioteca para construção de interfaces
- **TypeScript 5.8** - Tipagem estática para JavaScript
- **Vite 6.2** - Build tool e dev server rápido
- **Tailwind CSS** - Framework CSS utility-first

### Backend/Services

- **@google/genai 1.28.0** - SDK oficial do Google Gemini
- **UUID** - Geração de identificadores únicos

### Ferramentas de Desenvolvimento

- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderno
- **ESLint** - Linter para JavaScript/TypeScript

### Deploy

- **Vercel** - Plataforma de deploy e hosting
- **GitHub Actions** - CI/CD automatizado

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 18+ (recomendado: Node.js 20+)
- **npm** ou **yarn** ou **pnpm**
- **Git** (para clonar o repositório)
- **Chave da API do Google Gemini** ([Obter aqui](https://makersuite.google.com/app/apikey))

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/GenialIa25/labprompt.git
cd labprompt
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

ou

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env.local` com suas chaves reais. Ele já está no `.gitignore`.

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `GEMINI_API_KEY` | Chave da API do Google Gemini | ✅ Sim |

### Obter Chave da API Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Adicione no arquivo `.env.local`

---

## 📖 Como Usar

### 1. Criar um Novo Prompt

1. Preencha os campos do formulário:
   - **Persona**: Defina quem é o assistente
   - **Objetivo**: O que o assistente deve fazer
   - **Contexto do Negócio**: Informações sobre o negócio
   - **Contexto da Interação**: Cenário de uso
   - **Regras**: Regras que o assistente deve seguir

2. Configure formatos:
   - **Formato de Saída**: Como o agente deve responder (JSON, Text, etc.)
   - **Formato do Prompt**: Como o prompt mestre será formatado
   - **Tamanho**: Quantos caracteres aproximadamente

3. Adicione elementos opcionais:
   - Variáveis dinâmicas
   - Ferramentas (tools)
   - Exemplos few-shot
   - Fluxos específicos

4. Clique em **"Gerar Prompt Mestre"**

### 2. Testar o Prompt

1. Após gerar o prompt, selecione uma versão no painel de histórico
2. Clique em **"Iniciar Chat"**
3. Converse com o prompt para testar
4. Marque respostas como corretas ou incorretas
5. Corrija respostas incorretas

### 3. Otimizar o Prompt

1. Após testar, vá para a aba **"Otimizar"**
2. Adicione pares de correção (resposta antiga → resposta nova)
3. Adicione instruções manuais (opcional)
4. Clique em **"Otimizar Prompt"**
5. Uma nova versão será criada automaticamente

### 4. Gerenciar Versões

- Veja todas as versões no painel lateral
- Compare versões diferentes
- Restaure versões anteriores
- Exporte versões em diferentes formatos

### 5. Análise de Documentos

1. Clique no botão **"Upload de Documento"**
2. Arraste e solte ou selecione um arquivo (PDF, TXT, MD, etc.)
3. O sistema extrairá automaticamente informações
4. Os campos do formulário serão preenchidos

### 6. Assistente por Voz

1. Vá para a aba **"Assistente"**
2. Clique em **"Iniciar Gravação"**
3. Fale seus comandos
4. O sistema transcreverá e preencherá os campos

### 7. Gerar Documentação

1. Selecione uma versão do prompt
2. Clique em **"Explicar Prompt"**
3. Uma documentação completa será gerada automaticamente
4. Você pode exportar em PDF

---

## 📁 Estrutura do Projeto

```
labprompt/
├── .github/
│   ├── workflows/
│   │   └── deploy-vercel.yml    # Workflow de deploy automático
│   └── SETUP_VERCEL.md          # Guia de setup Vercel
├── components/                   # Componentes React
│   ├── AssistantPanel.tsx       # Painel do assistente por voz
│   ├── ChatInterface.tsx        # Interface de chat
│   ├── DocumentUploader.tsx     # Upload de documentos
│   ├── ExplanationModal.tsx     # Modal de explicação
│   ├── FerramentaItem.tsx       # Item de ferramenta
│   ├── FewShotExampleItem.tsx   # Item de exemplo few-shot
│   ├── FluxoItem.tsx            # Item de fluxo
│   ├── Header.tsx               # Cabeçalho
│   ├── HistoryPanel.tsx         # Painel de histórico
│   ├── InputSection.tsx         # Seção de input
│   ├── JsonDisplay.tsx          # Exibição JSON
│   ├── N8nIntegration.tsx       # Integração N8N
│   ├── OutputDisplay.tsx        # Exibição de output
│   ├── PasteModal.tsx           # Modal de colar
│   ├── PromptInputForm.tsx      # Formulário de input
│   ├── PromptManager.tsx        # Gerenciador principal
│   ├── PromptOptimizer.tsx      # Otimizador de prompts
│   └── TabbedPanel.tsx          # Painel com abas
├── services/                     # Serviços
│   ├── geminiService.ts         # Serviço Gemini API
│   └── n8nService.ts            # Serviço N8N
├── App.tsx                       # Componente principal
├── constants.ts                  # Constantes
├── index.html                    # HTML principal
├── index.tsx                     # Ponto de entrada
├── metadata.json                 # Metadados
├── package.json                  # Dependências
├── tsconfig.json                 # Config TypeScript
├── types.ts                      # Tipos TypeScript
├── vercel.json                   # Config Vercel
├── vite.config.ts                # Config Vite
├── DEPLOY_AUTOMATICO.md          # Guia de deploy automático
├── DEPLOY_VERCEL.md              # Guia de deploy Vercel
└── README.md                     # Este arquivo
```

---

## 🚀 Deploy

### Deploy Automático na Vercel (Recomendado)

O projeto está configurado para deploy automático na Vercel. Cada push no GitHub atualiza automaticamente a aplicação.

#### Passos Rápidos:

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório `GenialIa25/labprompt`
4. Adicione a variável de ambiente `GEMINI_API_KEY`
5. Clique em **"Deploy"**

**Pronto!** Agora cada `git push` atualiza automaticamente na Vercel.

📖 Para mais detalhes, consulte:
- [`DEPLOY_AUTOMATICO.md`](./DEPLOY_AUTOMATICO.md) - Guia rápido
- [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md) - Guia completo
- [`.github/SETUP_VERCEL.md`](./.github/SETUP_VERCEL.md) - Setup detalhado

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

### Estrutura de Desenvolvimento

- **Desenvolvimento**: `npm run dev` (porta 3000)
- **Build**: `npm run build` (gera pasta `dist/`)
- **Preview**: `npm run preview` (preview do build)

### Adicionando Novas Funcionalidades

1. Crie componentes em `components/`
2. Adicione serviços em `services/`
3. Defina tipos em `types.ts`
4. Use os serviços existentes como referência

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript
- Siga os padrões de formatação existentes
- Adicione comentários quando necessário
- Mantenha componentes pequenos e focados

---

## 📝 Licença

Este projeto é privado e não possui licença pública.

---

## 🙏 Agradecimentos

- [Google Gemini](https://gemini.google.com/) - API de IA
- [React](https://react.dev/) - Biblioteca de UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel](https://vercel.com/) - Plataforma de deploy

---

## 📞 Suporte

Para dúvidas, problemas ou sugestões:

- Abra uma [Issue](../../issues) no GitHub
- Entre em contato com a equipe de desenvolvimento

---

<div align="center">
  <p>Feito com ❤️ usando React + TypeScript + Vite</p>
  <p>© 2024 LaBPrompT - Laboratório de Engenharia de Prompt</p>
</div>
