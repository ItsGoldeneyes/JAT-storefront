import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, 
          totalPrice, 
          deliveryTruck, 
          origin, 
          destination, 
          distance, 
          deliveryPrice 
        } = location.state;

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tripError, setTripError] = useState(null);
  const [tripSuccess, setTripSuccess] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    const orderData = {
      total_price: totalPrice,
      delivery_truck: deliveryTruck,
      starting_location: origin,
      destination: destination,
    };

    const tripData = {
      source_code: origin,
      destination_code: destination,
      distance: distance,
      truck_id: deliveryTruck, 
      price: deliveryPrice,
    };

    // try {
    //   const response = await axios.post("http://localhost/Assignment1/create_order.php", orderData);
    //   console.log("Order response:", response.data);

    //   console.log("full response:", response);
    //   console.log("response.data:", response.data);

    //   if (response.data.success) {
    //     setError(null);
    //     setSuccess(true);
    
    //     // redirect to a success page
    //     setTimeout(() => {
    //       navigate('/'); // redirect to homepage
    //     }, 3000);
    //   } else {
    //     setError(response.data.error || "Failed to create order. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error creating order:", error);
    //   setError("An error occurred while submitting the order. Please try again.");
    // }

    try {
      const tripResponse = await axios.post("http://localhost/Assignment1/create_trip.php", tripData);
      console.log("Trip response:", tripResponse.data);
      if (tripResponse.data.success) {
        setTripError(null);
        setTripSuccess(true);

        console.log("Trip response:", tripResponse.data);
        const tripId = tripResponse.data.trip_id;
        console.log("Trip ID:", tripId);

        if (!tripId) {
          throw new Error("Trip ID is undefined.");
        }

        const tripDetailsResponse = await axios.get(`http://localhost/Assignment1/get_trip.php?trip_id=${tripId}`);
        console.log("Trip details response:", tripDetailsResponse.data);

        if (tripDetailsResponse.data.success) {
          setTripDetails(tripDetailsResponse.data.data); // Store trip details in state
        } else {
          console.error("Failed to fetch trip details:", tripDetailsResponse.data.error);
          setTripError("Failed to fetch trip details. Please try again.");
        }
      } else {
        setError(tripResponse.data.error || "Failed to create trip. Please try again.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      setTripError("An error occurred while submitting the trip. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setPaymentInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    console.log("Success state changed:", success);
  }, [success]);

  return (
    <div>
      <h1>Order Summary</h1>
      <div>
        <h2>Selected Items:</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.Item_name} - ${item.Price} x {item.quantity || 1}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Total Price: ${totalPrice}</h2>
      </div>
      <div>
        <h2>Delivery Truck: {deliveryTruck}</h2>
      </div>
      <div>
        <h2>Origin: {origin}</h2>
      </div>
      <div>
        <h2>Destination: {destination}</h2>
      </div>
      <form onSubmit={handlePaymentSubmit}>
        <h2>Payment Information</h2>
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/YY"
            value={paymentInfo.expiryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>

      {/* {error && !success && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Order submitted successfully! Redirecting...</p>} */}
      {tripError && !tripSuccess && <p style={{ color: 'red' }}>{tripError}</p>}
      {tripSuccess && (
        <div>
          <p style={{ color: 'green' }}>Trip submitted successfully!</p>
          {tripDetails && (
            <div>
              <h2>Trip Details</h2>
              <p><strong>Trip ID:</strong> {tripDetails.Trip_Id}</p>
              <p><strong>Source Code:</strong> {tripDetails.Source_Code}</p>
              <p><strong>Destination Code:</strong> {tripDetails.Destination_Code}</p>
              <p><strong>Distance:</strong> {tripDetails.Distance} km</p>
              <p><strong>Truck ID:</strong> {tripDetails.Truck_Id}</p>
              <p><strong>Price:</strong> ${tripDetails.Price}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderSummary;