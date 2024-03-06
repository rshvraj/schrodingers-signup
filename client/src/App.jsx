import React from 'react';
import SignupForm from './components/SignupForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SigninForm from './components/SigninForm';

function App() {
  return (
    
    <BrowserRouter>
          <h1>Schrodinger's Signup</h1>

  <Routes>
        <Route path='/' element={<SignupForm />} />
        <Route path='/sign-in' element={<SigninForm />} />

    </Routes>

    </BrowserRouter>

  );
}

export default App;
