"use client";

import type { Product } from '@/lib/data';
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'REHYDRATE_STATE'; payload: CartState };


const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.payload.productId &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.size === size && item.color === color)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'REHYDRATE_STATE':
        return action.payload;
    default:
      return state;
  }
};

const CART_STORAGE_KEY = 'dab-hobbies-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(CART_STORAGE_KEY);
      if (storedState) {
        dispatch({ type: 'REHYDRATE_STATE', payload: JSON.parse(storedState) });
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
  }, []);

  // Save to local storage on state change
  useEffect(() => {
    try {
        if(state.items.length > 0) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    } catch (e) {
        console.error("Failed to save cart to local storage", e);
    }
  }, [state]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
