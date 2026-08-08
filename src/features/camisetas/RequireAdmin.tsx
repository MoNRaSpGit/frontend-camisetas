import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { PdhHeader } from "./PdhHeader";
import { PdhFooter } from "./PdhFooter";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoggedIn, openLoginModal } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="pdh-page">
        <PdhHeader />
        <main className="pdh-shell">
          <div className="pdh-panel">
            <p className="pdh-empty-state">Esta sección es solo para el administrador de la tienda.</p>
            <button type="button" className="pdh-button pdh-button--primary" onClick={openLoginModal}>
              Iniciar sesión
            </button>
          </div>
        </main>
        <PdhFooter />
      </div>
    );
  }

  return <>{children}</>;
}
