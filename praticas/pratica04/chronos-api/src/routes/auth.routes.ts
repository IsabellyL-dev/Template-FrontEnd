import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'chronos-secret-dev';

// ── POST /auth/register ──────────────────────────────────────
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string; email: string; password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter ao menos 6 caracteres.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[POST /auth/register]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

// ── POST /auth/login ─────────────────────────────────────────
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[POST /auth/login]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

// ── POST /auth/forgot-password ───────────────────────────────
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ message: 'E-mail obrigatório.' });

    const user = await prisma.user.findUnique({ where: { email } });
    // Não revela se o e-mail existe ou não (segurança)
    if (!user) return res.json({ message: 'Se o e-mail existir, o token foi gerado.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    // Em produção, enviaria por e-mail. Em dev, retorna no body.
    console.log(`\n🔑 Token de recuperação para ${email}: ${token}\n`);
    return res.json({
      message: 'Token gerado com sucesso.',
      devToken: token, // apenas em desenvolvimento
    });
  } catch (err) {
    console.error('[POST /auth/forgot-password]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

// ── POST /auth/reset-password ────────────────────────────────
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body as { token: string; newPassword: string };

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter ao menos 6 caracteres.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    return res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    console.error('[POST /auth/reset-password]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});
