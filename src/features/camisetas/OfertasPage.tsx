import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { getProducts } from "./camisetas.api";
import type { CamisetaProduct } from "./camisetas.types";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function resolveImageUrl(imageUrl: string) {
  if (/^(data:|https?:)/.test(imageUrl)) return imageUrl;
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}

export function OfertasPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<CamisetaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getProducts();
      setProducts(result.items.filter((product) => product.salePrice !== null));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudieron cargar las ofertas.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart(product: CamisetaProduct) {
    addItem(product);
  }

  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell">
        <section className="pdh-ofertas-hero">
          <p className="pdh-carousel-eyebrow">Tiempo limitado</p>
          <h1>Ofertas hasta 50% OFF</h1>
          <p className="pdh-ofertas-hero-text">Las camisetas seleccionadas de esta semana, con el precio más bajo del catálogo.</p>
        </section>

        {isLoading ? <p className="pdh-empty-state">Cargando ofertas...</p> : null}

        {loadError ? (
          <div className="pdh-panel">
            <p className="pdh-empty-state">No se pudieron cargar las ofertas: {loadError}</p>
            <button type="button" className="pdh-button pdh-button--ghost" onClick={() => void loadProducts()}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!isLoading && !loadError && products.length === 0 ? (
          <p className="pdh-empty-state">No hay ofertas activas en este momento.</p>
        ) : null}

        {!isLoading && !loadError && products.length > 0 ? (
          <div className="pdh-grid">
            {products.map((product) => {
              const salePrice = product.salePrice as number;
              const discountPct = Math.round(100 - (salePrice / product.price) * 100);
              return (
                <article key={product.id} className="pdh-card pdh-card--sale">
                  <div className="pdh-card-image-wrap">
                    <span className="pdh-sale-badge">-{discountPct}%</span>
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="pdh-card-image" />
                  </div>

                  <div className="pdh-card-body">
                    <h2>{product.name}</h2>
                    <p className="pdh-card-description">{product.description}</p>
                    <div className="pdh-price-row">
                      <span className="pdh-price-old">{formatPrice(product.price, product.currency)}</span>
                      <strong className="pdh-card-price pdh-card-price--sale">
                        {formatPrice(salePrice, product.currency)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="pdh-button pdh-button--primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </main>

      <PdhFooter />
    </div>
  );
}
