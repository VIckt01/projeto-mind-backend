import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/multer";

import { isAuthenticated } from "../middlewares/isAutenticated";
import { ArticleController } from "../controllers/article/ArticleController";
import { maybeAuthenticated } from "../middlewares/maybeAuthenticated";

const articleRoutes = Router();
const upload = multer(uploadConfig.upload());

// Instanciando o controller unificado
const articleController = new ArticleController();

// Rotas Abertas (Públicas)
articleRoutes.get(
  "/home",
  maybeAuthenticated,
  articleController.getHighlightsAndRecent,
);
articleRoutes.get("/", articleController.getAllArticles);
articleRoutes.get(
  "/:slug",
  maybeAuthenticated,
  articleController.getArticleBySlug,
);

articleRoutes.get("/:id", articleController.getArticleById);

// Rotas Fechadas (Apenas usuários autenticados)
articleRoutes.get(
  "/user/me",
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
