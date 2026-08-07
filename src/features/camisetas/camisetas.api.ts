import { API_BASE_URL } from "../../shared/config/api";
import type { CamisetaProduct } from "./camisetas.types";

type ProductResponse = {
  item: CamisetaProduct;
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

export async function getProduct(): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE_URL}/camisetas/product`, { cache: "no-store" });
  return readJson<ProductResponse>(response);
}

export async function createCheckoutPreference(): Promise<CheckoutResponse> {
  const response = await fetch(`${API_BASE_URL}/camisetas/checkout`, { method: "POST" });
  return readJson<CheckoutResponse>(response);
}
