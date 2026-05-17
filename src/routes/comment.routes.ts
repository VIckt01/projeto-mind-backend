// src/routes/comment.routes.ts
import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAutenticated";
import { CommentController } from "../controllers/comment/CommentController";

const commentRoutes = Router();

// CORREÇÃO: 'C' maiúsculo para chamar a Classe correta
const commentController = new CommentController();

// 1. Criar comentário
commentRoutes.post("/article/:articleId", isAuthenticated, commentController.createComment);

// 2. Editar comentário (CORREÇÃO: removida a barra dupla)
commentRoutes.put("/:id", isAuthenticated, commentController.updateComment);

// 3. Excluir comentário (CORREÇÃO: removida a barra dupla)
commentRoutes.delete("/:id", isAuthenticated, commentController.deleteComment);

export { commentRoutes };