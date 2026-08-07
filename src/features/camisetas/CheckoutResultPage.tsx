import { Link } from "react-router-dom";

type CheckoutResultPageProps = {
  title: string;
  message: string;
};

export function CheckoutResultPage({ title, message }: CheckoutResultPageProps) {
  return (
    <main className="camisetas-shell">
      <header className="camisetas-header">
        <p className="camisetas-kicker">Camisetas</p>
        <h1>{title}</h1>
      </header>

      <p className="camisetas-empty-state">{message}</p>

      <Link to="/" className="camisetas-button camisetas-button--ghost camisetas-button--link">
        Volver al catalogo
      </Link>
    </main>
  );
}
