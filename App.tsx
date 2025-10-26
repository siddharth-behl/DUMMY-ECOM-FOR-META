
import React, { useState, createContext, useContext, useMemo } from 'react';
import { Product, CartItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';

type View = 
  | { page: 'home' }
  | { page: 'product'; productId: number }
  | { page: 'checkout' }
  | { page: 'thankyou'; purchaseData?: { value: number; email: string; phone: string; transactionId: string } };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  updateQuantity: (productId: number, size: string, newQuantity: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default function App() {
  const [view, setView] = useState<View>({ page: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartContextValue = useMemo(() => {
    const addToCart = (product: Product, size: string) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...product, size, quantity: 1 }];
      });
    };

    const updateQuantity = (productId: number, size: string, newQuantity: number) => {
      setCart(prevCart => {
        if (newQuantity <= 0) {
          return prevCart.filter(item => !(item.id === productId && item.size === size));
        }
        return prevCart.map(item =>
          item.id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      });
    };
    
    const removeFromCart = (productId: number, size: string) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size)));
    }

    const clearCart = () => {
      setCart([]);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems };
  }, [cart]);


  const renderContent = () => {
    switch (view.page) {
      case 'home':
        return <HomePage setView={setView} />;
      case 'product':
        return <ProductPage productId={view.productId} setView={setView} />;
      case 'checkout':
        return <CheckoutPage setView={setView} />;
      case 'thankyou':
        return <ThankYouPage setView={setView} purchaseData={view.purchaseData} />;
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      <div className="min-h-screen flex flex-col font-sans text-gray-800">
        <Header setView={setView} />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </CartContext.Provider>
  );
}
