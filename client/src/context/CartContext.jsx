import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };
    
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
        localStorage.setItem('valentine_cart', JSON.stringify(updatedItems));
        return { ...state, items: updatedItems };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
        localStorage.setItem('valentine_cart', JSON.stringify(newItems));
        return { ...state, items: newItems };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const filteredItems = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('valentine_cart', JSON.stringify(filteredItems));
      return { ...state, items: filteredItems };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      localStorage.setItem('valentine_cart', JSON.stringify(updatedItems));
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_CART':
      localStorage.removeItem('valentine_cart');
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('valentine_cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  const addToCart = (cake) => {
    dispatch({ type: 'ADD_TO_CART', payload: cake });
  };

  const removeFromCart = (cakeId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cakeId });
  };

  const updateQuantity = (cakeId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: cakeId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};