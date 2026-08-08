import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useSearch } from "./SearchContext";
import { CartIcon, UserIcon } from "./icons";

const PUBLIC_NAV_LINKS = [
  { to: "/", label: "Catálogo", end: true },
  { to: "/ofertas", label: "Ofertas", end: false }
];

const ADMIN_NAV_LINKS = [
  { to: "/panel", label: "Panel", end: false },
  { to: "/productos", label: "Productos", end: false }
];

export function PdhHeader() {
  const { totalCount } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { isLoggedIn, openLoginModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navLinks = isLoggedIn ? [...PUBLIC_NAV_LINKS, ...ADMIN_NAV_LINKS] : PUBLIC_NAV_LINKS;

  function handleUserIconClick() {
    if (isLoggedIn) {
      setIsUserMenuOpen((prev) => !prev);
    } else {
      openLoginModal();
    }
  }

  return (
    <header className="pdh-topbar">
      <div className="pdh-topbar-inner">
        <NavLink to="/" className="pdh-wordmark" aria-label="Piel de Hincha, ir al catálogo">
          <img src={`${import.meta.env.BASE_URL}logo-cliente.png`} alt="Piel de Hincha" className="pdh-logo-image" />
        </NavLink>

        <div className="pdh-header-search">
          <input
            type="search"
            placeholder="Buscar camiseta..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Buscar camiseta"
          />
          <span className="pdh-header-search-divider" aria-hidden="true" />
          <span className="pdh-header-search-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
              <line x1="13.2" y1="13.2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <nav className="pdh-topnav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `pdh-topnav-link${isActive ? " pdh-topnav-link--active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pdh-user-menu">
            <button
              type="button"
              className="pdh-user-icon-button"
              aria-label={isLoggedIn ? "Cuenta de administrador" : "Iniciar sesión"}
              onClick={handleUserIconClick}
            >
              <UserIcon size={19} />
            </button>
            {isUserMenuOpen && isLoggedIn ? (
              <div className="pdh-user-dropdown">
                <button
                  type="button"
                  className="pdh-user-dropdown-item"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : null}
          </div>

          <NavLink to="/carrito" className="pdh-cart-link" aria-label="Ver carrito">
            <CartIcon size={19} />
            {totalCount > 0 ? <span className="pdh-cart-badge">{totalCount}</span> : null}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
