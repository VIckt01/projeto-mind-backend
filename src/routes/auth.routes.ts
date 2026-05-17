import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/multer";

// Importando o Controller Único
import { UserController } from "../controllers/user/UserController";

// Importando o Middleware (Assumindo que já exista na sua pasta)
import { isAuthenticated } from "../middlewares/isAutenticated";

const userRoutes = Router();
const upload = multer(uploadConfig.upload());

// Instanciando o controller unificado
const userController = new UserController();

// Cadastro de usuário
userRoutes.post("/register", userController.register);

// Autenticação (Login)
userRoutes.post("/login", userController.login);

// Atualizar dados do perfil (com suporte a upload de imagem)
userRoutes.put(
  "/profile",
  isAuthenticated,
  upload.single("file"),
  userController.updateProfile,
);

// Buscar detalhes do usuário
userRoutes.get("/me/:id", isAuthenticated, userController.getProfile);

userRoutes.get("/me", isAuthenticated, userController.me);

// Obs: As rotas de GetUserStatsController e GetRecentActivitiesController
// podem ser adicionadas aqui e na classe UserController caso você também as queira unificadas.

export { userRoutes };