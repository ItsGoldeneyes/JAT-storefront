import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (userId !== null) {
        try {
          const response = await axios.post(
            backend + 'get_orders.php',
            {
              user_id: userId,
              access_level: isAdmin ? 'admin' : 'user',
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.data.success) {
            setOrders(response.data.orders);
          } else {
            setError(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Error fetching orders. Please try again.');
        }
      }
    };

    fetchOrders();
  }, [userId, isAdmin]);

  // Filter orders based on the search term
  const filteredOrders = orders.filter((order) => {
    return (
      order.order_id.toString().includes(searchTerm) ||
      order.user_id.toString().includes(searchTerm)
    );
  });

  return (
    <div>
      <h1>Orders</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Trip ID</th>
              <th>Receipt ID</th>
              <th>Date Issued</th>
              <th>Date Received</th>
              <th>Total Price</th>
              <th>Item IDs</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_id}</td>
                <td>{order.trip_id}</td>
                <td>{order.receipt_id}</td>
                <td>{order.date_issued}</td>
                <td>{order.date_received}</td>
                <td>{order.total_price}</td>
                <td>{order.item_ids}</td>
                <td>{order.payment_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
