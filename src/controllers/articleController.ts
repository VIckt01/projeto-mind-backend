import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// FUNÇÃO AUXILIAR: Transforma o título em um link amigável (Slug)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_]+/g, '-') // Substitui espaços por hífens
    .replace(/^-+|-+$/g, ''); // Limpa hífens extras nas pontas
};

// CRIAR ARTIGO (Alterado req para 'any' para aceitar o arquivo do Multer)
export const createArticle = async (req: any, res: Response): Promise<void> => {
  try {
    const { title, content, authorId } = req.body;

    // Pega o arquivo enviado pelo Multer e transforma em binário (Buffer)
    const bannerBuffer = req.file ? req.file.buffer : null;

    // Geração automática do Slug e do Excerpt (Resumo do artigo)
    const slug = generateSlug(title);
    const excerpt = content ? content.substring(0, 120) + '...' : '';

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,      // ◄— Injetado
        excerpt,   // ◄— Injetado
        content,
        banner: bannerBuffer,
        authorId: Number(authorId), // Garante que o ID do autor seja um número
      },
    });

    res.status(201).json({ message: 'Artigo publicado com sucesso!', article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar artigo.' });
  }
};

// LISTAR TODOS OS ARTIGOS (Aqui continua normal)
export const getAllArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar artigos.' });
  }
};

// BUSCAR UM ARTIGO POR SLUG (Registra e incrementa +1 visualização)
export const getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Incrementa a view e busca o artigo em uma única operação segura
    const article = await prisma.article.update({
      where: { slug: String(slug) }, // ◄— Envolva com String() para garantir o tipo correto
      data: {
        views: { increment: 1 }
      },
      include: {
        author: { select: { name: true, avatarUrl: true } }
      }
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ error: 'Artigo não encontrado.' });
  }
};

// LISTAR ARTIGOS DE UM USUÁRIO ESPECÍFICO (Exclusivo para o Dashboard)
export const getArticlesByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const articles = await prisma.article.findMany({
      where: { authorId: Number(id) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os artigos do usuário.' });
  }
};

// BUSCAR UM ARTIGO POR ID
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: { author: { select: { name: true } } },
    });

    if (!article) {
      res.status(404).json({ error: 'Artigo não encontrado.' });
      return;
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o artigo.' });
  }
};

// EDITAR ARTIGO (Alterado req para 'any' também por causa da imagem)
export const updateArticle = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Se o usuário enviou uma imagem nova, atualiza. Se não, mantém a antiga.
    const dataUpdate: any = { title, content };
    
    // Atualiza também o slug e o resumo caso o título ou o texto mudem
    if (title) dataUpdate.slug = generateSlug(title);
    if (content) dataUpdate.excerpt = content.substring(0, 120) + '...';

    if (req.file) {
      dataUpdate.banner = req.file.buffer;
    }

    const updated = await prisma.article.update({
      where: { id: Number(id) },
      data: dataUpdate,
    });

    res.status(200).json({ message: 'Artigo atualizado com sucesso!', article: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar artigo.' });
  }
};

// DELETAR ARTIGO
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Artigo removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar artigo.' });
  }
};