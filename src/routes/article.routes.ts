import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/multer";

import { isAuthenticated } from "../middlewares/isAutenticated";
import { ArticleController } from "../controllers/article/ArticleController";

const articleRoutes = Router();
const upload = multer(uploadConfig.upload());

// Instanciando o controller unificado
const articleController = new ArticleController();

// Rotas Abertas (Públicas)
articleRoutes.get("/", articleController.getAllArticles);
articleRoutes.get("/:id", articleController.getArticleById);
articleRoutes.get("/slug/:slug", articleController.getArticleBySlug);

// Rotas Fechadas (Apenas usuários autenticados)
articleRoutes.get(
  "/user/:id",
  isAuthenticated,
  articleController.getArticlesByUserId,
);
articleRoutes.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  articleController.createArticle,
);
articleRoutes.put(
  "/:id",
  isAuthenticated,
  upload.single("file"),
  articleController.updateArticle,
);
articleRoutes.delete("/:id", isAuthenticated, articleController.deleteArticle);

export { articleRoutes };
