// src/components/Container.tsx
import type { ReactNode } from 'react'; // Importação explícita de tipo
import styles from './styles.module.css';

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}