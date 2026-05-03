// import { useReducer } from 'react';
// import { TaskContext } from './TaskContext';
// import type { TaskModel } from '../../models/TaskModel';
// import type { TaskActionModel } from './TaskActions';

// type TaskContextProviderProps = {
//   children: React.ReactNode;
// };

// type TaskStateModel = {
//   tasks: TaskModel[];
//   secondsRemaining: number;
//   formattedSecondsRemaining: string;
//   activeTask: TaskModel | null;
//   currentCycle: number;
//   config: Record<string, number>;
// };

// export function TaskContextProvider({ children }: TaskContextProviderProps) {
//   const [state, dispatch] = useReducer(
//     (state: TaskStateModel, action: TaskActionModel): TaskStateModel => {
//       console.log('Estado:', state, 'Action:', action);

//       switch (action.type) {
//         case 'START_TASK': {
//           const newTask = action.payload;

//           return {
//             ...state,
//             activeTask: newTask,
//             currentCycle: state.currentCycle + 1,
//             secondsRemaining: newTask.duration * 60,
//             formattedSecondsRemaining: '00:00',
//             tasks: [...state.tasks, newTask],
//           };
//         }

//         case 'INTERRUPT_TASK': {
//           return {
//             ...state,
//             activeTask: null,
//             secondsRemaining: 0,
//             formattedSecondsRemaining: '00:00',
//             tasks: state.tasks.map(task => {
//               if (state.activeTask && state.activeTask.id === task.id) {
//                 return { ...task, interruptDate: Date.now() };
//               }
//               return task;
//             }),
//           };
//         }

//         case 'RESET_STATE': {
//           return {
//             ...state,
//             activeTask: null,
//             secondsRemaining: 0,
//             formattedSecondsRemaining: '00:00',
//           };
//         }

//         default:
//           return state;
//       }
//     },
//     {
//       tasks: [],
//       secondsRemaining: 0,
//       formattedSecondsRemaining: '00:00',
//       activeTask: null,
//       currentCycle: 0,
//       config: {
//         workTime: 25,
//         shortBreakTime: 5,
//         longBreakTime: 15,
//       },
//     }
//   );

//   return (
//     <TaskContext.Provider value={{ state, dispatch }}>
//       {children}
//     </TaskContext.Provider>
//   );
// }