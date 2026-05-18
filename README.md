# TechBlog API - Backend

Esta é a API RESTful desenvolvida em Node.js e Express que gerencia o ecossistema de conteúdo, usuários, curtidas, visualizações e comentários do TechBlog.

---

## 📦 Dependências do Projeto

Para que a API funcione perfeitamente, os seguintes pacotes são gerenciados e instalados no ambiente:

### Dependências de Produção (`dependencies`)
* **`express`**: Framework minimalista para gerenciamento de rotas, middlewares e requisições HTTP.
* **`@prisma/client`**: Cliente do ORM Prisma utilizado para realizar consultas e manipulação de dados no banco.
* **`mysql2`**: Driver de conexão que permite ao Prisma se comunicar de forma performática com o banco de dados MySQL.
* **`multer`**: Middleware para processamento de requisições `multipart/form-data`, utilizado no upload de imagens de capa e fotos de perfil.
* **`jsonwebtoken` (JWT)**: Biblioteca para geração e validação de tokens de segurança no controle de acessos.
* **`cors`**: Middleware para liberação de acessos, permitindo que a aplicação frontend consuma os dados da API com segurança.
* **`axios`**: Cliente HTTP utilizado para possíveis integrações externas de serviços.

### Dependências de Desenvolvimento (`devDependencies`)
* **`typescript`**: Adiciona tipagem estática e recursos modernos do JavaScript ao projeto.
* **`prisma`**: Interface de linha de comando (CLI) do ORM para rodar migrações e gerenciar o banco de dados.
* **`ts-node-dev`**: Ferramenta que compila e reinicia o servidor automaticamente em tempo de execução a cada alteração no código.
* **`@types/express` / `@types/multer` / `@types/jsonwebtoken` / `@types/cors`**: Pacotes que adicionam as tipagens do TypeScript para as respectivas bibliotecas.

---

## 🗺️ Espelho das Rotas da API

A API segue o padrão arquitetural REST e expõe os seguintes endpoints:

### 👤 Autenticação e Usuários (`/auth` ou `/user`)
* `POST /auth/register` - Cria uma nova conta de usuário.
* `POST /auth/login` - Autentica o usuário e retorna o token JWT.
* `GET /auth/me/:id` - Busca dados completos do perfil do usuário para a página de configurações.
* `GET /article/user/me` - *(Requer Token)* Retorna a lista de artigos criados especificamente pelo usuário logado (usado no Dashboard).
* `PUT /auth/profile` - *(Requer Token)* Atualiza os dados de perfil (Nome, Email, Bio e foto de avatar).

### 📝 Artigos (`/article`)
* `GET /article` - Lista todos os artigos disponíveis no acervo técnico (com suporte a paginação/filtros).
* `GET /article/home` - Retorna os artigos divididos estritamente entre **Destaques** e **Recentes** para a página principal.
* `GET /article/slug/:slug` - Busca os detalhes de um artigo específico utilizando o slug (para SEO e leitura pública).
* `GET /article/id/:id` - Busca os dados brutos de um artigo pelo ID (utilizado para carregar a tela de edição).
* `POST /article` - *(Requer Token)* Cria uma nova postagem enviando os metadados e o arquivo de imagem de capa.
* `PUT /article/:id` - *(Requer Token)* Modifica os dados de uma postagem existente pelo ID.
* `DELETE /article/:id` - *(Requer Token)* Remove permanentemente uma postagem do sistema.

### 💬 Comentários (`/comment`)
* `POST /comment` - *(Requer Token)* Cria um novo comentário vinculado a um artigo.
* `PUT /comment/:id` - *(Requer Token)* Permite ao autor editar o texto do seu comentário.
* `DELETE /comment/:id` - *(Requer Token)* Permite ao autor ou administrador excluir um comentário do sistema.

---

## 📁 Estrutura de Pastas do Projeto

O código está estruturado utilizando o modelo de arquitetura em camadas orientado a classes:

```text
blog-backend/
├── prisma/
│   └── schema.prisma    # Modelagem das tabelas MySQL e relacionamentos
├── src/
│   ├── @types/          # Guarda as definições de tipo globais do Express.
│   │       └── express
│   ├── config/          # Configurações do Multer e conexões
│   ├── controllers/     # Classes que interceptam o HTTP e orquestram as respostas
│   ├── middlewares/     # Validação de tokens JWT (`isAuthenticated`)
│   ├── routes/          # Arquivos de definição de rotas expostas
│   ├── services/        # Regras de negócio e comunicação direta com o Prisma
    ├── utils/           # Guardar funções genéricas e isoladas que fazem tarefas repetitivas
│   └── server.ts        # Arquivo de inicialização do servidor Express
├── dump.sql             # Estrutura e backup inicial do banco de dados
├── package.json         # Manifesto do projeto e listagem de dependências
└── README.md            # Documentação técnica do repositório