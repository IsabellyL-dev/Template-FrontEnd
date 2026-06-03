import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/login";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  return <h1>Pomodoro Home</h1>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();

  return state.isAuthenticated ? children : <Navigate to="/" />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}