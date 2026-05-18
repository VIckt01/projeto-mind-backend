# MindConsulting Blog — API (Backend)

API RESTful em Node.js + Express para gerenciamento de artigos, usuários, curtidas, visualizações e comentários.

---

## 📦 Dependências principais

- Produção: `express`, `@prisma/client`, `mysql2`, `multer`, `jsonwebtoken`, `cors`, `axios`.
- Desenvolvimento: `typescript`, `prisma`, `ts-node-dev` e tipos: `@types/express`, `@types/multer`, `@types/jsonwebtoken`, `@types/cors`.

> Ver `package.json` para a lista completa de dependências.

---

## 🗺️ Resumo rápido das rotas

- `POST /auth/register` — criar conta
- `POST /auth/login` — autenticar e receber token JWT
- `GET /auth/me/:id` — dados do perfil
- `GET /article` — listar artigos
- `GET /article/home` — artigos para a home (Destaques + Recentes)
- `GET /article/slug/:slug` — artigo por slug (público)
- `GET /article/id/:id` — carregar artigo por ID (edição)
- `POST /article` — criar artigo (autenticado)
- `PUT /article/:id` — atualizar artigo (autenticado)
- `DELETE /article/:id` — excluir artigo (autenticado)
- `POST /comment` — criar comentário (autenticado)
- `PUT /comment/:id` — editar comentário (autor)
- `DELETE /comment/:id` — excluir comentário (autor/admin)

---

## 📁 Estrutura do projeto

blog-backend/

- prisma/ — schema e migrações
- src/
  - @types/ — tipos do Express
  - config/ — configurações (ex.: `multer`)
  - controllers/ — controle das rotas
  - middlewares/ — `isAuthenticated`, etc.
  - routes/ — definição das rotas
  - services/ — regras de negócio e acesso ao Prisma
  - utils/ — funções utilitárias
  - server.ts — inicialização do servidor
- dump.sql, package.json, README.md

---

## 🚀 Como rodar o projeto (local)

Siga estes passos rápidos para executar a API em ambiente de desenvolvimento.

1. Instale dependências

```bash
npm install
```

2. Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias.
   Exemplo mínimo (substitua valores conforme seu ambiente):

```env
# URL de conexão com MySQL (exemplo com senha contendo caracteres especiais)
DATABASE_URL="mysql://root:SuaSenha@localhost:3306/blog_db"

# Chave secreta para JWT
JWT_SECRET=uma_chave_secreta_segura

# Porta opcional (padrão 5000 se não definido)
PORT=5000
```

3. Rodar migrações do Prisma (se precisar criar/atualizar o banco):

```bash
npx prisma migrate deploy   # em produção
npx prisma migrate dev      # durante desenvolvimento
```

4. Iniciar em modo desenvolvimento (recarregamento automático):

```bash
npm run dev
```

Comandos úteis (ver `package.json`):

- `npm run dev` — inicia com `ts-node-dev` (hot reload)
- `npm run build` — compila TypeScript para `dist/`
- `npm start` — inicia a versão compilada (após `npm run build`)
