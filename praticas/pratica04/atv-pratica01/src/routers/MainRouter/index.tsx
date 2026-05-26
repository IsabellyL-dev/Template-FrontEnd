import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History/index';
import { Settings } from '../../pages/Settings';
import Login from '../../pages/Login';     
import { useAuth } from '../../contexts/contexts-login/AuthContext'; 
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  return state.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path='/login' element={<Login />} />

        {/* Protegidas */}
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/history/' element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path='/settings/' element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path='/about-pomodoro/' element={<PrivateRoute><AboutPomodoro /></PrivateRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}