import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Account() {
  const backend = 'http://localhost/Assignment1/'

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      console.log(`Attempting sign-in with login ID: ${loginId} and password: ${password}`);
      const response = await axios.post(backend+'signin', {
        login_id: loginId,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', response.data.token, { expires: 1 });
      } else {
        alert('Invalid login ID or password');
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
      console.log(`Attempting sign-up with login ID: ${loginId} and password: ${password}`);
      const response = await axios.post(backend+'signup', {
        login_id: loginId,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', response.data.token, { expires: 1 });
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

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    try {
      console.log(`Attempting to update user with login ID: ${loginId} and name: ${name}`);
      const response = await axios.post(backend+'update_user', {
        login_id: loginId,
        name: name
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.data.success) {
        alert('User details updated successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        alert('Network error. Please check your connection and try again.');
      } else {
        console.error('Error updating user:', error);
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
            type="text"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
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
          <form onSubmit={handleUpdateUser}>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Login ID:
              <input type="text" name="login_id" />
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
