import { Navigate, Route, Routes } from "react-router-dom";
import { CamisetasHomePage } from "../features/camisetas/CamisetasHomePage";
import { CartPage } from "../features/camisetas/CartPage";
import { CheckoutResultPage } from "../features/camisetas/CheckoutResultPage";
import { OfertasPage } from "../features/camisetas/OfertasPage";
import { PanelPage } from "../features/camisetas/PanelPage";
import { ProductosPage } from "../features/camisetas/ProductosPage";

function HealthPage() {
  return (
    <main style={{ fontFamily: "Inter, Segoe UI, sans-serif", padding: "2rem" }}>
      <h2>Frontend Camisetas OK</h2>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CamisetasHomePage />} />
      <Route
        path="/compra-exitosa"
        element={
          <CheckoutResultPage
            status="success"
            title="Pago aprobado"
            message="Gracias por tu compra! Te vamos a contactar para coordinar la entrega."
            clearsCart
          />
        }
      />
      <Route
        path="/compra-pendiente"
        element={
          <CheckoutResultPage
            status="pending"
            title="Pago pendiente"
            message="Tu pago esta pendiente de confirmacion. Te avisamos apenas se acredite."
          />
        }
      />
      <Route
        path="/compra-fallida"
        element={
          <CheckoutResultPage
            status="failure"
            title="Pago no completado"
            message="No se pudo procesar el pago. Podes intentar de nuevo cuando quieras."
          />
        }
      />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/ofertas" element={<OfertasPage />} />
      <Route path="/panel" element={<PanelPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
