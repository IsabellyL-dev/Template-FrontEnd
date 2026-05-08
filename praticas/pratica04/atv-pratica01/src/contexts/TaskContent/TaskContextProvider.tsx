import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');

    if (storageState === null) return initialTaskState;

    try {
      const parsed = JSON.parse(storageState) as TaskStateModel;
      return {
        ...parsed,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',
      };
    } catch {
      return initialTaskState;
    }
  });

  const workerManager = useRef(TimerWorkerManager.getInstance());
  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const worker = workerManager.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;

      worker.onmessage = (e) => {
        const countDownSeconds = e.data;
        if (countDownSeconds <= 0) {
          if (playBeepRef.current) {
            playBeepRef.current();
            playBeepRef.current = null;
          }
          dispatch({ type: TaskActionTypes.COMPLETE_TASK });
          worker.terminate();
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
      worker.onmessage = (e) => {
        const countDownSeconds = e.data;
        if (countDownSeconds <= 0) {
          if (playBeepRef.current) {
            playBeepRef.current();
            playBeepRef.current = null;
          }
          dispatch({ type: TaskActionTypes.COMPLETE_TASK });
          worker.terminate();
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

  // Persiste o estado no localStorage
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  // Atualiza o título da aba
  useEffect(() => {
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
  }, [state.formattedSecondsRemaining]);

  useEffect(() => {
    if (!state.activeTask) {
      playBeepRef.current = null;
      return;
    }

    if (playBeepRef.current === null) {
      const play = loadBeep();
      playBeepRef.current = play;
      play();
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}