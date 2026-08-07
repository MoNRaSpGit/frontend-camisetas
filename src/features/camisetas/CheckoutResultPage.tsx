import { Link } from "react-router-dom";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";

type CheckoutResultPageProps = {
  title: string;
  message: string;
};

export function CheckoutResultPage({ title, message }: CheckoutResultPageProps) {
  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell pdh-shell--narrow">
        <header className="pdh-header pdh-header--simple">
          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1>{title}</h1>
          </div>
        </header>

        <p className="pdh-empty-state">{message}</p>

        <Link to="/" className="pdh-button pdh-button--ghost pdh-button--link">
          Volver al catalogo
        </Link>
      </main>

      <PdhFooter />
    </div>
  );
}
