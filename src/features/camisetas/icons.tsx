type IconProps = { size?: number };

export function WhatsAppIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.05L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-.99.08-1.6-.1-.37-.11-.85-.27-1.46-.53-2.57-1.11-4.24-3.7-4.37-3.87-.13-.17-1.04-1.38-1.04-2.63 0-1.25.66-1.87.89-2.12.22-.25.49-.32.65-.32.16 0 .33 0 .47.01.15.01.35-.06.55.42.21.5.71 1.73.77 1.86.06.13.1.28.02.45-.08.17-.12.28-.24.43-.12.15-.25.33-.36.44-.12.12-.24.25-.1.5.14.25.63 1.04 1.36 1.68.94.83 1.72 1.09 1.97 1.21.25.12.4.1.55-.06.15-.16.63-.73.8-.98.17-.25.34-.21.57-.13.23.08 1.47.69 1.72.82.25.13.42.19.48.3.06.11.06.63-.16 1.25z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CartIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
