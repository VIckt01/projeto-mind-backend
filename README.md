# TechBlog API - Backend

Esta é a API RESTful desenvolvida em Node.js e Express que gerencia o ecossistema de conteúdo, usuários e interações do TechBlog.

## 🚀 Tecnologias Utilizadas
- **Node.js** & **Express**
- **Prisma ORM**
- **MySQL** (Banco de Dados)
- **Multer** (Upload de arquivos/imagens)

## 🎨 Funcionalidades do Sistema
- **Autenticação:** Rota `/me` para validação e persistência da sessão do usuário logado através de tokens JWT.
- **Perfil do Autor:** Atualização de biografia, tipo de conta e gerenciamento de foto de avatar (salva em formato Buffer no banco de dados).
- **Artigos:** CRUD completo contendo título, conteúdo estruturado, resumo (excerpt), slug automático para SEO, imagem de capa, curtidas e contagem de visualizações.
- **Feed da Home:** Filtros nativos para listar automaticamente os posts mais engajados (Destaques) e as postagens mais recentes.
- **Comentários:** CRUD completo de interações de comentários atrelados a artigos com tratamento de concorrência de rotas.

## 📦 Como Rodar o Projeto
1. Instale as dependências:
   ```bash
   npm install