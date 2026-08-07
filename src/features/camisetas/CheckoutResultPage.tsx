import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";

type CheckoutResultPageProps = {
  title: string;
  message: string;
  clearsCart?: boolean;
};

export function CheckoutResultPage({ title, message, clearsCart }: CheckoutResultPageProps) {
  const { clear } = useCart();

  useEffect(() => {
    if (clearsCart) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearsCart]);

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
