import { useReducer } from 'react';
import { TaskContext } from './TaskContext';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {

  // 🧠 Reducer simples (contador)
  const [numero, dispatch] = useReducer((state: number, action: string) => {
    console.log('Estado atual:', state, 'Ação disparada:', action);

    switch (action) {
      case 'INCREMENT':
        return state + 1;

      case 'DECREMENT':
        return state - 1;

      case 'INITIAL_STATE':
        return 0;
    }

    return state; // fallback obrigatório
  }, 0);

  return (
    <TaskContext.Provider value={{} as any}>
      <h1>O número é: {numero}</h1>

      <button onClick={() => dispatch('INCREMENT')}>
        Incrementar
      </button>

      <button onClick={() => dispatch('DECREMENT')}>
        Decrementar
      </button>

      <button onClick={() => dispatch('INITIAL_STATE')}>
        ZERAR
      </button>
    </TaskContext.Provider>
  );
}