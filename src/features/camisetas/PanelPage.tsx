import { useEffect, useMemo, useState } from "react";
import { getPanelSummary } from "./camisetas.api";
import type { CamisetaPanelSummary, CamisetaSaleMovement } from "./camisetas.types";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";
import { SalesChart, type ChartPoint } from "./SalesChart";

const MOVEMENTS_PREVIEW_COUNT = 3;

// Datos ficticios para mostrar como quedaria el grafico mientras no hay
// suficiente historial real todavia (boceto para el cliente). Cuando haya
// mas ventas reales en distintos dias, esto se reemplaza por buildChartData.
const DEMO_CHART_DATA: ChartPoint[] = [
  { label: "Lun", value: 3200 },
  { label: "Mar", value: 5100 },
  { label: "Mié", value: 2800 },
  { label: "Jue", value: 6400 },
  { label: "Vie", value: 8900 },
  { label: "Sáb", value: 11200 },
  { label: "Dom", value: 7600 }
];
const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_CLASSES = ["pdh-qty-badge--gold", "pdh-qty-badge--silver", "pdh-qty-badge--bronze"];

type Order = {
  paymentId: string;
  createdAt: string;
  total: number;
  items: CamisetaSaleMovement[];
};

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" });
}

function groupIntoOrders(movimientos: CamisetaSaleMovement[]): Order[] {
  const map = new Map<string, Order>();
  for (const movement of movimientos) {
    const lineTotal = movement.unitPrice * movement.quantity;
    const existing = map.get(movement.mpPaymentId);
    if (existing) {
      existing.total += lineTotal;
      existing.items.push(movement);
    } else {
      map.set(movement.mpPaymentId, {
        paymentId: movement.mpPaymentId,
        createdAt: movement.createdAt,
        total: lineTotal,
        items: [movement]
      });
    }
  }
  return Array.from(map.values());
}

export function PanelPage() {
  const [summary, setSummary] = useState<CamisetaPanelSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showAllMovements, setShowAllMovements] = useState(false);

  useEffect(() => {
    void loadSummary();
  }, []);

  async function loadSummary() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getPanelSummary();
      setSummary(result);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el panel.");
    } finally {
      setIsLoading(false);
    }
  }

  const orders = useMemo(() => (summary ? groupIntoOrders(summary.movimientos) : []), [summary]);
  const visibleOrders = showAllMovements ? orders : orders.slice(0, MOVEMENTS_PREVIEW_COUNT);
  const hasHiddenMovements = orders.length > MOVEMENTS_PREVIEW_COUNT;

  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell">
        <header className="pdh-header">
          <div>
            <p className="pdh-kicker">Piel de Hincha</p>
            <h1>Panel de control</h1>
          </div>
        </header>

        {isLoading ? <p className="pdh-empty-state">Cargando panel...</p> : null}

        {loadError ? (
          <div className="pdh-panel">
            <p className="pdh-empty-state">No se pudo cargar el panel: {loadError}</p>
            <button type="button" className="pdh-button pdh-button--ghost" onClick={() => void loadSummary()}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!isLoading && !loadError && summary ? (
          <>
            <section className="pdh-stats-grid">
              <div className="pdh-stat-card">
                <span className="pdh-stat-icon pdh-stat-icon--indigo">💰</span>
                <div>
                  <p className="pdh-stat-label">Total vendido</p>
                  <strong className="pdh-stat-value">{formatPrice(summary.totalVendido, summary.currency)}</strong>
                </div>
              </div>
              <div className="pdh-stat-card">
                <span className="pdh-stat-icon pdh-stat-icon--green">📈</span>
                <div>
                  <p className="pdh-stat-label">Ganancias</p>
                  <strong className="pdh-stat-value">{formatPrice(summary.totalGanancia, summary.currency)}</strong>
                </div>
              </div>
              <div className="pdh-stat-card">
                <span className="pdh-stat-icon pdh-stat-icon--orange">👕</span>
                <div>
                  <p className="pdh-stat-label">Camisetas vendidas</p>
                  <strong className="pdh-stat-value">{summary.cantidadVentas}</strong>
                </div>
              </div>
            </section>

            <section className="pdh-panel-section">
              <div className="pdh-panel-heading-row">
                <h2>Movimientos</h2>
                {hasHiddenMovements ? (
                  <button type="button" className="pdh-mini-button" onClick={() => setShowAllMovements((prev) => !prev)}>
                    {showAllMovements ? "Ver menos" : `Ver todos (${orders.length})`}
                  </button>
                ) : null}
              </div>

              {orders.length === 0 ? (
                <p className="pdh-empty-state">Todavia no hay movimientos registrados.</p>
              ) : (
                <ul className="pdh-order-list">
                  {visibleOrders.map((order) => (
                    <li key={order.paymentId} className="pdh-order-item pdh-order-item--stacked">
                      <button
                        type="button"
                        className="pdh-order-item pdh-order-item--flat pdh-order-item--clickable"
                        onClick={() => setExpandedOrderId((current) => (current === order.paymentId ? null : order.paymentId))}
                      >
                        <div>
                          <strong>{formatDate(order.createdAt)}</strong>
                          <p className="pdh-order-item-meta">
                            {order.items.length} {order.items.length === 1 ? "camiseta" : "camisetas"} · Pago {order.paymentId}
                          </p>
                        </div>
                        <strong className="pdh-amount-plus">+{formatPrice(order.total, order.items[0].currency)}</strong>
                      </button>

                      {expandedOrderId === order.paymentId ? (
                        <ul className="pdh-order-detail-list">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              <span className="pdh-qty-badge">{item.quantity}</span>
                              <div>
                                <strong>{item.productName}</strong>
                                <p className="pdh-order-item-meta">{formatPrice(item.unitPrice, item.currency)} c/u</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="pdh-panel-section">
              <h2>Mas vendidas</h2>
              {summary.masVendidas.length === 0 ? (
                <p className="pdh-empty-state">Todavia no hay ventas registradas.</p>
              ) : (
                <ul className="pdh-order-list">
                  {summary.masVendidas.map((item, index) => (
                    <li key={item.productId} className="pdh-order-item">
                      <div className="pdh-order-item-info">
                        <span className={`pdh-qty-badge ${MEDAL_CLASSES[index] ?? ""}`}>
                          {MEDALS[index] ?? `#${index + 1}`}
                        </span>
                        <div>
                          <strong>{item.productName}</strong>
                          <p className="pdh-order-item-meta">{formatPrice(item.totalVendido, summary.currency)}</p>
                        </div>
                      </div>
                      <span className="pdh-qty-badge">{item.unitsSold}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="pdh-panel-section">
              <div className="pdh-panel-heading-row">
                <h2>Ventas por día</h2>
                <span className="pdh-demo-badge">Boceto</span>
              </div>
              <div className="pdh-chart-card">
                <SalesChart data={DEMO_CHART_DATA} currency={summary.currency} />
              </div>
              <p className="pdh-order-item-meta">
                Datos de ejemplo para mostrar como va a quedar. Cuando tengas ventas reales de varios días, se
                reemplaza solo.
              </p>
            </section>
          </>
        ) : null}
      </main>

      <PdhFooter />
    </div>
  );
}
