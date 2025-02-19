import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Account() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      console.log(`Attempting sign-in with email: ${email} and password: ${password}`);
      const response = await axios.post('https://backend-production-d4be.up.railway.app/signin', {
        email: email,
        password: password
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', 'your_access_token', { expires: 365 });
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        alert('Network error. Please check your connection and try again.');
      } else {
        console.error('Error signing in:', error);
      }
    }
  };

  const handleSignUp = async () => {
    try {
      console.log(`Attempting sign-up with email: ${email} and password: ${password}`);
      const response = await axios.post('https://backend-production-d4be.up.railway.app/signup', {
        email: email,
        password: password
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', 'your_access_token', { expires: 365 });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        alert('Network error. Please check your connection and try again.');
      } else {
        console.error('Error signing up:', error);
      }
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    Cookies.remove('access_token');
  };

  return (
    <div>
      <h1>Account</h1>
      {!isSignedIn ? (
        <div>
          <h2>Sign In / Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <h2>Account Details</h2>
          <form>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Email:
              <input type="email" name="email" />
            </label>
            <br />
            <button type="submit">Update</button>
          </form>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default Account;
