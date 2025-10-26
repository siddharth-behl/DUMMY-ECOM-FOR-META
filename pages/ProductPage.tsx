
import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import { useCart } from '../App';

interface ProductPageProps {
  productId: number;
  setView: (view: { page: 'home' } | { page: 'checkout' }) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, setView }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes[0] || null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Facebook Pixel ViewContent event when product page loads
  useEffect(() => {
    if (product && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: 'Apparel',
        content_ids: [product.id.toString()],
        value: product.price,
        currency: 'INR'
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => setView({ page: 'home' })} className="mt-4 text-indigo-600 hover:text-indigo-500">
          &larr; Back to shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
      
      // Facebook Pixel AddToCart event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_name: product.name,
          content_category: 'Apparel',
          content_ids: [product.id.toString()],
          value: product.price,
          currency: 'INR'
        });
      }
    } else {
      alert('Please select a size.');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex justify-center items-start">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full max-w-md h-auto object-cover rounded-lg"
            />
        </div>
        <div>
          <button onClick={() => setView({ page: 'home' })} className="text-sm text-gray-500 hover:text-gray-800 mb-4">
            &larr; Back to collection
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          <p className="text-3xl mt-2 text-gray-900">${product.price.toFixed(2)}</p>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-base text-gray-600">{product.description}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="flex items-center space-x-3 mt-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
             <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50"
              disabled={!selectedSize}
            >
              Add to Cart
            </button>
            {showConfirmation && (
                <p className="text-center mt-4 text-green-600 font-medium">Added to cart!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
