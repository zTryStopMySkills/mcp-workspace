import content from "@/data/content.json";

export type Product = (typeof content.productos)[0];
export type Category = (typeof content.categorias)[0];
export type Testimonial = (typeof content.testimoniales)[0];

/** Format price with euro sign */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Generate unique ID */
export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** WhatsApp link builder */
export function waLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Truncate text */
export function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

/** cn — conditional classnames */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Admin auth helpers */
const ADMIN_KEY = "svs_admin";

export function adminLogin(password: string): boolean {
  if (password === content.config.adminPassword) {
    if (typeof window !== "undefined") localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window !== "undefined") localStorage.removeItem(ADMIN_KEY);
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

/** Local storage content helpers (CRUD persist) */
const CONTENT_KEY = "svs_content";

export function getContent(): typeof content {
  if (typeof window === "undefined") return content;
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    return raw ? (JSON.parse(raw) as typeof content) : content;
  } catch {
    return content;
  }
}

export function saveContent(data: typeof content): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
  }
}
