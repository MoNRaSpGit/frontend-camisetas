import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

const AUTO_CLOSE_MS = 4500;

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function resolveImageUrl(imageUrl: string) {
  if (/^(data:|https?:)/.test(imageUrl)) return imageUrl;
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}

export function CartDrawer() {
  const { items, totalPrice, isDrawerOpen, closeDrawer } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    timerRef.current = setTimeout(closeDrawer, AUTO_CLOSE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, items]);

  const currency = items[0]?.currency || "UYU";

  return (
    <>
      <div
        className={`pdh-drawer-backdrop${isDrawerOpen ? " pdh-drawer-backdrop--visible" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside className={`pdh-drawer${isDrawerOpen ? " pdh-drawer--open" : ""}`} aria-hidden={!isDrawerOpen}>
        <div className="pdh-drawer-header">
          <p className="pdh-drawer-title">✓ Agregado al carrito</p>
          <button type="button" className="pdh-drawer-close" onClick={closeDrawer} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="pdh-drawer-list">
          {items.map((item) => (
            <div key={item.productId} className="pdh-drawer-item">
              <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="pdh-drawer-item-image" />
              <div className="pdh-drawer-item-info">
                <p className="pdh-drawer-item-name">{item.name}</p>
                <p className="pdh-drawer-item-meta">
                  {item.quantity} × {formatPrice(item.unitPrice, item.currency)}
                </p>
              </div>
              <strong>{formatPrice(item.unitPrice * item.quantity, item.currency)}</strong>
            </div>
          ))}
        </div>

        <div className="pdh-drawer-total">
          <span>Total</span>
          <strong>{formatPrice(totalPrice, currency)}</strong>
        </div>

        <div className="pdh-drawer-actions">
          <Link to="/carrito" className="pdh-button pdh-button--primary" onClick={closeDrawer}>
            Ver carrito
          </Link>
          <button type="button" className="pdh-button pdh-button--ghost" onClick={closeDrawer}>
            Seguir comprando
          </button>
        </div>
      </aside>
    </>
  );
}
