import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createCheckoutPreference, getProduct } from "./camisetas.api";
import type { CamisetaProduct } from "./camisetas.types";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

export function CamisetasHomePage() {
  const [product, setProduct] = useState<CamisetaProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    void loadProduct();
  }, []);

  async function loadProduct() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getProduct();
      setProduct(result.item);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el producto.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBuy() {
    setIsRedirecting(true);
    try {
      const { initPoint } = await createCheckoutPreference();
      window.location.href = initPoint;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
      setIsRedirecting(false);
    }
  }

  return (
    <main className="camisetas-shell">
      <header className="camisetas-header">
        <p className="camisetas-kicker">Camisetas</p>
        <h1>Catalogo</h1>
      </header>

      {isLoading ? <p className="camisetas-empty-state">Cargando producto...</p> : null}

      {loadError ? (
        <div className="camisetas-panel">
          <p className="camisetas-empty-state">No se pudo cargar el producto: {loadError}</p>
          <button type="button" className="camisetas-button camisetas-button--ghost" onClick={() => void loadProduct()}>
            Reintentar
          </button>
        </div>
      ) : null}

      {!isLoading && !loadError && product ? (
        <article className="camisetas-product-card">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="camisetas-product-image" />
          ) : (
            <div className="camisetas-product-image camisetas-product-image--placeholder" />
          )}

          <div className="camisetas-product-info">
            <h2>{product.name}</h2>
            <p className="camisetas-product-description">{product.description}</p>
            <strong className="camisetas-product-price">{formatPrice(product.price, product.currency)}</strong>

            <button
              type="button"
              className="camisetas-button camisetas-button--primary"
              onClick={handleBuy}
              disabled={isRedirecting}
            >
              {isRedirecting ? "Redirigiendo a Mercado Pago..." : "Comprar"}
            </button>
          </div>
        </article>
      ) : null}
    </main>
  );
}
