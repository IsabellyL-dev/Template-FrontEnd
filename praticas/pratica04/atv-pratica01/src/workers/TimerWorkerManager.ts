import type { TaskStateModel } from '../models/TaskStateModel';
import TimerWorker from './timerWorker?worker';

export class TimerWorkerManager {
  private static instance: TimerWorkerManager;
  private worker: Worker;

  private constructor() {
    this.worker = new TimerWorker();
  }

  static getInstance(): TimerWorkerManager {
    if (!TimerWorkerManager.instance) {
      TimerWorkerManager.instance = new TimerWorkerManager();
    }
    return TimerWorkerManager.instance;
  }

  postMessage(message: TaskStateModel) {
    this.worker.postMessage(message);
  }

  set onmessage(fn: (e: MessageEvent) => void) {
    this.worker.onmessage = fn;
  }

  terminate() {
    this.worker.terminate();
    this.worker = new TimerWorker();
  }
}