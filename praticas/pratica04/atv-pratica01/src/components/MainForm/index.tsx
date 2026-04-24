import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/TaskContent/useTaskContext';
import { useRef, useState } from 'react';

export function MainForm() {
 const { setState } = useTaskContext();

  // 2. Crie o estado para guardar o que o usuário digita
  const [taskName, setTaskName] = useState('');

 const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 4. No momento do envio, acessamos o elemento HTML (.current) e pegamos o valor (.value)
    console.log('DEU CERTO', taskNameInput.current?.value);
  }

  return (
    // 4. Conectamos a nossa função ao evento onSubmit do form
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          ref={taskNameInput}
        />
      </div>

      <div className='formRow'>
        <p>Próximo intervalo é de 25min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}