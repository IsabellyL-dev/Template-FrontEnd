import { TaskContextProvider } from './contexts/TaskContent/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter/index';
import { AuthProvider } from './contexts/contexts-login/AuthContext';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <TaskContextProvider>
        <MessagesContainer>
          <MainRouter />
        </MessagesContainer>
      </TaskContextProvider>
    </AuthProvider>
  );
}