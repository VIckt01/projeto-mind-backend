import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';

const router = Router();

// Caminhos: http://localhost:5000/auth/register e /auth/login
router.post('/register', register);
router.post('/login', login);

// novas rotas de gerenciamento de perfil
router.get('/profile/:id', getProfile);
router.put('/profile', updateProfile);

export default router;