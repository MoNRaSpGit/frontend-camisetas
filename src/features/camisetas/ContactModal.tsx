import { useState, type FormEvent } from "react";

type ContactModalProps = {
  open: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (name: string, phone: string) => void;
};

export function ContactModal({ open, isSubmitting, onCancel, onSubmit }: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Ingresá tu nombre completo.");
      return;
    }
    if (phone.trim().length < 6) {
      setError("Ingresá un celular válido.");
      return;
    }
    setError("");
    onSubmit(name.trim(), phone.trim());
  }

  return (
    <div className="pdh-modal-backdrop" onClick={onCancel}>
      <div className="pdh-modal" onClick={(event) => event.stopPropagation()}>
        <h2>Tus datos de contacto</h2>
        <p className="pdh-modal-text">
          Los necesitamos para coordinar la entrega. No hace falta registrarse ni crear cuenta.
        </p>

        <form onSubmit={handleSubmit} className="pdh-modal-form">
          <label className="pdh-field-label">
            Nombre y apellido
            <input
              type="text"
              className="pdh-text-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Juan Pérez"
              autoFocus
            />
          </label>

          <label className="pdh-field-label">
            Celular
            <input
              type="tel"
              className="pdh-text-input"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="099 123 456"
            />
          </label>

          {error ? <p className="pdh-form-error">{error}</p> : null}

          <div className="pdh-modal-actions">
            <button type="button" className="pdh-button pdh-button--ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="pdh-button pdh-button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Redirigiendo..." : "Confirmar y pagar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
