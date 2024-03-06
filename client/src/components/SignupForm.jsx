import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
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
    if (!username || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://schrodingers-signup.onrender.com/auth/signup', {
        username,
        email,
        password,
      });
      const data = await response.data;
      console.log(data);
      if (data.success === false) {
        setError(data.message);
      } else {
        toast.success('User created successfully!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-container flex justify-center items-center h-screen bg-gray-100">
      <div className={`w-16 p-2 text-white text-center mr-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md max-w-md">
      <label htmlFor="username" className="block mb-2 font-bold">
          Username:
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
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
          {loading ? 'Signing Up...' : isOnline ? 'Sign Up' : 'Offline Signup'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
