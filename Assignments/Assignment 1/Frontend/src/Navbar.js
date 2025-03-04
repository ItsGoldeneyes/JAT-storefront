import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    return (
    <nav>
        <img src="assets/jat_logo.png" alt="Store" />
        {/* <h1>JAT</h1> */}
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/cart">Types of Services</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="http://localhost/phpmyadmin/index.php?route=/database/structure&db=jat">DB Admin</Link></li>
        </ul>
    </nav>
  );
}

export default Navbar;
