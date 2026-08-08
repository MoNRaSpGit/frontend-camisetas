import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthContext";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      setUsername("");
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pdh-modal-backdrop" onClick={closeLoginModal}>
      <div className="pdh-modal" onClick={(event) => event.stopPropagation()}>
        <h2>Iniciar sesión</h2>
        <p className="pdh-modal-text">Acceso exclusivo para el administrador de la tienda.</p>

        <form onSubmit={handleSubmit} className="pdh-modal-form">
          <label className="pdh-field-label">
            Usuario
            <input
              type="text"
              className="pdh-text-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoFocus
            />
          </label>

          <label className="pdh-field-label">
            Contraseña
            <input
              type="password"
              className="pdh-text-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="pdh-form-error">{error}</p> : null}

          <div className="pdh-modal-actions">
            <button type="button" className="pdh-button pdh-button--ghost" onClick={closeLoginModal} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="pdh-button pdh-button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
