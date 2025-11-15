# Configuração de Deploy Automático Vercel via GitHub

Este guia explica como configurar o deploy automático na Vercel a cada push no GitHub.

## Método Recomendado: Conexão Direta GitHub + Vercel (Mais Simples)

Esta é a forma mais fácil e recomendada pela Vercel:

### Passo 1: Conectar Repositório na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Vá para [Dashboard](https://vercel.com/dashboard)
3. Clique em **"Add New..."** > **"Project"**
4. Clique em **"Import Git Repository"**
5. Selecione o repositório `GenialIa25/labprompt`
6. Autorize o acesso se necessário

### Passo 2: Configurar o Projeto

1. **Framework Preset:** A Vercel detectará automaticamente como "Vite"
2. **Root Directory:** Se o projeto estiver na raiz, deixe em branco. Se estiver em uma subpasta, especifique `./labprompt`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

### Passo 3: Adicionar Variáveis de Ambiente

1. Na seção **"Environment Variables"**, adicione:
   - **Nome:** `GEMINI_API_KEY`
   - **Valor:** Sua chave da API do Gemini
   - **Ambientes:** Selecione Production, Preview e Development

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o primeiro deploy completar
3. **Pronto!** Agora, cada vez que você fizer `git push`, a Vercel automaticamente fará um novo deploy

## Método Alternativo: GitHub Actions (Mais Controle)

Se você quiser usar GitHub Actions em vez da conexão direta:

### Passo 1: Obter Tokens da Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard) > **Settings** > **Tokens**
2. Crie um novo token e copie o valor
3. No projeto Vercel, vá em **Settings** > **General** e copie:
   - **Vercel Org ID**
   - **Vercel Project ID**

### Passo 2: Adicionar Secrets no GitHub

1. Vá para o repositório no GitHub: `https://github.com/GenialIa25/labprompt`
2. Clique em **Settings** > **Secrets and variables** > **Actions**
3. Adicione os seguintes secrets:
   - `VERCEL_TOKEN`: Token criado na Vercel
   - `VERCEL_ORG_ID`: ID da organização Vercel
   - `VERCEL_PROJECT_ID`: ID do projeto Vercel
   - `GEMINI_API_KEY`: Sua chave da API do Gemini

### Passo 3: Fazer Push no Código

```bash
git add .
git commit -m "Configurar deploy automático"
git push origin main
```

O workflow `.github/workflows/deploy-vercel.yml` será executado automaticamente!

## Como Funciona

- **A cada push na branch `main` ou `master`:** Deploy automático em produção
- **A cada Pull Request:** Deploy de preview para testar
- **Notificações:** A Vercel enviará um comentário no PR com o link do preview

## Verificando o Status

- **No GitHub:** Vá para **Actions** para ver o status dos workflows
- **Na Vercel:** Veja o histórico de deploys no dashboard
- **Links:** Cada deploy terá uma URL única

## Troubleshooting

### Deploy não inicia automaticamente
- Verifique se o repositório está conectado na Vercel
- Certifique-se de que está fazendo push na branch `main` ou `master`

### Build falha
- Verifique os logs na aba **Deployments** da Vercel
- Certifique-se de que a variável `GEMINI_API_KEY` está configurada

### GitHub Actions falha
- Verifique se todos os secrets estão configurados corretamente
- Veja os logs na aba **Actions** do GitHub

## Recomendação

**Use o Método Recomendado (Conexão Direta)** pois:
- ✅ Mais simples de configurar
- ✅ Sem necessidade de secrets no GitHub
- ✅ Interface visual melhor
- ✅ Notificações automáticas
- ✅ Rollback fácil

