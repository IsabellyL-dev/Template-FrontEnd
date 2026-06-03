import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

export const tasksRouter = Router();
tasksRouter.use(authMiddleware);

function serializeTask(task: any) {
  return {
    ...task,
    startDate: task.startDate.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  };
}

function isPrismaNotFound(err: unknown) {
  return typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'P2025';
}

tasksRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId! },
      orderBy: { startDate: 'desc' },
    });
    return res.json(tasks.map(serializeTask));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

tasksRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, duration, type, startDate } = req.body;
    if (!id || !name || !duration || !type || !startDate) {
      return res.status(400).json({ message: 'Campos obrigatórios: id, name, duration, type, startDate.' });
    }
    const task = await prisma.task.create({
      data: { id: String(id), name, duration: Number(duration), type, startDate: BigInt(startDate), userId: req.userId! },
    });
    return res.status(201).json(serializeTask(task));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

tasksRouter.patch('/:id/complete', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body;
    if (!completeDate) return res.status(400).json({ message: 'completeDate obrigatório.' });

    const existing = await prisma.task.findFirst({ where: { id, userId: req.userId! } });
    if (!existing) return res.status(404).json({ message: 'Task não encontrada.' });

    const task = await prisma.task.update({ where: { id }, data: { completeDate: BigInt(completeDate) } });
    return res.json(serializeTask(task));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

tasksRouter.patch('/:id/interrupt', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { interruptDate } = req.body;
    if (!interruptDate) return res.status(400).json({ message: 'interruptDate obrigatório.' });

    const existing = await prisma.task.findFirst({ where: { id, userId: req.userId! } });
    if (!existing) return res.status(404).json({ message: 'Task não encontrada.' });

    const task = await prisma.task.update({ where: { id }, data: { interruptDate: BigInt(interruptDate) } });
    return res.json(serializeTask(task));
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' });
  }
});

tasksRouter.delete('/', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.task.deleteMany({ where: { userId: req.userId! } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' });
  }
});
