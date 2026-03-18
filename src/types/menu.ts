// Menu data types
export interface SizeOption {
  id: string;
  name: string;
  price: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: SizeOption[];
  extras: Extra[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: SizeOption;
  selectedExtras: Extra[];
  notes: string;
  subtotal: number;
}

export type DwellingType = 'casa' | 'departamento' | 'edificio';

export interface CustomerInfo {
  name: string;
  phone: string;
  street: string;
  exteriorNumber: string;
  dwellingType: DwellingType;
  interiorNumber: string;
  neighborhood: string;
  gatedCommunity: boolean;
  optInMarketing?: boolean;
  accessCode: string;
  references: string;
  paymentMethod: 'efectivo' | 'transferencia';
  cashAmount?: string;
}

export const CATEGORIES = [
  { id: 'promociones', name: 'Promociones', emoji: '🔥' },
  { id: 'platillos', name: 'Platillos', emoji: '🌮' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
];

export type CategoryId = typeof CATEGORIES[number]['id'];

export const AVAILABLE_EXTRAS: Extra[] = [
  { id: 'tortillas-maiz', name: 'Tortillas de maíz', price: 5 },
  { id: 'tortilla-harina', name: 'Tortilla de harina', price: 5 },
  { id: 'guacamole', name: 'Guacamole', price: 15 },
  { id: 'salsa-tatemada', name: 'Salsa tatemada', price: 15 },
  { id: 'salsa-bandera', name: 'Salsa Bandera', price: 10 },
  { id: 'frijoles-porcion', name: 'Frijoles Charros (1 porción)', price: 15 },
  { id: 'frijoles-medio', name: 'Frijoles Charros (1/2 Litro)', price: 25 },
];
