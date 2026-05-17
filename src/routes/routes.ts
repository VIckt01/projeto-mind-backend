import { Router } from "express";
import { userRoutes } from "./auth.routes";
import { articleRoutes } from "./article.routes";

const router = Router();

router.use("/auth", userRoutes);

router.use("/article", articleRoutes);

export { router };
