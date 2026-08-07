import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createCheckoutPreference, getProducts } from "./camisetas.api";
import type { CamisetaProduct } from "./camisetas.types";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

export function CamisetasHomePage() {
  const [products, setProducts] = useState<CamisetaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [redirectingId, setRedirectingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getProducts();
      setProducts(result.items);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el catalogo.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBuy(productId: string) {
    setRedirectingId(productId);
    try {
      const { initPoint } = await createCheckoutPreference(productId);
      window.location.href = initPoint;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
      setRedirectingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) => product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <main className="pdh-shell">
      <header className="pdh-header">
        <div className="pdh-brand">
          <div className="pdh-logo" aria-hidden="true">
            PdH
          </div>
          <div>
            <p className="pdh-kicker">Pieldehincha</p>
            <h1>Camisetas para hinchas de verdad</h1>
          </div>
        </div>

        <div className="pdh-search">
          <span className="pdh-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar camiseta por nombre o color..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Buscar camiseta"
          />
        </div>
      </header>

      {isLoading ? <p className="pdh-empty-state">Cargando catalogo...</p> : null}

      {loadError ? (
        <div className="pdh-panel">
          <p className="pdh-empty-state">No se pudo cargar el catalogo: {loadError}</p>
          <button type="button" className="pdh-button pdh-button--ghost" onClick={() => void loadProducts()}>
            Reintentar
          </button>
        </div>
      ) : null}

      {!isLoading && !loadError && filteredProducts.length === 0 ? (
        <p className="pdh-empty-state">No encontramos camisetas que coincidan con "{searchTerm}".</p>
      ) : null}

      {!isLoading && !loadError && filteredProducts.length > 0 ? (
        <div className="pdh-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="pdh-card">
              <div className="pdh-card-image-wrap">
                <img src={product.imageUrl} alt={product.name} className="pdh-card-image" />
              </div>

              <div className="pdh-card-body">
                <h2>{product.name}</h2>
                <p className="pdh-card-description">{product.description}</p>
                <strong className="pdh-card-price">{formatPrice(product.price, product.currency)}</strong>

                <button
                  type="button"
                  className="pdh-button pdh-button--primary"
                  onClick={() => void handleBuy(product.id)}
                  disabled={redirectingId === product.id}
                >
                  {redirectingId === product.id ? "Redirigiendo..." : "Comprar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}
