# Guia de Deploy na Vercel

Este guia explica como fazer o deploy do projeto na Vercel com deploy automático a cada push no GitHub.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Git instalado
3. Repositório no GitHub (ou outro Git provider)

## ⚡ Deploy Automático via GitHub (Recomendado)

**Esta é a forma mais fácil: configure uma vez e toda atualização no GitHub atualiza automaticamente na Vercel!**

Veja o arquivo `.github/SETUP_VERCEL.md` para instruções detalhadas.

### Resumo Rápido:
1. Acesse [vercel.com](https://vercel.com) > **Add New Project**
2. Importe o repositório `GenialIa25/labprompt`
3. Configure a variável `GEMINI_API_KEY`
4. Clique em **Deploy**
5. **Pronto!** Agora cada `git push` atualiza automaticamente na Vercel

## Método 1: Deploy via Dashboard da Vercel

### Passo 1: Preparar o Repositório
1. Certifique-se de que todos os arquivos estão commitados:
   ```bash
   git add .
   git commit -m "Preparar para deploy na Vercel"
   git push origin main
   ```

### Passo 2: Conectar Repositório na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New..." > "Project"
3. Importe o repositório `GenialIa25/labprompt`
4. A Vercel detectará automaticamente que é um projeto Vite

### Passo 3: Configurar Variáveis de Ambiente
1. Na página de configuração do projeto, vá em "Environment Variables"
2. Adicione a variável:
   - **Nome:** `GEMINI_API_KEY`
   - **Valor:** Sua chave da API do Gemini
   - **Ambientes:** Selecione Production, Preview e Development

### Passo 4: Deploy
1. Clique em "Deploy"
2. Aguarde o build completar (geralmente 1-2 minutos)
3. Sua aplicação estará disponível em `https://seu-projeto.vercel.app`

## Método 2: Deploy via CLI da Vercel

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```

### Passo 3: Deploy
1. Navegue até a pasta do projeto:
   ```bash
   cd labprompt
   ```

2. Execute o deploy:
   ```bash
   vercel
   ```

3. Siga as instruções no terminal:
   - Pressione Enter para confirmar o projeto
   - Pressione Enter para confirmar o diretório
   - Responda "No" quando perguntado sobre sobrescrever configurações (já temos vercel.json)

4. Configure as variáveis de ambiente:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   - Digite sua chave da API quando solicitado
   - Selecione os ambientes (Production, Preview, Development)

5. Para fazer deploy em produção:
   ```bash
   vercel --prod
   ```

## Configurações Importantes

### Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Variáveis de Ambiente Necessárias
- `GEMINI_API_KEY`: Chave da API do Google Gemini

## Troubleshooting

### Erro: "API_KEY environment variable not set"
- Certifique-se de que a variável `GEMINI_API_KEY` está configurada na Vercel
- Verifique se a variável está disponível para o ambiente correto (Production/Preview)

### Build falha
- Verifique os logs de build na Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm run build` localmente para verificar erros

### Aplicação não carrega
- Verifique se o `vercel.json` está configurado corretamente
- Certifique-se de que o `outputDirectory` está como `dist`

## URLs Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Documentação Vercel: https://vercel.com/docs
- Documentação Vite: https://vitejs.dev

