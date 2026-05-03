import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';

export function TaskContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const workerManager = useRef(TimerWorkerManager.getInstance());
  const isFirstRender = useRef(true);

  useEffect(() => {
    const worker = workerManager.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;

      worker.onmessage = (e) => {
        const countDownSeconds = e.data;
        if (countDownSeconds <= 0) {
          dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        } else {
          dispatch({
            type: TaskActionTypes.COUNT_DOWN,
            payload: { secondsRemaining: countDownSeconds },
          });
        }
      };

      return;
    }

    if (state.activeTask && state.secondsRemaining > 0) {
      console.log('ENVIANDO PRO WORKER:', state.secondsRemaining);
      worker.onmessage = (e) => {
        console.log('WORKER RESPONDEU:', e.data);
        const countDownSeconds = e.data;
        if (countDownSeconds <= 0) {
          dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        } else {
          dispatch({
            type: TaskActionTypes.COUNT_DOWN,
            payload: { secondsRemaining: countDownSeconds },
          });
        }
      };

      worker.postMessage(state);
    }

    if (!state.activeTask) {
      worker.terminate();
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}