import { useEffect, useState } from "react";
import { getPanelSummary } from "./camisetas.api";
import type { CamisetaPanelSummary } from "./camisetas.types";
import { PdhNav } from "./PdhNav";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" });
}

export function PanelPage() {
  const [summary, setSummary] = useState<CamisetaPanelSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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

  return (
    <main className="pdh-shell">
      <PdhNav />
      <header className="pdh-header">
        <div className="pdh-brand">
          <div className="pdh-logo" aria-hidden="true">
            PdH
          </div>
          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1>Panel de control</h1>
          </div>
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
              <p className="pdh-stat-label">Total vendido</p>
              <strong className="pdh-stat-value">{formatPrice(summary.totalVendido, summary.currency)}</strong>
            </div>
            <div className="pdh-stat-card">
              <p className="pdh-stat-label">Ganancias</p>
              <strong className="pdh-stat-value">{formatPrice(summary.totalGanancia, summary.currency)}</strong>
            </div>
            <div className="pdh-stat-card">
              <p className="pdh-stat-label">Camisetas vendidas</p>
              <strong className="pdh-stat-value">{summary.cantidadVentas}</strong>
            </div>
          </section>

          <section className="pdh-panel-section">
            <h2>Mas vendidas</h2>
            {summary.masVendidas.length === 0 ? (
              <p className="pdh-empty-state">Todavia no hay ventas registradas.</p>
            ) : (
              <div className="pdh-table-wrap">
                <table className="pdh-table">
                  <thead>
                    <tr>
                      <th>Camiseta</th>
                      <th>Unidades</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.masVendidas.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.productName}</td>
                        <td>{item.unitsSold}</td>
                        <td>{formatPrice(item.totalVendido, summary.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="pdh-panel-section">
            <h2>Movimientos</h2>
            {summary.movimientos.length === 0 ? (
              <p className="pdh-empty-state">Todavia no hay movimientos registrados.</p>
            ) : (
              <div className="pdh-table-wrap">
                <table className="pdh-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Camiseta</th>
                      <th>Precio</th>
                      <th>Pago MP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.movimientos.map((movement) => (
                      <tr key={movement.id}>
                        <td>{formatDate(movement.createdAt)}</td>
                        <td>{movement.productName}</td>
                        <td>{formatPrice(movement.unitPrice, movement.currency)}</td>
                        <td>{movement.mpPaymentId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
