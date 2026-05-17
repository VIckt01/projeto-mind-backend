import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { imageBufferToFormat } from "../../utils"; // Mantenha seu caminho correto

const prisma = new PrismaClient();

// --- INTERFACES DE TIPAGEM ---
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUpdateProfileRequest {
  id: string; // Agora é String (UUID)
  name?: string;
  email?: string;
  bio?: string;
  profileImg?: Buffer; // Recebe o arquivo binário do Multer
}

export class UserService {
  // 1. REGISTRO
  async register({ name, email, password }: IRegisterRequest) {
    if (!email || !password || !name) {
      throw new Error("Preencha todos os campos.");
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return { message: "Usuário criado com sucesso!", data: { newUser } };
  }

  // 2. LOGIN
  async login({ email, password }: ILoginRequest) {
    if (!email || !password) {
      throw new Error("Preencha e-mail e senha.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const token = sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "1d",
      },
    );

    return {
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImg: imageBufferToFormat(user.profileImg),
        token: token,
      },
    };
  }

  // 3. DETALHES DO PERFIL
  async getProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImg: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return {
      data: {
        ...user,
        profileImg: imageBufferToFormat(user.profileImg),
      },
      message: "Detalhes do usuário recuperados com sucesso.",
    };
  }

  // 4. ATUALIZAR PERFIL
  async updateProfile({
    id,
    name,
    email,
    bio,
    profileImg,
  }: IUpdateProfileRequest) {
    if (email) {
      const emailOwner = await prisma.user.findUnique({ where: { email } });
      if (emailOwner && emailOwner.id !== id) {
        throw new Error("Este e-mail já está sendo usado por outro usuário.");
      }
    }

    // Converte o Buffer que vem do Multer para Uint8Array exigido pelo Prisma no campo Bytes
    const image = profileImg ? Uint8Array.from(profileImg) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, bio, profileImg: image },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImg: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      data: {
        ...updatedUser,
        profileImg: imageBufferToFormat(updatedUser.profileImg),
      },
      message: "Usuário atualizado com sucesso.",
    };
  }
}
