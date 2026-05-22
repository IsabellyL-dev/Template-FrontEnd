import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

// ─────────────────────────────────────────────
// GET /tasks — lista todas as tasks ordenadas por startDate desc
// ─────────────────────────────────────────────
tasksRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { startDate: 'desc' },
    });

    // BigInt não é serializável por JSON.stringify padrão
    // Convertemos para string para evitar erros no frontend
    const serialized = tasks.map((task) => ({
      ...task,
      startDate: task.startDate.toString(),
      completeDate: task.completeDate?.toString() ?? null,
      interruptDate: task.interruptDate?.toString() ?? null,
    }));

    return res.json(serialized);
  } catch (error) {
    console.error('[GET /tasks]', error);
    return res.status(500).json({ message: 'Erro interno ao listar tasks' });
  }
});

// ─────────────────────────────────────────────
// POST /tasks — cria uma nova task
// Body: { id, name, duration, type, startDate }
// ─────────────────────────────────────────────
tasksRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id, name, duration, type, startDate } = req.body as {
      id: string;
      name: string;
      duration: number;
      type: string;
      startDate: number;
    };

    // Validação básica de campos obrigatórios
    if (!id || !name || !duration || !type || !startDate) {
      return res.status(400).json({
        message: 'Campos obrigatórios: id, name, duration, type, startDate',
      });
    }

    const validTypes = ['workTime', 'shortBreakTime', 'longBreakTime'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `Tipo inválido. Use: ${validTypes.join(', ')}`,
      });
    }

    const task = await prisma.task.create({
      data: {
        id: String(id),
        name,
        duration: Number(duration),
        type,
        startDate: BigInt(startDate),
      },
    });

    // Serializa BigInt antes de retornar
    return res.status(201).json({
      ...task,
      startDate: task.startDate.toString(),
      completeDate: task.completeDate?.toString() ?? null,
      interruptDate: task.interruptDate?.toString() ?? null,
    });
  } catch (error) {
    console.error('[POST /tasks]', error);
    return res.status(500).json({ message: 'Erro interno ao criar task' });
  }
});

// ─────────────────────────────────────────────
// PATCH /tasks/:id/complete — marca task como concluída
// Body: { completeDate }
// ─────────────────────────────────────────────
tasksRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body as { completeDate: number };

    if (!completeDate) {
      return res.status(400).json({ message: 'Campo obrigatório: completeDate' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { completeDate: BigInt(completeDate) },
    });

    return res.json({
      ...task,
      startDate: task.startDate.toString(),
      completeDate: task.completeDate?.toString() ?? null,
      interruptDate: task.interruptDate?.toString() ?? null,
    });
  } catch (error: unknown) {
    // Prisma lança P2025 quando o registro não é encontrado
    if (isPrismaNotFoundError(error)) {
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    console.error('[PATCH /tasks/:id/complete]', error);
    return res.status(500).json({ message: 'Erro interno ao concluir task' });
  }
});

// ─────────────────────────────────────────────
// PATCH /tasks/:id/interrupt — marca task como interrompida
// Body: { interruptDate }
// ─────────────────────────────────────────────
tasksRouter.patch('/:id/interrupt', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { interruptDate } = req.body as { interruptDate: number };

    if (!interruptDate) {
      return res.status(400).json({ message: 'Campo obrigatório: interruptDate' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { interruptDate: BigInt(interruptDate) },
    });

    return res.json({
      ...task,
      startDate: task.startDate.toString(),
      completeDate: task.completeDate?.toString() ?? null,
      interruptDate: task.interruptDate?.toString() ?? null,
    });
  } catch (error: unknown) {
    if (isPrismaNotFoundError(error)) {
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    console.error('[PATCH /tasks/:id/interrupt]', error);
    return res.status(500).json({ message: 'Erro interno ao interromper task' });
  }
});

// ─────────────────────────────────────────────
// DELETE /tasks — remove todas as tasks (limpar histórico)
// ─────────────────────────────────────────────
tasksRouter.delete('/', async (_req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany();
    return res.status(204).send();
  } catch (error) {
    console.error('[DELETE /tasks]', error);
    return res.status(500).json({ message: 'Erro interno ao limpar histórico' });
  }
});

// ─────────────────────────────────────────────
// Helper: detecta erro de registro não encontrado do Prisma
// ─────────────────────────────────────────────
function isPrismaNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  );
}
