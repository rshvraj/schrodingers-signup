import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SigninForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);
    return () => {
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    // Check if offline, save data to local storage, and return
    if (!isOnline) {
      toast.error('Cannot sign in while offline. Please try again when online.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://schrodingers-signup.onrender.com/auth/signin', {
        email,
        password,
      });
      const data = await response.data;

      if (data.success === false) {
        setError(data.message);
      } else {
        toast.success('Signin successful!');
        // Clear offline signin data from local storage on successful signin
        localStorage.removeItem('offlineSigninData');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-form-container flex justify-center items-center h-screen bg-gray-100">
      <div className={`w-16 p-2 text-white text-center mr-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md max-w-md">
      <label htmlFor="email" className="block mb-2 font-bold">
          Email:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <label htmlFor="password" className="block mb-2 font-bold">
          Password:
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!isOnline || loading}
          className={`w-full py-2 rounded-md font-bold text-center ${
            isOnline ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'
          }`}
        >
          {loading ? 'Signing In...' : isOnline ? 'Sign In' : 'Offline Signin'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SigninForm;
