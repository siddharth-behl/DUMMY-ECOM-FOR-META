
import React from 'react';

interface ThankYouPageProps {
  setView: (view: { page: 'home' }) => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
       <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Thank You!</h1>
      <p className="mt-2 text-lg text-gray-600">Your order has been placed successfully.</p>
      <p className="mt-2 text-gray-600">You will receive a confirmation email shortly. (This is a demo).</p>
      <button
        onClick={() => setView({ page: 'home' })}
        className="mt-8 inline-block bg-gray-900 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default ThankYouPage;
