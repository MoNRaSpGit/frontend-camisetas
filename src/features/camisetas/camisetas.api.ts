import { API_BASE_URL } from "../../shared/config/api";
import type { CamisetaPanelSummary, CamisetaProduct } from "./camisetas.types";

type ProductsResponse = {
  items: CamisetaProduct[];
};

type CheckoutResponse = {
  initPoint: string;
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const fallbackText = await response.text().catch(() => "");
    let parsedMessage: string | undefined;
    try {
      const parsed = JSON.parse(fallbackText) as { message?: string | string[] };
      parsedMessage = Array.isArray(parsed.message) ? parsed.message[0] : parsed.message;
    } catch {
      // El cuerpo no era JSON, se usa el texto crudo como fallback.
    }
    throw new Error(parsedMessage || fallbackText || `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE_URL}/camisetas/products`, { cache: "no-store" });
  return readJson<ProductsResponse>(response);
}

export type CheckoutCartItem = {
  productId: string;
  quantity: number;
};

export async function createCheckoutPreference(items: CheckoutCartItem[]): Promise<CheckoutResponse> {
  const response = await fetch(`${API_BASE_URL}/camisetas/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  return readJson<CheckoutResponse>(response);
}

export async function getPanelSummary(): Promise<CamisetaPanelSummary> {
  const response = await fetch(`${API_BASE_URL}/camisetas/panel/summary`, { cache: "no-store" });
  return readJson<CamisetaPanelSummary>(response);
}

export async function updateProduct(
  productId: string,
  dto: { name?: string; description?: string; price?: number; salePrice?: number | null; category?: string }
): Promise<CamisetaProduct> {
  const response = await fetch(`${API_BASE_URL}/camisetas/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  });
  return readJson<CamisetaProduct>(response);
}

export async function uploadProductImage(productId: string, imageDataUri: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/camisetas/products/${productId}/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageDataUri })
  });
  await readJson<{ ok: boolean }>(response);
}
