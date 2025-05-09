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
import DBMaintain from './DBMaintain';
import Reviews from './Reviews';

const container = document.getElementById('root');
const root = createRoot(container);

// Render the Single Page Application
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
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/dbmaintain" element={<DBMaintain />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);