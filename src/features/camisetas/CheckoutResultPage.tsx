import { Link } from "react-router-dom";

type CheckoutResultPageProps = {
  title: string;
  message: string;
};

export function CheckoutResultPage({ title, message }: CheckoutResultPageProps) {
  return (
    <main className="pdh-shell pdh-shell--narrow">
      <header className="pdh-header pdh-header--simple">
        <div className="pdh-brand">
          <div className="pdh-logo" aria-hidden="true">
            PdH
          </div>
          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1>{title}</h1>
          </div>
        </div>
      </header>

      <p className="pdh-empty-state">{message}</p>

      <Link to="/" className="pdh-button pdh-button--ghost pdh-button--link">
        Volver al catalogo
      </Link>
    </main>
  );
}
