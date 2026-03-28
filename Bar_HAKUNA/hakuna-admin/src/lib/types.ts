export const ALLERGENS = [
  { id: 'gluten', name: 'Gluten', icon: '🌾' },
  { id: 'crustaceos', name: 'Crustáceos', icon: '🦐' },
  { id: 'huevos', name: 'Huevos', icon: '🥚' },
  { id: 'pescado', name: 'Pescado', icon: '🐟' },
  { id: 'cacahuetes', name: 'Cacahuetes', icon: '🥜' },
  { id: 'soja', name: 'Soja', icon: '🫘' },
  { id: 'lacteos', name: 'Lácteos', icon: '🥛' },
  { id: 'frutos_cascara', name: 'Frutos de cáscara', icon: '🌰' },
  { id: 'apio', name: 'Apio', icon: '🥬' },
  { id: 'mostaza', name: 'Mostaza', icon: '🟡' },
  { id: 'sesamo', name: 'Sésamo', icon: '⚪' },
  { id: 'sulfitos', name: 'Sulfitos', icon: '🍷' },
  { id: 'altramuces', name: 'Altramuces', icon: '🫛' },
  { id: 'moluscos', name: 'Moluscos', icon: '🦑' },
] as const;

export type AllergenId = typeof ALLERGENS[number]['id'];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isRecommended: boolean;
  spicy?: number;
  isNew?: boolean;
  active: boolean;
  soldOut: boolean;
  allergens: AllergenId[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  active: boolean;
}

export interface DailyMenu {
  id: string;
  date: string; // YYYY-MM-DD
  active: boolean;
  price: number;
  firstCourses: DailyMenuItem[];
  secondCourses: DailyMenuItem[];
  desserts: DailyMenuItem[];
  includesDrink: boolean;
  includesBread: boolean;
  notes: string;
}

export interface DailyMenuItem {
  id: string;
  name: string;
  description: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  googleMaps: string;
  whatsapp: string;
  googleRating: number;
  totalReviews: number;
  schedule: ScheduleDay[];
}

export interface ScheduleDay {
  day: string;
  hours: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  order: number;
  active: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
  visible: boolean;
  featured: boolean;
}
