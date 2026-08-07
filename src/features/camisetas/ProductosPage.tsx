import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { checkAdminKey, getProducts, updateProduct, uploadProductImage } from "./camisetas.api";
import { compressImageFile, ImageTooHeavyError } from "./image-compress";
import type { CamisetaProduct } from "./camisetas.types";
import { PdhNav } from "./PdhNav";

const ADMIN_KEY_STORAGE = "camisetas-admin-key";

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
};

export function ProductosPage() {
  const [adminKey, setAdminKey] = useState<string | null>(() => sessionStorage.getItem(ADMIN_KEY_STORAGE));
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  const [products, setProducts] = useState<CamisetaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, EditableFields>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (adminKey) void loadProducts();
  }, [adminKey]);

  async function loadProducts() {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await getProducts();
      setProducts(result.items);
      setDrafts(
        Object.fromEntries(
          result.items.map((product) => [
            product.id,
            { name: product.name, description: product.description, price: String(product.price) }
          ])
        )
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar el catalogo.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setIsCheckingLogin(true);
    setLoginError("");
    try {
      const ok = await checkAdminKey(passwordInput);
      if (!ok) {
        setLoginError("Clave incorrecta.");
        return;
      }
      sessionStorage.setItem(ADMIN_KEY_STORAGE, passwordInput);
      setAdminKey(passwordInput);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "No se pudo validar la clave.");
    } finally {
      setIsCheckingLogin(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey(null);
    setPasswordInput("");
  }

  function updateDraft(productId: string, field: keyof EditableFields, value: string) {
    setDrafts((prev) => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  }

  async function handleSave(productId: string) {
    if (!adminKey) return;
    const draft = drafts[productId];
    const price = Number(draft.price);
    if (!draft.name.trim() || !draft.description.trim() || !Number.isFinite(price) || price <= 0) {
      toast.error("Revisá nombre, descripción y precio antes de guardar.");
      return;
    }

    setSavingId(productId);
    try {
      const updated = await updateProduct(productId, adminKey, {
        name: draft.name.trim(),
        description: draft.description.trim(),
        price
      });
      setProducts((prev) => prev.map((product) => (product.id === productId ? updated : product)));
      toast.success("Producto actualizado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleImageChange(productId: string, file: File | undefined) {
    if (!file || !adminKey) return;

    setUploadingId(productId);
    try {
      const compressed = await compressImageFile(file);
      await uploadProductImage(productId, adminKey, compressed);
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

  if (!adminKey) {
    return (
      <main className="pdh-shell pdh-shell--narrow">
        <PdhNav />
        <header className="pdh-header pdh-header--simple">
          <div className="pdh-brand">
            <div className="pdh-logo" aria-hidden="true">
              PdH
            </div>
            <div>
              <p className="pdh-kicker">Pieldehincha</p>
              <h1>Productos</h1>
            </div>
          </div>
        </header>

        <form className="pdh-panel" onSubmit={handleLogin}>
          <p className="pdh-empty-state">Ingresá la clave de administrador para editar el catálogo.</p>
          <input
            type="password"
            className="pdh-text-input"
            placeholder="Clave"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            autoFocus
          />
          {loginError ? <p className="pdh-form-error">{loginError}</p> : null}
          <button type="submit" className="pdh-button pdh-button--primary" disabled={isCheckingLogin || !passwordInput}>
            {isCheckingLogin ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </main>
    );
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
            <h1>Productos</h1>
          </div>
        </div>

        <div className="pdh-header-actions">
          <button type="button" className="pdh-button pdh-button--ghost" onClick={handleLogout}>
            Salir
          </button>
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
            const draft = drafts[product.id] ?? { name: product.name, description: product.description, price: String(product.price) };
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

                  <p className="pdh-empty-state">Precio actual: {formatPrice(product.price, product.currency)}</p>

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
  );
}
