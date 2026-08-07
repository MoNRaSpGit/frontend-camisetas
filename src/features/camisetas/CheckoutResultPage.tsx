import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "./icons";

type CheckoutResultStatus = "success" | "pending" | "failure";

type CheckoutResultPageProps = {
  status: CheckoutResultStatus;
  title: string;
  message: string;
  clearsCart?: boolean;
};

const STATUS_ICON: Record<CheckoutResultStatus, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  pending: ClockIcon,
  failure: XCircleIcon
};

export function CheckoutResultPage({ status, title, message, clearsCart }: CheckoutResultPageProps) {
  const { clear } = useCart();
  const StatusIcon = STATUS_ICON[status];

  useEffect(() => {
    if (clearsCart) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearsCart]);

  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell pdh-shell--narrow">
        <div className={`pdh-result-card pdh-result-card--${status}`}>
          <span className="pdh-result-icon">
            <StatusIcon size={34} />
          </span>

          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1 className="pdh-result-title">{title}</h1>
          </div>

          <p className="pdh-result-message">{message}</p>

          <div className="pdh-result-actions">
            <Link to="/" className="pdh-button pdh-button--primary">
              Volver al catálogo
            </Link>
            {status !== "success" ? (
              <Link to="/carrito" className="pdh-button pdh-button--ghost">
                Ver mi carrito
              </Link>
            ) : null}
          </div>
        </div>
      </main>

      <PdhFooter />
    </div>
  );
}
