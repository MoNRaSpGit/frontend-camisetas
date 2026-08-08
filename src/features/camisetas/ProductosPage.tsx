import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProducts, updateProduct, uploadProductImage } from "./camisetas.api";
import { compressImageFile, ImageTooHeavyError } from "./image-compress";
import { CAMISETA_CATEGORIES, type CamisetaProduct } from "./camisetas.types";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";

function formatPrice(amount: number, currency: string) {
  return amount.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 });
}

function resolveImageUrl(imageUrl: string) {
  if (/^(data:|https?:)/.test(imageUrl)) return imageUrl;
  return `${import.meta.env.BASE_URL}${imageUrl}`;
}

type EditableFields = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  category: string;
};

function draftFromProduct(product: CamisetaProduct): EditableFields {
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    salePrice: product.salePrice !== null ? String(product.salePrice) : "",
    category: product.category ?? ""
  };
}

export function ProductosPage() {
  const [products, setProducts] = useState<CamisetaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, EditableFields>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getProducts();
      setProducts(result.items);
      setDrafts(Object.fromEntries(result.items.map((product) => [product.id, draftFromProduct(product)])));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el catalogo.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateDraft(productId: string, field: keyof EditableFields, value: string) {
    setDrafts((prev) => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  }

  async function handleSave(productId: string) {
    const draft = drafts[productId];
    const price = Number(draft.price);
    if (!draft.name.trim() || !draft.description.trim() || !Number.isFinite(price) || price <= 0) {
      toast.error("Revisá nombre, descripción y precio antes de guardar.");
      return;
    }

    let salePrice: number | null = null;
    if (draft.salePrice.trim() !== "") {
      salePrice = Number(draft.salePrice);
      if (!Number.isFinite(salePrice) || salePrice <= 0) {
        toast.error("El precio de oferta no es válido.");
        return;
      }
      if (salePrice >= price) {
        toast.error("El precio de oferta debe ser menor al precio normal.");
        return;
      }
    }

    setSavingId(productId);
    try {
      const updated = await updateProduct(productId, {
        name: draft.name.trim(),
        description: draft.description.trim(),
        price,
        salePrice,
        category: draft.category || undefined
      });
      setProducts((prev) => prev.map((product) => (product.id === productId ? updated : product)));
      setDrafts((prev) => ({ ...prev, [productId]: draftFromProduct(updated) }));
      toast.success("Producto actualizado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleImageChange(productId: string, file: File | undefined) {
    if (!file) return;

    setUploadingId(productId);
    try {
      const compressed = await compressImageFile(file);
      await uploadProductImage(productId, compressed);
      toast.success("Imagen actualizada.");
      await loadProducts();
    } catch (error) {
      if (error instanceof ImageTooHeavyError) {
        toast.error("Esta imagen es demasiado pesada. Probá con otra foto.");
      } else {
        toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
      }
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="pdh-page">
      <PdhHeader />

      <main className="pdh-shell">
        <header className="pdh-header">
          <div>
            <p className="pdh-kicker">Piel de Hincha</p>
            <h1>Productos</h1>
          </div>
        </header>

        {isLoading ? <p className="pdh-empty-state">Cargando productos...</p> : null}

        {loadError ? (
          <div className="pdh-panel">
            <p className="pdh-empty-state">No se pudo cargar el catalogo: {loadError}</p>
            <button type="button" className="pdh-button pdh-button--ghost" onClick={() => void loadProducts()}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!isLoading && !loadError ? (
          <div className="pdh-admin-grid">
            {products.map((product) => {
              const draft = drafts[product.id] ?? draftFromProduct(product);
              return (
                <article key={product.id} className="pdh-admin-card">
                  <div className="pdh-card-image-wrap">
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="pdh-card-image" />
                  </div>

                  <div className="pdh-admin-card-body">
                    <label className="pdh-field-label">
                      Nombre
                      <input
                        type="text"
                        className="pdh-text-input"
                        value={draft.name}
                        onChange={(event) => updateDraft(product.id, "name", event.target.value)}
                      />
                    </label>

                    <label className="pdh-field-label">
                      Descripción
                      <textarea
                        className="pdh-text-input pdh-textarea"
                        value={draft.description}
                        onChange={(event) => updateDraft(product.id, "description", event.target.value)}
                      />
                    </label>

                    <label className="pdh-field-label">
                      Precio ({product.currency})
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="pdh-text-input"
                        value={draft.price}
                        onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                      />
                    </label>

                    <label className="pdh-field-label">
                      Precio de oferta (opcional)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Sin oferta"
                        className="pdh-text-input"
                        value={draft.salePrice}
                        onChange={(event) => updateDraft(product.id, "salePrice", event.target.value)}
                      />
                    </label>

                    <label className="pdh-field-label">
                      Categoría
                      <select
                        className="pdh-text-input"
                        value={draft.category}
                        onChange={(event) => updateDraft(product.id, "category", event.target.value)}
                      >
                        <option value="">Sin categoría</option>
                        {CAMISETA_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>

                    <p className="pdh-empty-state">
                      Precio actual: {formatPrice(product.price, product.currency)}
                      {product.salePrice !== null ? ` · Oferta: ${formatPrice(product.salePrice, product.currency)}` : ""}
                    </p>

                    <button
                      type="button"
                      className="pdh-button pdh-button--primary"
                      onClick={() => void handleSave(product.id)}
                      disabled={savingId === product.id}
                    >
                      {savingId === product.id ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <label className="pdh-button pdh-button--ghost pdh-file-button">
                      {uploadingId === product.id ? "Subiendo..." : "Cambiar imagen"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploadingId === product.id}
                        onChange={(event) => void handleImageChange(product.id, event.target.files?.[0])}
                      />
                    </label>
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
