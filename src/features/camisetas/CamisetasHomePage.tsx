import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartContext";
import { useSearch } from "./SearchContext";
import { getProducts } from "./camisetas.api";
import type { CamisetaProduct } from "./camisetas.types";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";
import { PdhCarousel, type CarouselSlide } from "./PdhCarousel";

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: "nuevas",
    eyebrow: "Recién llegadas",
    title: "Camisetas nuevas cada semana",
    text: "Sumamos modelos todo el tiempo. Volvé seguido para no perderte nada.",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #6d28d9 100%)"
  },
  {
    id: "ofertas",
    eyebrow: "Tiempo limitado",
    title: "Hasta 50% OFF en modelos seleccionados",
    text: "Mirá la pestaña Ofertas antes de que se acaben.",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)"
  },
  {
    id: "envios",
    eyebrow: "Envíos a todo el país",
    title: "Recibí tu camiseta donde estés",
    text: "Coordinamos la entrega apenas se acredita el pago.",
    gradient: "linear-gradient(135deg, #0f172a 0%, #0e7490 55%, #06b6d4 100%)"
  }
];

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function resolveImageUrl(imageUrl: string) {
  if (/^(data:|https?:)/.test(imageUrl)) return imageUrl;
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}

export function CamisetasHomePage() {
  const { addItem } = useCart();
  const { searchTerm } = useSearch();
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
      setProducts(result.items);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el catalogo.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart(product: CamisetaProduct) {
    addItem(product);
  }

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) => product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="pdh-page">
      <PdhHeader />

      <PdhCarousel slides={HERO_SLIDES} />

      <main className="pdh-shell">
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
                  {product.salePrice !== null ? (
                    <span className="pdh-sale-badge">
                      -{Math.round(100 - (product.salePrice / product.price) * 100)}%
                    </span>
                  ) : null}
                  <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="pdh-card-image" />
                </div>

                <div className="pdh-card-body">
                  <h2>{product.name}</h2>
                  <p className="pdh-card-description">{product.description}</p>
                  {product.salePrice !== null ? (
                    <div className="pdh-price-row">
                      <span className="pdh-price-old">{formatPrice(product.price, product.currency)}</span>
                      <strong className="pdh-card-price pdh-card-price--sale">
                        {formatPrice(product.salePrice, product.currency)}
                      </strong>
                    </div>
                  ) : (
                    <strong className="pdh-card-price">{formatPrice(product.price, product.currency)}</strong>
                  )}

                  <button
                    type="button"
                    className="pdh-button pdh-button--primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </main>

      <PdhFooter />
    </div>
  );
}
