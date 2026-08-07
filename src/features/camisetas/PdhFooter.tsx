import { InstagramIcon, WhatsAppIcon } from "./icons";

// Datos de contacto inventados (placeholder): reemplazar por los reales del
// cliente cuando los tenga. Estructura y links quedan listos.
const WHATSAPP_NUMBER = "59899123456";
const WHATSAPP_MESSAGE = "Hola! Quiero consultar por una camiseta.";
const INSTAGRAM_HANDLE = "pieldehincha.uy";
const LOCATION_LABEL = "Montevideo, Uruguay";

export function PdhFooter() {
  return (
    <footer className="pdh-footer">
      <div className="pdh-footer-inner">
        <div className="pdh-footer-brand">
          <span className="pdh-wordmark-badge pdh-wordmark-badge--footer">PdH</span>
          <div>
            <p className="pdh-footer-title">Pieldehincha</p>
            <p className="pdh-footer-tagline">Camisetas de fútbol para hinchas de verdad.</p>
          </div>
        </div>

        <div className="pdh-footer-col">
          <p className="pdh-footer-heading">Ubicación</p>
          <p className="pdh-footer-text">📍 {LOCATION_LABEL}</p>
          <p className="pdh-footer-text pdh-footer-text--muted">Envíos a todo el país</p>
        </div>

        <div className="pdh-footer-col">
          <p className="pdh-footer-heading">Contacto</p>
          <a
            className="pdh-footer-link"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
          <a className="pdh-footer-link" href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer">
            <InstagramIcon size={16} /> @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>

      <div className="pdh-footer-bottom">
        <p>© {new Date().getFullYear()} Pieldehincha. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
