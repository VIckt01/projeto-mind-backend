import { Request, Response } from "express";
import { UserService } from "../../services/user/UserService"; // Ajuste o caminho se necessário

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // 1. REGISTRO
  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    try {
      const result = await this.userService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Erro interno ao cadastrar usuário." });
    }
  };

  // 2. LOGIN
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const result = await this.userService.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Erro interno ao realizar login." });
    }
  };

  // 3. DETALHES DO PERFIL
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      // Passando o ID diretamente como String (UUID do banco)
      const result = await this.userService.getProfile(id as string);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(404)
        .json({ error: error.message || "Erro ao buscar dados do perfil." });
    }
  };

  // 4. ATUALIZAR PERFIL (req tipado como 'any' para aceitar o req.file do Multer)
  updateProfile = async (req: any, res: Response): Promise<void> => {
    try {
      // Como o envio agora geralmente é multipart/form-data (por causa da foto)
      // os campos de texto vêm no req.body e o arquivo vem no req.file
      const { id, name, email, bio } = req.body;

      // Captura o buffer da imagem se o usuário tiver feito upload
      const profileImgBuffer = req.file ? req.file.buffer : undefined;

      const result = await this.userService.updateProfile({
        id: String(id), // Garante que seja String
        name,
        email,
        bio,
        profileImg: profileImgBuffer,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(400)
        .json({ error: error.message || "Erro interno ao atualizar perfil." });
    }
  };

  // 5. VALIDAR SESSÃO ATUAL (/auth/me)
  me = async (req: any, res: Response): Promise<void> => {
    const id = req.user_id;
    try {
      const result = await this.userService.getProfile(id);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(401)
        .json({ error: error.message || "Sessão inválida ou expirada." });
    }
  };
}
