
import React from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface HomePageProps {
  setView: (view: { page: 'product'; productId: number }) => void;
}

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => (
  <div
    onClick={onClick}
    className="group relative cursor-pointer border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-4 bg-white">
      <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 text-center">Our Collection</h1>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {PRODUCTS.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => setView({ page: 'product', productId: product.id })} 
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
