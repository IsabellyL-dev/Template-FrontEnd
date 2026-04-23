import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mode, setMode] = useState<"login" | "register" | "recover">("login");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const success = login(username, password);

    if (success) {
      setMessage("Login realizado com sucesso!");
      navigate("/home");
    } else {
      setMessage("Credenciais inválidas");
    }
  }

  return (
    <div className={styles.card}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="user">Usuário</label>
        <input
          id="user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="pass">Senha</label>
        <input
          id="pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}

      <div className={styles.links}>
        <span onClick={() => setMode("register")}>
          Não tem conta? Cadastre-se
        </span>

        <span onClick={() => setMode("recover")}>
          Esqueci minha senha
        </span>
      </div>

      {mode === "register" && <p>Tela de cadastro (simulação)</p>}
      {mode === "recover" && <p>Recuperação de senha (simulação)</p>}
    </div>
  );
}