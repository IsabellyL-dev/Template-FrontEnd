import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import { Timer } from "lucide-react";

export default function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mode, setMode] = useState<"login" | "register" | "recover">("login");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const success = login(username, password);

    if (success) {
      setMessage("Login realizado com sucesso!");
      sessionStorage.setItem("auth", "true");
      window.location.href = "http://localhost:5173";
    } else {
      setMessage("Credenciais inválidas");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Timer size={64} color="var(--color-primary, #dd2d4a)" />
        <span className={styles.logoText}>Chronos</span>
      </div>

      <div className={styles.card}>
        <h2>Login</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="user">Usuário</label>
          <input
            id="user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className={styles.label} htmlFor="pass">Senha</label>
          <input
            id="pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        {message && (
          <p className={`${styles.message} ${styles.error}`}>
            {message}
          </p>
        )}

        <div className={styles.links}>
          <span onClick={() => setMode("register")}>
            Não tem conta? Cadastre-se
          </span>
          <span onClick={() => setMode("recover")}>
            Esqueci minha senha
          </span>
        </div>

        {mode === "register" && <div className={styles.panel}>Tela de cadastro</div>}
        {mode === "recover" && <div className={styles.panel}>Recuperação de senha</div>}
      </div>
    </div>
  );
}