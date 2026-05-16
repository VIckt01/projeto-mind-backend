import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Caminhos: http://localhost:5000/auth/register e /auth/login
router.post('/register', register);
router.post('/login', login);

export default router;