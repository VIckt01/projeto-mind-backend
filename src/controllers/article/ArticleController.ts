import { Request, Response } from "express";
import { ArticleService } from "../../services/article/ArticleService";

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  // 1. CRIAR ARTIGO
  createArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const authorId = req.user_id; // ◄— Pega o ID do usuário autenticado direto do token!
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

  // 2. EDITAR ARTIGO (Valida Dono)
  updateArticle = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // UUID do artigo
      const userId = req.user_id; // UUID do usuário autenticado
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

  // 3. DELETAR ARTIGO (Valida Dono)
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

  // 4. ENDPOINT DESTAQUES E RECENTES
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

  // 5. LISTAR TODOS (Público)
  getAllArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.getAllArticles();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar artigos." });
    }
  };

  // 6. BUSCAR POR SLUG (Incrementa View)
  getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const result = await this.articleService.getArticleBySlug(slug as string);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: "Artigo não encontrado." });
    }
  };

  // 7. LISTAR ARTIGOS POR USUÁRIO (Dashboard)
  getArticlesByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user_id as string;

    try {
      const result = await this.articleService.getArticlesByUserId(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar os artigos do usuário." });
    }
  };

  // 8. BUSCAR POR ID
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
