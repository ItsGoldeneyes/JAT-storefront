import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Account.css';

function Account() {
  const backend = 'http://localhost/Assignment1/';

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  // Check if user is logged in with access token cookie
  useEffect(() => {
    const verifyToken = async () => {
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
        // If the token is valid, user is signed in. Else, remove the expired token.
          console.log('Token verification response:', response.data);
          if (response.data.success) {
            setIsSignedIn(true);
                      } else {
            Cookies.remove('access_token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          Cookies.remove('access_token');
        }
      }
    };

    verifyToken();
    fetchAccountDetails(Cookies.get('access_token'));
  }, []);

  const fetchAccountDetails = async (token) => {
    try {
      const response = await axios.get(backend + 'get_account_details.php', {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        const { name, telephone, address, city, email } = response.data.details;
        setName(name);
        setTelephone(telephone);
        setAddress(address);
        setCity(city);
        setEmail(email);
      } else {
        console.error('Failed to fetch account details:', response.data);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      console.log(`Attempting sign-in with login ID: ${loginId} and password: ${password}`);
      const response = await axios.post(backend + 'signin.php', {
        login_id: loginId,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', response.data.access_token, { expires: 1 });
        console.log('Cookie Data:', Cookies.get());
        fetchAccountDetails(Cookies.get('access_token'));
        window.location.reload();
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
      const response = await axios.post(backend + 'signup.php', {
        login_id: loginId,
        password: password,
        name: name,
        telephone: telephone,
        address: address,
        city: city,
        email: email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setIsSignedIn(true);
        Cookies.set('access_token', response.data.token, { expires: 1 });
        fetchAccountDetails(Cookies.get('access_token'));
        handleSignIn();
        window.location.reload();
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
    setLoginId("");
    setPassword("");
    setName("");
    setTelephone("");
    setAddress("");
    setCity("");
    setEmail("");
    localStorage.removeItem('cartItems');
  };

  const handleUpdateAccount = async () => {
    const token = Cookies.get('access_token');  
    try {
      const response = await axios.post(
        backend + 'update_user.php',
        {
          password: password,
          name: name,
          telephone: telephone,
          address: address,
          city: city,
          email: email,
        },
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        alert('Account updated successfully!');
      } else {
        alert('Failed to update account: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('An error occurred while updating your account. Please try again.');
    }
  };

  return (
    <div className="account-container">
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
          <button onClick={handleUpdateAccount}>Update Account</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default Account;
