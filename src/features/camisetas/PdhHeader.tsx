import { NavLink } from "react-router-dom";
import { useCart } from "./CartContext";

const NAV_LINKS = [
  { to: "/", label: "Catálogo", end: true },
  { to: "/ofertas", label: "Ofertas", end: false },
  { to: "/panel", label: "Panel", end: false },
  { to: "/productos", label: "Productos", end: false }
];

export function PdhHeader() {
  const { totalCount } = useCart();

  return (
    <header className="pdh-topbar">
      <div className="pdh-topbar-inner">
        <NavLink to="/" className="pdh-wordmark" aria-label="Pieldehincha, ir al catálogo">
          <span className="pdh-wordmark-badge">PdH</span>
          <span className="pdh-wordmark-text">
            Pieldehincha
            <small>Camisetas de fútbol</small>
          </span>
        </NavLink>

        <nav className="pdh-topnav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `pdh-topnav-link${isActive ? " pdh-topnav-link--active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink to="/carrito" className="pdh-cart-link" aria-label="Ver carrito">
            🛒
            {totalCount > 0 ? <span className="pdh-cart-badge">{totalCount}</span> : null}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
