import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CRIAR ARTIGO (Alterado req para 'any' para aceitar o arquivo do Multer)
export const createArticle = async (req: any, res: Response): Promise<void> => {
  try {
    const { title, content, authorId } = req.body;

    // Pega o arquivo enviado pelo Multer e transforma em binário (Buffer)
    const bannerBuffer = req.file ? req.file.buffer : null;

    const newArticle = await prisma.article.create({
      data: {
        title,
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