// src/controllers/comment/CommentController.ts
import { Response } from "express";
import { CommentService } from "../../services/comment/CommentService";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    // Injeta a instância do serviço de comentários
    this.commentService = new CommentService();
  }

  // 1. CRIAR COMENTÁRIO
  createComment = async (req: any, res: Response): Promise<void> => {
    try {
      const { content } = req.body;
      const { articleId } = req.params; // Captura o ID do artigo vindo da URL
      const authorId = req.user_id;     // ID do usuário logado injetado pelo middleware isAuthenticated

      const result = await this.commentService.createComment({
        content,
        authorId,
        articleId,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar comentário." });
    }
  };

  // 2. EDITAR COMENTÁRIO
  updateComment = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;     // ID do comentário vindo da URL
      const { content } = req.body;  // Novo texto do comentário
      const userId = req.user_id;    // ID do usuário logado tentando fazer a alteração

      const result = await this.commentService.updateComment({
        id,
        userId,
        content,
      });

      res.status(200).json(result);
    } catch (error: any) {
      // Se o erro for de falta de permissão, podemos retornar o status 403 (Forbidden)
      const status = error.message.includes("Acesso negado") ? 403 : 400;
      res.status(status).json({ error: error.message || "Erro ao atualizar comentário." });
    }
  };

  // 3. DELETAR COMENTÁRIO
  deleteComment = async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;  // ID do comentário vindo da URL
      const userId = req.user_id; // ID do usuário logado tentando excluir

      const result = await this.commentService.deleteComment(id, userId);

      res.status(200).json(result);
    } catch (error: any) {
      const status = error.message.includes("Acesso negado") ? 403 : 400;
      res.status(status).json({ error: error.message || "Erro ao deletar comentário." });
    }
  };
}