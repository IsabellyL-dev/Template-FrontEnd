import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';
import { authRouter } from './routes/auth.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);
