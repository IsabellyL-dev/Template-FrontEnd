import styles from './styles.module.css';

// 1. Importamos apenas o nosso Hook!
import { useTaskContext } from '../../contexts/TaskContent/useTaskContext';

export function CountDown() {
  // 2. Chamamos o Hook
  const taskContext = useTaskContext();

  console.log(taskContext); // Teste no navegador!

  return <div className={styles.container}>00:00</div>;
}