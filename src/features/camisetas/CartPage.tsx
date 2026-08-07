import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "./CartContext";
import { createCheckoutPreference } from "./camisetas.api";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";
import { CartIcon, RemoveIcon } from "./icons";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function resolveImageUrl(imageUrl: string) {
  if (/^(data:|https?:)/.test(imageUrl)) return imageUrl;
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}

export function CartPage() {
  const { items, totalPrice, removeItem, setQuantity } = useCart();
  const [isPaying, setIsPaying] = useState(false);

  const currency = items[0]?.currency || "UYU";
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  async function handlePay() {
    if (items.length === 0) return;
    setIsPaying(true);
    try {
      const { initPoint } = await createCheckoutPreference(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );
      window.location.href = initPoint;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
      setIsPaying(false);
    }
  }

  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell">
        <header className="pdh-header pdh-header--simple">
          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1>Tu carrito {items.length > 0 ? <span className="pdh-cart-page-count">({totalUnits})</span> : null}</h1>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="pdh-cart-empty">
            <span className="pdh-cart-empty-icon">
              <CartIcon size={30} />
            </span>
            <p className="pdh-empty-state">Todavía no agregaste ninguna camiseta.</p>
            <Link to="/" className="pdh-button pdh-button--primary">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="pdh-cart-layout">
            <div className="pdh-cart-list">
              {items.map((item) => (
                <article key={item.productId} className="pdh-cart-item">
                  <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="pdh-cart-item-image" />

                  <div className="pdh-cart-item-info">
                    <p className="pdh-cart-item-name">{item.name}</p>
                    <p className="pdh-cart-item-price">{formatPrice(item.unitPrice, item.currency)} c/u</p>

                    <div className="pdh-qty-stepper">
                      <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Restar">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="Sumar">
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pdh-cart-item-end">
                    <button
                      type="button"
                      className="pdh-cart-remove"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Quitar ${item.name}`}
                    >
                      <RemoveIcon size={16} />
                    </button>
                    <strong>{formatPrice(item.unitPrice * item.quantity, item.currency)}</strong>
                  </div>
                </article>
              ))}
            </div>

            <aside className="pdh-cart-summary">
              <h2>Resumen del pedido</h2>

              <div className="pdh-cart-summary-row">
                <span>
                  {totalUnits} {totalUnits === 1 ? "camiseta" : "camisetas"}
                </span>
                <span>{formatPrice(totalPrice, currency)}</span>
              </div>

              <div className="pdh-cart-summary-total">
                <span>Total</span>
                <strong>{formatPrice(totalPrice, currency)}</strong>
              </div>

              <button
                type="button"
                className="pdh-button pdh-button--primary"
                onClick={() => void handlePay()}
                disabled={isPaying}
              >
                {isPaying ? "Redirigiendo..." : "Pagar con Mercado Pago"}
              </button>

              <Link to="/" className="pdh-button pdh-button--ghost pdh-button--link">
                Seguir comprando
              </Link>
            </aside>
          </div>
        )}
      </main>

      <PdhFooter />
    </div>
  );
}
