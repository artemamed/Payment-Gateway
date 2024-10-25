'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaIdCard } from 'react-icons/fa';


const NextStep: React.FC = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [amount, setAmount] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setOrderId(urlParams.get('orderId'));
      setSessionId(urlParams.get('sessionId'));
      setAmount(urlParams.get('amount'));

    }
  }, []);

  
  const handleAuthenticatePayer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/authenticate-payer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, sessionId, amount }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authData', JSON.stringify(data));
        router.push('/3ds-challenge');
      } else {
        setError(data.error || 'An error occurred during authentication.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-orange-400 to-orange-500 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full blur-3xl opacity-50 transform scale-150 animate-pulse" />
      <div className="relative z-10 w-full max-w-lg p-10 bg-white rounded-3xl shadow-2xl border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-3xl">
        <h1 className="text-5xl font-extrabold text-green-700 text-center transition-all duration-200">Success!</h1>
        <p className="mt-4 text-xl text-gray-800 text-center transition-opacity duration-300">
          Your card details have been added successfully.
        </p>

        <div className="mt-6 space-y-4">
          <p className="flex items-center text-xl text-gray-900 transition-transform duration-300">
            <FaIdCard className="mr-4 text-3xl text-blue-700 transform hover:scale-110 transition-transform duration-200" />
            <strong>Order ID:</strong> {orderId || 'N/A'}
          </p>
        
        </div>

        {error && <p className="mt-4 text-lg text-red-600 text-center">{error}</p>}

        <button
          onClick={handleAuthenticatePayer}
          className={`mt-8 w-full py-4 rounded-xl text-xl font-bold text-white transition-all duration-300 transform ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-500 shadow-lg hover:shadow-2xl'
            }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <span className="animate-spin inline-block w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
            </span>
          ) : (
            'Click to Generate OTP'
          )}
        </button>
      </div>
    </div>
  );
};

export default NextStep;
