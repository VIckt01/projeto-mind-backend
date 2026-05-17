import { Router } from "express";
import { userRoutes } from "./auth.routes";
import { articleRoutes } from "./article.routes";
import { commentRoutes } from "./comment.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/article", articleRoutes);
router.use("/comment", commentRoutes);

export { router };