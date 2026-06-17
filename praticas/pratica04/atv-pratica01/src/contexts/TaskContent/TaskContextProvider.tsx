import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';

const API_URL = 'http://localhost:3333';

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

  // Carrega settings da API no startup
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: {
            workTime: data.workTime,
            shortBreakTime: data.shortBreakTime,
            longBreakTime: data.longBreakTime,
          },
        });
      })
      .catch(() => console.warn('API offline, usando configurações locais'));
  }, []);

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

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

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