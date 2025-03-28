import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Account() {
  const backend = 'http://localhost/Assignment1/'

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  const handleSignIn = async () => {
    try {
      console.log(`Attempting sign-in with login ID: ${loginId} and password: ${password}`);
      const response = await axios.post(backend+'signin.php', {
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
      const response = await axios.post(backend+'signup.php', {
        login_id: loginId,
        password: password,
        name: name,
        telephone: telephone,
        address: address,
        city: city,
        email: email
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
  
    try {
      const response = await axios.post(
        backend + 'update_user.php',
        {
          name: name || undefined,
          telephone: telephone || undefined,
          address: address || undefined,
          email: email || undefined,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // ✅ Ensure cookies are sent!
        }
      );
  
      if (response.data.success) {
        alert(response.data.message || "User details updated successfully");
      } else {
        alert(response.data.error || "Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.error || "An error occurred while updating.");
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
          <h2>Sign In</h2>
          <input
            type="text"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br/>
          <button onClick={handleSignIn}>Sign In</button>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          /><br/>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br/>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <h2>Account Details</h2>
          <form onSubmit={handleUpdateUser}>
            <label>
              Login ID:
              <input type="text" name="login_id" />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" />
            </label>
            <br />
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Telephone:
              <input type="text" name="telephone" />
            </label>
            <br />
            <label>
              Address:
              <input type="text" name="address" />
            </label>
            <br />
            <label>
              City:
              <input type="text" name="city" />
            </label>
            <br />
            <label>
              Email:
              <input type="text" name="email" />
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
