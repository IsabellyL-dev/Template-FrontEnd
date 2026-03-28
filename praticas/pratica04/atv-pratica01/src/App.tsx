// App.tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer';

import './styles/theme.css';
import './styles/global.css';


export function App() {
  return (
    <>
      {/* Seção 1: Logo (Usando div no lugar de Container) */}
      <Container>
        <Logo />
      </Container>

   <Container>
        <Menu />
      </Container>

        <Container>
        <CountDown />
      </Container>
      
        <Container>
        <form className='form' action=''>
          {/* Grupo 1: Label e Input */}
          <div className='formRow'>
           {/* Agora passamos o labelText e podemos passar qualquer prop nativa! */}
            <DefaultInput
              id='meuInput'
              type='text'
              labelText='task'
              placeholder='Digite algo'
              disabled
    
               />
          </div>

          {/* Grupo 2: Texto de apoio */}
          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          {/* Grupo 3: Ciclos */}
            <div className='formRow'>
            <Cycles />
          </div>

          {/* Grupo 4: Botão */}
          <div className='formRow'>
           <DefaultButton icon={<PlayCircleIcon />} color='green' />

            {/* Forçando o botão a ser vermelho e mudando o ícone */}
            <DefaultButton icon={<StopCircleIcon />} color='red' />
          </div>
        </form>
      </Container>
      
       <Container>
        <Footer/>
      </Container>
    </>
  );
}