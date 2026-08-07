import { NavLink } from "react-router-dom";

export function PdhNav() {
  return (
    <nav className="pdh-nav">
      <NavLink to="/" end className={({ isActive }) => `pdh-nav-link${isActive ? " pdh-nav-link--active" : ""}`}>
        Catálogo
      </NavLink>
      <NavLink to="/panel" className={({ isActive }) => `pdh-nav-link${isActive ? " pdh-nav-link--active" : ""}`}>
        Panel
      </NavLink>
      <NavLink to="/productos" className={({ isActive }) => `pdh-nav-link${isActive ? " pdh-nav-link--active" : ""}`}>
        Productos
      </NavLink>
    </nav>
  );
}
