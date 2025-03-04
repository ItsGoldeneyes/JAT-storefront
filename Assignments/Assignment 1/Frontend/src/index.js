import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import About from './About';
import Account from './Account';
import Cart from './Cart';
import Home from './Home';
import Navbar from './Navbar';
import OrderSummary from './OrderSummary';
import Orders from './Orders';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);