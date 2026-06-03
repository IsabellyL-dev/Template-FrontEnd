import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

export const settingsRouter = Router();
settingsRouter.use(authMiddleware);

settingsRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { userId: req.userId! } });
    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: req.userId!, workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
      });
    }
    return res.json(settings);
  } catch (err) {
    console.error('[GET /settings]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

settingsRouter.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number; shortBreakTime: number; longBreakTime: number;
    };

    if (
      !Number.isInteger(workTime) || !Number.isInteger(shortBreakTime) ||
      !Number.isInteger(longBreakTime) || workTime <= 0 || shortBreakTime <= 0 || longBreakTime <= 0
    ) {
      return res.status(400).json({ message: 'Valores inválidos. Use inteiros positivos.' });
    }

    const settings = await prisma.settings.upsert({
      where: { userId: req.userId! },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { userId: req.userId!, workTime, shortBreakTime, longBreakTime },
    });
    return res.json(settings);
  } catch (err) {
    console.error('[PUT /settings]', err);
    return res.status(500).json({ message: 'Erro interno.' });
  }
});
