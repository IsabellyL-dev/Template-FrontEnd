import { useAuth } from '../../contexts/contexts-login/AuthContext';
import { useNavigate } from 'react-router';
import styles from './style.module.css';

export function UserGreeting() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  if (!state.user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className={styles.greeting}>
      <span className={styles.welcome}>
        Olá, <strong>{state.user.name}</strong>! 👋
      </span>
      <button className={styles.logout} onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}