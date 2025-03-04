import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost/Assignment1/get_orders.php');
        console.log('Response:', response);
        if (response.data.success) {
          console.log('Orders:', response.data.orders);
          setOrders(response.data.orders);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching orders. Please try again.');
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.order_id.toString().includes(searchTerm) || 
    order.user_id.toString().includes(searchTerm)
  );

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
              <th>Payment Code</th>
              <th>Delivery Truck</th>
              <th>Starting Location</th>
              <th>Destination</th>
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
                <td>{order.payment_code}</td>
                <td>{order.delivery_truck}</td>
                <td>{order.starting_location}</td>
                <td>{order.destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
