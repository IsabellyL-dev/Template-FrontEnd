import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/contexts-login/AuthContext";
import { useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { api } from "../../adapters/api";
import styles from "./styles.module.css";

type Mode = "login" | "register" | "forgot" | "reset";

export default function LoginForm() {
  const { login, register, state } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated) navigate("/");
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  function showMsg(msg: string, error = false) {
    setMessage(msg);
    setIsError(error);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showMsg("Login realizado com sucesso!");
      navigate("/");
    } catch (err: any) {
      showMsg(err.message || "Credenciais inválidas.", true);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      showMsg("Senha deve ter ao menos 6 caracteres.", true);
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      showMsg("Conta criada com sucesso!");
      navigate("/");
    } catch (err: any) {
      showMsg(err.message || "Erro ao cadastrar.", true);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post<{ message: string; devToken?: string }>(
        "/auth/forgot-password",
        { email }
      );
      if (data.devToken) {
        setResetToken(data.devToken);
        showMsg("Token gerado! Cole abaixo para redefinir sua senha.");
        setMode("reset");
      } else {
        showMsg(data.message);
      }
    } catch (err: any) {
      showMsg(err.message || "Erro ao solicitar recuperação.", true);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      showMsg("Senha deve ter ao menos 6 caracteres.", true);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token: resetToken, newPassword });
      showMsg("Senha redefinida! Faça login com a nova senha.");
      setMode("login");
      setResetToken("");
      setNewPassword("");
    } catch (err: any) {
      showMsg(err.message || "Token inválido ou expirado.", true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.wrapper}>
        <Logo />
        <div className={styles.card}>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <h2>Login</h2>
              <form className={styles.form} onSubmit={handleLogin}>
                <label className={styles.label} htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className={styles.label} htmlFor="pass">Senha</label>
                <input
                  id="pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className={styles.links}>
                <span onClick={() => setMode("register")}>
                  Não tem conta? Cadastre-se
                </span>
                <span onClick={() => setMode("forgot")}>
                  Esqueci minha senha
                </span>
              </div>
            </>
          )}

          {/* ── CADASTRO ── */}
          {mode === "register" && (
            <>
              <h2>Criar conta</h2>
              <form className={styles.form} onSubmit={handleRegister}>
                <label className={styles.label} htmlFor="name">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <label className={styles.label} htmlFor="reg-email">E-mail</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className={styles.label} htmlFor="reg-pass">
                  Senha (mín. 6 caracteres)
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Cadastrando..." : "Criar conta"}
                </button>
              </form>

              <div className={styles.links}>
                <span onClick={() => setMode("login")}>Já tenho conta</span>
              </div>
            </>
          )}

          {/* ── ESQUECI SENHA ── */}
          {mode === "forgot" && (
            <>
              <h2>Recuperar senha</h2>
              <p className={styles.subtitle}>
                Digite seu e-mail para gerar o token de recuperação.
              </p>
              <form className={styles.form} onSubmit={handleForgot}>
                <label className={styles.label} htmlFor="forgot-email">E-mail</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Gerando..." : "Gerar token"}
                </button>
              </form>

              <div className={styles.links}>
                <span onClick={() => setMode("login")}>Voltar ao login</span>
                <span onClick={() => setMode("reset")}>Já tenho um token</span>
              </div>
            </>
          )}

          {/* ── REDEFINIR SENHA ── */}
          {mode === "reset" && (
            <>
              <h2>Nova senha</h2>
              <form className={styles.form} onSubmit={handleReset}>
                <label className={styles.label} htmlFor="token">
                  Token de recuperação
                </label>
                <input
                  id="token"
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Cole o token aqui"
                  required
                />

                <label className={styles.label} htmlFor="new-pass">
                  Nova senha (mín. 6 caracteres)
                </label>
                <input
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Redefinir senha"}
                </button>
              </form>

              <div className={styles.links}>
                <span onClick={() => setMode("login")}>Voltar ao login</span>
              </div>
            </>
          )}

          {/* ── MENSAGEM ── */}
          {message && (
            <p className={`${styles.message} ${isError ? styles.error : styles.success}`}>
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
