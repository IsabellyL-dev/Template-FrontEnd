import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
<<<<<<< HEAD
  // 1. Busca o valor inicial do localStorage
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme = localStorage.getItem('theme');
    return (storageTheme as AvailableThemes) || 'dark';
  });

  // 2. Mapeamento de ícones (Evita ifs/ternários no JSX)
=======
  // 1. Inicialização preguiçosa buscando do localStorage
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  // 2. Dicionário de ícones baseado no tema atual
>>>>>>> b7098f4 (finalizado até a prática 30)
  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

<<<<<<< HEAD
=======
  // 3. Função pura de atualização de estado
>>>>>>> b7098f4 (finalizado até a prática 30)
  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();
<<<<<<< HEAD
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }

  // 3. Efeito colateral: Muda o HTML e salva no localStorage
=======

    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  // 4. Efeito Colateral: Aplica no HTML e salva no Storage
>>>>>>> b7098f4 (finalizado até a prática 30)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
<<<<<<< HEAD
        {/* Renderiza o ícone dinamicamente baseado na chave atual */}
=======
>>>>>>> b7098f4 (finalizado até a prática 30)
        {nextThemeIcon[theme]}
      </a>
    </nav>
  );
}