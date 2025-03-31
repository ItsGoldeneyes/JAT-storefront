import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Reviews() {
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  const backend = 'http://localhost/Assignment1/';

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
          setUserId(response.data.user_id); // Store the user's ID
          setIsAdmin(response.data.access_level === 'admin');
        } else {
          setError('Failed to verify access token.');
        }
      } catch (error) {
        console.error('Error verifying access token:', error);
        setError('Error verifying access token.');
      }
    }
  };

  useEffect(() => {
    verifyAccessToken();
  }, []);

  return (
    <div>
      <h1>Reviews</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      
    </div>
  );
}

export default Reviews;