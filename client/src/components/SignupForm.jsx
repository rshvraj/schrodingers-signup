import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    try {
      const response = await axios.post('https://schrodingers-signup.onrender.com/auth/signup', {
        username,
        email,
        password,
      });
      const data = await response.data;
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null); 
    } catch (error) {
        setLoading(false);
        setError(error.message);
      }
  };

  return (
    <div className="signup-form-container flex justify-center items-center h-screen bg-gray-100">
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
          disabled={!isOnline}
          className={`w-full py-2 rounded-md font-bold text-center ${
            isOnline ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'
          }`}
        >
          {isOnline ? 'Sign Up' : 'Offline Signup'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
