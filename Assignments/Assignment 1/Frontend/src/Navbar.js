import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './navbar.css';

function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const backend = 'http://localhost/Assignment1/';
    const location = useLocation();

    const verifyAccessToken = async () => {
        const token = Cookies.get('access_token');
        if (token) {
            try {
                const response = await axios.post(
                    backend + 'access_token_check.php',
                    {},
                    {
                        headers: {
                            'Authorization': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.data.success) {
                    setIsLoggedIn(true);
                    if (response.data.access_level === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } else {
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error verifying access token:', error);
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    };

    // Verify access token whenever route changes
    useEffect(() => {
        verifyAccessToken();
    }, [location]);

    return (
        <nav>
            <img src="assets/jat_logo.png" alt="Store" />
            {/* <h1>JAT</h1> */}
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/account">Account</Link></li>
                {isLoggedIn && <li><Link to="/cart">Shopping Cart</Link></li>}
                {isLoggedIn && <li><Link to="/orders">Orders</Link></li>}
                {isLoggedIn && <li><Link to="/reviews">Reviews</Link></li>}
                {isAdmin && <li><Link to="/dbmaintain">DBMaintain</Link></li>}
                {isAdmin && <li><Link to="http://localhost/phpmyadmin/index.php?route=/database/structure&db=jat">DB Maintain</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
