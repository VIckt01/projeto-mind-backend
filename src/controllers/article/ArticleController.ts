import { Request, Response } from "express";
import { ArticleService } from "../../services/article/ArticleService";

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  createArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const authorId = req.user_id;
      const bannerBuffer = req.file ? req.file.buffer : undefined;

      const result = await this.articleService.createArticle({
        title,
        content,
        authorId,
        bannerBuffer,
      });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar artigo." });
    }
  };

  updateArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user_id;
      const { title, content } = req.body;
      const bannerBuffer = req.file ? req.file.buffer : undefined;

      const result = await this.articleService.updateArticle({
        id,
        userId,
        title,
        content,
        bannerBuffer,
      });
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.message.includes("Acesso negado") ? 403 : 400;
      res
        .status(status)
        .json({ error: error.message || "Erro ao atualizar artigo." });
    }
  };

  deleteArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user_id;

      const result = await this.articleService.deleteArticle(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.message.includes("Acesso negado") ? 403 : 400;
      res
        .status(status)
        .json({ error: error.message || "Erro ao deletar artigo." });
    }
  };

  getHighlightsAndRecent = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.articleService.getHighlightsAndRecent();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar destaques e recentes." });
    }
  };

  getAllArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.getAllArticles();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar artigos." });
    }
  };

  getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      const result = await this.articleService.getArticleBySlug(slug as string);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: "Artigo não encontrado." });
    }
  };

  getArticlesByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user_id as string;
    try {
      const result = await this.articleService.getArticlesByUserId(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar os artigos do usuário." });
    }
  };

  getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.articleService.getArticleById(id as string);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(404)
        .json({ error: error.message || "Erro ao buscar o artigo." });
    }
  };
}
