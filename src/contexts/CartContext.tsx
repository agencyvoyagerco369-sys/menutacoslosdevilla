import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, Product, SizeOption, Extra } from '@/types/menu';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity: number, selectedSize?: SizeOption, selectedExtras?: Extra[], notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'los-de-villa-cart';

function calculateSubtotal(product: Product, quantity: number, selectedSize?: SizeOption, selectedExtras?: Extra[]): number {
  const basePrice = selectedSize ? selectedSize.price : product.price;
  const extrasTotal = selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
  return (basePrice + extrasTotal) * quantity;
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity, subtotal: item.subtotal + action.payload.subtotal }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          const newQuantity = action.payload.quantity;
          const newSubtotal = calculateSubtotal(item.product, newQuantity, item.selectedSize, item.selectedExtras);
          return { ...item, quantity: newQuantity, subtotal: newSubtotal };
        }
        return item;
      }).filter(item => item.quantity > 0);
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return { items: action.payload, total: calculateTotal(action.payload) };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (
    product: Product,
    quantity: number,
    selectedSize?: SizeOption,
    selectedExtras: Extra[] = [],
    notes: string = ''
  ) => {
    const id = `${product.id}-${selectedSize?.id || 'default'}-${selectedExtras.map(e => e.id).join(',')}-${notes}`;
    const subtotal = calculateSubtotal(product, quantity, selectedSize, selectedExtras);

    dispatch({
      type: 'ADD_ITEM',
      payload: { id, product, quantity, selectedSize, selectedExtras, notes, subtotal },
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, total: state.total, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
