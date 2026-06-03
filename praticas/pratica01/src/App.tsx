import './styles/theme.css';
import './styles/global.css';
import { Heading } from './components/Heading';
import { Timer } from 'lucide-react';

e// src/App.jsx

export function App() {
  return (
    <>
      {/* Seção 1: Logo */}
      <div className='container'>
        <div className='content'>
          <p>Logo do App</p>
        </div>
      </div>

      {/* Seção 2: Menu */}
      <div className='container'>
        <div className='content'>
          <p>Menu de Navegação</p>
        </div>
      </div>

      {/* Seção 3: Formulário / Cronômetro */}
      <div className='container'>
        <div className='content'>
          <p>Área do Cronômetro</p>
        </div>
      </div>

      {/* Seção 4: Footer */}
      <div className='container'>
        <div className='content'>
          <p>Rodapé da Página</p>
        </div>
      </div>
    </>
  );
}