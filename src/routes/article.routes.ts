import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/multer";

import { isAuthenticated } from "../middlewares/isAutenticated";
import { ArticleController } from "../controllers/article/ArticleController";
import { maybeAuthenticated } from "../middlewares/maybeAuthenticated";

const articleRoutes = Router();
const upload = multer(uploadConfig.upload());
const articleController = new ArticleController();

// Rotas Públicas
articleRoutes.get(
  "/home",
  maybeAuthenticated,
  articleController.getHighlightsAndRecent,
);
articleRoutes.get("/", articleController.getAllArticles);

// Rota isolada por slug para matar o conflito com a rota por ID
articleRoutes.get(
  "/slug/:slug",
  maybeAuthenticated,
  articleController.getArticleBySlug,
);

// Rotas Privadas
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
