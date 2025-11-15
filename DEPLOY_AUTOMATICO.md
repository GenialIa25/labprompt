# 🚀 Deploy Automático: GitHub → Vercel

Configure uma vez e toda atualização no GitHub atualiza automaticamente na Vercel!

## ⚡ Configuração Rápida (5 minutos)

### Passo 1: Conectar GitHub na Vercel

1. Acesse: https://vercel.com/login
2. Faça login (pode usar sua conta GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Clique em **"Import Git Repository"**
5. Procure e selecione: **`GenialIa25/labprompt`**
6. Clique em **"Import"**

### Passo 2: Configurar o Projeto

Na tela de configuração:

1. **Framework Preset:** Vite (detectado automaticamente)
2. **Root Directory:** Deixe em branco (se o projeto estiver na raiz) ou `./labprompt` se estiver em subpasta
3. **Build Command:** `npm run build` (já vem preenchido)
4. **Output Directory:** `dist` (já vem preenchido)
5. **Install Command:** `npm install` (já vem preenchido)

### Passo 3: Adicionar Variável de Ambiente

1. Clique em **"Environment Variables"**
2. Adicione:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Sua chave da API do Gemini
   - **Environments:** Marque todas (Production, Preview, Development)
3. Clique em **"Add"**

### Passo 4: Deploy

1. Clique no botão **"Deploy"**
2. Aguarde 1-2 minutos
3. **Pronto!** 🎉

## ✨ Como Funciona Agora

A partir de agora, **TODA VEZ** que você fizer:

```bash
git add .
git commit -m "Minhas alterações"
git push origin main
```

A Vercel **automaticamente**:
- ✅ Detecta o push
- ✅ Faz build do projeto
- ✅ Faz deploy na produção
- ✅ Atualiza sua aplicação online

## 📍 Onde Ver Meu Deploy?

- **URL da aplicação:** Aparece no dashboard da Vercel após o deploy
- **Histórico de deploys:** Dashboard Vercel → Seu Projeto → Deployments
- **Status:** Cada deploy mostra status (Ready, Building, Error, etc.)

## 🔄 Deploy em Preview (Pull Requests)

Quando você criar um **Pull Request** no GitHub:
- A Vercel cria um **deploy de preview** automaticamente
- Você recebe um comentário no PR com o link
- Perfeito para testar antes de fazer merge!

## 🛠️ Verificando Configurações

No dashboard da Vercel:
- **Settings** → **Git:** Veja qual repositório está conectado
- **Settings** → **Environment Variables:** Veja/adicione variáveis
- **Settings** → **General:** Veja configurações de build

## ❓ Problemas Comuns

### Deploy não inicia automaticamente
- Verifique se o repositório está conectado: **Settings** → **Git**
- Certifique-se de estar fazendo push na branch `main` ou `master`

### Build falha
- Veja os logs: **Deployments** → Clique no deploy → **Build Logs**
- Certifique-se de que `GEMINI_API_KEY` está configurada

### Aplicação não funciona
- Verifique se a variável `GEMINI_API_KEY` está configurada
- Veja os logs de erro no console do navegador (F12)

## 🎯 Próximos Passos

1. ✅ Configure o deploy automático (você está aqui)
2. ✅ Faça seu primeiro push e veja a mágica acontecer
3. ✅ Compartilhe a URL com sua equipe
4. ✅ Configure domínio customizado (opcional)

---

**Pronto! Agora você tem deploy automático configurado!** 🚀

Toda atualização no GitHub = Nova versão online automaticamente!

