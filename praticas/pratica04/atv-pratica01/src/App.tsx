// App.tsx

import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';
import { TaskContextProvider } from './contexts/TaskContent/TaskContextProvider';
import { Home } from './pages/Home';

import './styles/theme.css';
import './styles/global.css';

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};

export function App() {
   const [state, setState] = useState(initialState);

  
    return (
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  );
}