import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    return (
    <nav>
        <img src="logo.png" alt="Store" />
        <h1>Store Name</h1>
        <ul>
            <li><Link to="/">Store</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/cart">Cart</Link></li>
        </ul>
    </nav>
  );
}

export default Navbar;
