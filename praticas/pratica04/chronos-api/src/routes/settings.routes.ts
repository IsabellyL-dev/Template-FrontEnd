import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const settingsRouter = Router();

// ─────────────────────────────────────────────
// GET /settings — busca as configurações atuais
// Se ainda não existir registro, cria com valores padrão
// ─────────────────────────────────────────────
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 1 },
    });

    // Cria registro padrão caso não exista
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          workTime: 25,
          shortBreakTime: 5,
          longBreakTime: 15,
        },
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error('[GET /settings]', error);
    return res.status(500).json({ message: 'Erro interno ao buscar settings' });
  }
});

// ─────────────────────────────────────────────
// PUT /settings — atualiza as configurações
// Body esperado: { workTime, shortBreakTime, longBreakTime }
// ─────────────────────────────────────────────
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number;
      shortBreakTime: number;
      longBreakTime: number;
    };

    // Validação: todos os campos devem ser inteiros positivos
    if (
      !Number.isInteger(workTime) ||
      !Number.isInteger(shortBreakTime) ||
      !Number.isInteger(longBreakTime) ||
      workTime <= 0 ||
      shortBreakTime <= 0 ||
      longBreakTime <= 0
    ) {
      return res.status(400).json({
        message: 'Valores inválidos. workTime, shortBreakTime e longBreakTime devem ser inteiros positivos.',
      });
    }

    // upsert: atualiza se existir, cria se não existir
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { id: 1, workTime, shortBreakTime, longBreakTime },
    });

    return res.json(settings);
  } catch (error) {
    console.error('[PUT /settings]', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar settings' });
  }
});
