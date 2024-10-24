// app/success-auth/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const PaymentStatus: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Animation state
  const [showSuccessCircle] = useState<boolean>(true);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const sessionIdParam = searchParams.get('sessionId');

    const callPaymentAPI = async () => {
      if (orderIdParam && sessionIdParam) {
        try {
          const response = await fetch('/api/pay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderIdParam,
              sessionId: sessionIdParam,
            }),
          });

          if (!response.ok) {
            throw new Error('Payment processing failed');
          }

          await response.json();
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An error occurred while processing your payment');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError('Missing required parameters');
        setLoading(false);
      }
    };

    callPaymentAPI();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">Processing your payment...</h2>
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-red-100">
        <div className="bg-white p-8 shadow-xl rounded-lg text-center">
          <ExclamationCircleIcon className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Payment Failed</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-teal-200 animate-backgroundMove opacity-10" />
      {showSuccessCircle ? (
        <div className="flex items-center justify-center w-32 h-32 bg-white shadow-lg rounded-full transition-all duration-700 ease-in-out transform scale-110 opacity-90">
          <CheckCircleIcon className="w-16 h-16 text-green-500 animate-pulse" />
        </div>
      ) : (
        <div className="relative bg-white p-8 shadow-xl rounded-lg text-center transform transition-all duration-700 ease-in-out animate-fadeIn">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-14 h-14 text-green-500" />
          </div>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
            <span>Your payment is secured and encrypted</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SuccessPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatus />
    </Suspense>
  );
};

export default SuccessPage;
