'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CurrencyDollarIcon, LinkIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import { CircleLoader } from 'react-spinners';

export default function HomePage() {
  const [sessionId, setSessionId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [sessionUpdated, setSessionUpdated] = useState(false);

  // Function to create a new session
  const createSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/create-session');
      const data = res.data;
      setSessionId(data.session.id);
      setSessionCreated(true);
      toast.success('Session created successfully');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  // Function to update the session
  const updateSession = async () => {

    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/update-session', { sessionId, amount });
      const newPaymentUrl = `${window.location.origin}/api/payment-form?sessionId=${sessionId}`;
      setPaymentUrl(newPaymentUrl);
      setSessionUpdated(true);
      toast.success('Session updated successfully');
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  // Function to copy the payment URL to clipboard
  const copyUrl = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast.info('Payment URL copied to clipboard!');
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-400 to-orange-500 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center">
            <Image src="/artema-logo.png" alt="Company Logo" width={150} height={150} className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-orange-400 mb-8">AMG Payment Gateway</h1>
          </div>

          {!sessionCreated && (
            <button
              className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors mb-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={createSession}
              disabled={loading}
            >
              {loading ? <CircleLoader size={20} color="#ffffff" /> : 'Create Session'}
            </button>
          )}

          {sessionCreated && !sessionUpdated && (
            <>
              {/* Amount Input */}
              <p className='text-orange-500 font-medium text-lg mb-2'>Amount**</p>
              <div className={`relative flex items-center border-2 rounded-lg mb-6 shadow-lg transition duration-300 ${amount <= 0 ? 'border-orange-500 bg-red-50' : 'border-gray-300 bg-white'}`}>
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 ml-3" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                  onFocus={(e) => e.target.select()}
                  placeholder="Enter Amount"
                  className="w-full py-3 px-4 text-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-500 rounded-r-lg focus:outline-none transition duration-200"
                />
              </div>


              {/* Update Session Button */}
              <button
                className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors mb-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={updateSession}
                disabled={loading}
              >
                {loading ? <CircleLoader size={20} color="#ffffff" /> : 'Update Session'}
              </button>
            </>
          )}

          {sessionUpdated && (
            <>
              {/* Read-only Amount Display */}
              <div className={`relative flex items-center border-2 rounded-lg mb-6 shadow-sm border-gray-300`}>
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 ml-3" />
                <input
                  type="number"
                  value={amount}
                  readOnly
                  className="w-full py-3 px-4 text-lg text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Payment URL Display */}
              <div className="relative flex items-center border-2 rounded-lg mb-6 shadow-sm bg-gray-50">
                <LinkIcon className="h-6 w-6 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={paymentUrl}
                  readOnly
                  className="w-full py-3 px-4 text-lg text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Copy URL Button */}
              <button
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center"
                onClick={copyUrl}
              >
                <ClipboardIcon className="h-5 w-5 mr-2" />
                Copy URL
              </button>
            </>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
