
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { toast } from "@/hooks/use-toast";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM', payload: { product: Product, quantity: number } }
  | { type: 'REMOVE_ITEM', payload: { id: number } }
  | { type: 'UPDATE_QUANTITY', payload: { id: number, quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItem[]): { totalItems: number, totalAmount: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart reducer action:', action.type, 'payload' in action ? action.payload : 'no payload');
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        console.log('Updated existing item, new totals:', { totalItems, totalAmount });
        return { items: updatedItems, totalItems, totalAmount };
      } else {
        // New item, add to cart
        const updatedItems = [...state.items, { product, quantity }];
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        console.log('Added new item, new totals:', { totalItems, totalAmount });
        return { items: updatedItems, totalItems, totalAmount };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload.id);
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      console.log('Removed item, new totals:', { totalItems, totalAmount });
      return { items: updatedItems, totalItems, totalAmount };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const updatedItems = state.items.map(item => 
        item.product.id === id ? { ...item, quantity } : item
      );
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      console.log('Updated quantity, new totals:', { totalItems, totalAmount });
      return { items: updatedItems, totalItems, totalAmount };
    }
    
    case 'CLEAR_CART':
      console.log('Cleared cart');
      return { items: [], totalItems: 0, totalAmount: 0 };
    
    default:
      return state;
  }
};

// Try to load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const recalculatedTotals = calculateTotals(parsedCart.items);
      console.log('Loaded cart from storage:', { ...parsedCart, ...recalculatedTotals });
      return {
        ...parsedCart,
        ...recalculatedTotals
      };
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
  
  return { items: [], totalItems: 0, totalAmount: 0 };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving cart to localStorage:', state);
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  const addItem = (product: Product, quantity = 1) => {
    console.log('Adding item to cart:', { product: product.name, quantity });
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} ${quantity > 1 ? 'have' : 'has'} been added to your cart.`,
      duration: 3000,
    });
  };
  
  const removeItem = (id: number) => {
    console.log('Removing item from cart:', id);
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      duration: 3000,
    });
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    console.log('Updating quantity:', { id, quantity });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    console.log('Clearing cart');
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 3000,
    });
  };
  
  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
