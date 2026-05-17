import { Request, Response } from 'express';
import { ArticleService } from '../../services/article/ArticleService'; 

interface getArticleByIdDTO {
  slug:string
}

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  // 1. CRIAR ARTIGO
  createArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { title, content, authorId } = req.body;
      const bannerBuffer = req.file ? req.file.buffer : null;

      const result = await this.articleService.createArticle({ 
        title, content, authorId, bannerBuffer 
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar artigo.' });
    }
  }

  // 2. LISTAR TODOS OS ARTIGOS
  getAllArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.getAllArticles();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar artigos.' });
    }
  }

  // 3. BUSCAR UM ARTIGO POR SLUG
  getArticleBySlug = async (req: Request<getArticleByIdDTO>, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const result = await this.articleService.getArticleBySlug(slug);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: 'Artigo não encontrado.' });
    }
  }

  // 4. LISTAR ARTIGOS DE UM USUÁRIO ESPECÍFICO
  getArticlesByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.getArticlesByUserId(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar os artigos do usuário.' });
    }
  }

  // 5. BUSCAR UM ARTIGO POR ID
  getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.getArticleById(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Erro ao buscar o artigo.' });
    }
  }

  // 6. EDITAR ARTIGO
  updateArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const bannerBuffer = req.file ? req.file.buffer : null;

      const result = await this.articleService.updateArticle({ 
        id: Number(id), title, content, bannerBuffer 
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao atualizar artigo.' });
    }
  }

  // 7. DELETAR ARTIGO
  deleteArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.deleteArticle(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao deletar artigo.' });
    }
  }
}