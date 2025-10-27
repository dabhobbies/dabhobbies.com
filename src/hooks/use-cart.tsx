
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
  | { type: 'UPDATE_VARIANT'; payload: { oldSize: string; oldColor: string; newItem: CartItem } }
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
    case 'UPDATE_VARIANT': {
        const { oldSize, oldColor, newItem } = action.payload;

        // First, remove the old item
        const itemsWithoutOld = state.items.filter(item => 
            !(item.product.id === newItem.product.id && item.size === oldSize && item.color === oldColor)
        );

        // Then, add the new item (which will merge if it already exists)
        const existingItemIndex = itemsWithoutOld.findIndex(
            (item) =>
              item.product.id === newItem.product.id &&
              item.size === newItem.size &&
              item.color === newItem.color
        );

        if (existingItemIndex > -1) {
            const finalItems = [...itemsWithoutOld];
            finalItems[existingItemIndex].quantity += newItem.quantity;
            return { ...state, items: finalItems };
        }

        // We need to find the original item's index to insert the new item at the same position
        const originalIndex = state.items.findIndex(item => 
            item.product.id === newItem.product.id && item.size === oldSize && item.color === oldColor
        );
        
        const finalItems = [...itemsWithoutOld];
        if (originalIndex !== -1) {
            finalItems.splice(originalIndex, 0, newItem);
        } else {
            finalItems.push(newItem);
        }
        
        return { ...state, items: finalItems };
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
