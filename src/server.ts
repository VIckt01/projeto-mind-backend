import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // Importa as rotas de auth

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Ativa as rotas de autenticação sob o prefixo /auth
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API do Blog rodando com sucesso! 🚀');
});

app.listen(PORT, () => {
  console.log(`\n🔥 Servidor online em: http://localhost:${PORT}`);
});