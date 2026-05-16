import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { error } from 'node:console';

const prisma = new PrismaClient();

// LÓGICA PARA O CADASTRO DE USUÁRIO
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Verificar se o usuário já exite no banco
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists){
            res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            return;
        }

        // CRIPTOGRAFIA: Aqui a senha digitada será embalharada usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salva o usuário com a senha criptografada no MySQL
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id});
    } catch (error) {
        res.status(500).json({error: 'Erro interno ao cadastrar usuário.'});
    }
};

// LÓGICA PARA O LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Procura o usuário pelo e-mail
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'E-mail ou senha inválidos.'});
            return;
        }

        // Compara a senha digitada com a senha criptgrafada no banco
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'E-mail ou senha inválidos.'});
            return;
        }

        // Se deu certo, retorna os dados básicos do usuário (menos a senha)
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao realizar login.' });
    }
};