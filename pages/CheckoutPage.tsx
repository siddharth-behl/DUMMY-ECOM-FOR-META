
import React from 'react';
import { useCart } from '../App';
import { CartItem } from '../types';

interface CheckoutPageProps {
  setView: (view: { page: 'home' } | { page: 'thankyou', purchaseData?: { value: number; email: string; phone: string; transactionId: string } }) => void;
}

const CartListItem: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity } = useCart();
    return (
        <li className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                        <p className="w-8 text-center">{item.quantity}</p>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                    </div>

                    <div className="flex">
                        <button onClick={() => updateQuantity(item.id, item.size, 0)} type="button" className="font-medium text-red-600 hover:text-red-500">Remove</button>
                    </div>
                </div>
            </div>
        </li>
    );
}


const CheckoutPage: React.FC<CheckoutPageProps> = ({ setView }) => {
  const { cart, clearCart } = useCart();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    
    // Get form data
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    
    const transactionId = `TXN_${Date.now()}`;
    
    // Google Tag Manager data layer push
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: transactionId,
          value: total,
          currency: 'USD',
          items: cart.map(item => ({
            item_id: item.id.toString(),
            item_name: item.name,
            item_category: 'Apparel',
            item_variant: item.size,
            quantity: item.quantity,
            price: item.price
          }))
        },
        customer_email: email,
        customer_phone: phone
      });
    }
    
    clearCart();
    setView({ 
      page: 'thankyou', 
      purchaseData: {
        value: total,
        email: email,
        phone: phone,
        transactionId: transactionId
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">Your cart is empty.</p>
          <button onClick={() => setView({ page: 'home' })} className="mt-4 inline-block bg-gray-900 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700">
            Continue Shopping
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" name="phone" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" id="city" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" id="postal-code" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 sm:text-sm" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                 {cart.map((item) => <CartListItem key={`${item.id}-${item.size}`} item={item} />)}
              </ul>
              <div className="border-t border-gray-200 pt-6 mt-6 text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900">Payment Method</h3>
                <div className="mt-2 bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
                    <p className="font-semibold">Cash on Delivery</p>
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;
