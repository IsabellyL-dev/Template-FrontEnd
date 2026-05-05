import type { TaskStateModel } from '../models/TaskStateModel';
import TimerWorker from './timerWorker?worker';

export class TimerWorkerManager {
  private static instance: TimerWorkerManager;
  private worker: Worker;

  private constructor() {
  this.worker = new TimerWorker();
}
  

  // 🔥 garante singleton (um único worker na aplicação)
  static getInstance(): TimerWorkerManager {
    if (!TimerWorkerManager.instance) {
      TimerWorkerManager.instance = new TimerWorkerManager();
    }
    return TimerWorkerManager.instance;
  }

  // 📤 envia estado pro worker
  postMessage(message: TaskStateModel) {
    this.worker.postMessage(message);
  }

  // 📥 recebe mensagem do worker
  set onmessage(fn: (e: MessageEvent) => void) {
    this.worker.onmessage = fn;
  }

  
  terminate() {
    this.worker.terminate();

   
    this.worker = new  Worker(
      new URL('./timerWorker.ts', import.meta.url),
      { type: 'module' }
    );
  }
}