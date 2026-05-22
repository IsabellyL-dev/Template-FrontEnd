import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';

export const app = express();

// ─────────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────────
app.use(cors());           // Permite requisições do frontend (localhost diferente)
app.use(express.json());   // Lê body como JSON automaticamente

// ─────────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────────

// Health check — confirma que a API está no ar
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Configurações do Pomodoro
app.use('/settings', settingsRouter);

// Tasks / histórico
app.use('/tasks', tasksRouter);
