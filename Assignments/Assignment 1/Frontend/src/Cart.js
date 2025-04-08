import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMapsComponent from './GoogleMaps';
import './Cart.css'

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryTruck, setDeliveryTruck] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [shippingType, setShippingType] = useState('regular');
  const taxRate = 0.13;

  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    // console.log("Loaded items from localStorage:", storedItems);
    setCartItems(storedItems);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      // console.log("Saving items to localStorage:", cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, initialLoad]);

  useEffect(() => {
    const totalItemPrice = cartItems.reduce((total, item) => {
      if (item.selected) {
        return total + item.Price * (item.quantity || 1);
      }
      return total;
    }, 0);

    const tax = totalItemPrice * taxRate;
    const newTotalPrice = (totalItemPrice + tax + parseFloat(deliveryPrice)).toFixed(2);
    setTotalPrice(newTotalPrice);
  }, [cartItems, deliveryPrice]);

  useEffect(() => {
    if (route) {
      const { distance, duration } = route;
      let calculatedDeliveryPrice = (distance.value * 0.0005).toFixed(2);
      
      if (shippingType === 'express') {
        calculatedDeliveryPrice *= 1.5;
      }

      setDeliveryPrice(calculatedDeliveryPrice);

      setDistance(distance.text);

      const currentDate = new Date();
      let estimatedDeliveryDate = new Date(currentDate.getTime() + duration.value * 1000);
      if (shippingType === 'express') {
        estimatedDeliveryDate = new Date(estimatedDeliveryDate.getTime() - 12 * 60 * 60 * 1000); // 12 hours)
      } else {
        estimatedDeliveryDate = new Date(estimatedDeliveryDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      }
      
      setEstimatedDeliveryTime(estimatedDeliveryDate);

      setDestination(route.end_address);
      setOrigin(route.start_address);
    }
  }, [route, shippingType]);

  const toggleSelect = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].selected = !updatedCart[index].selected;
    setCartItems(updatedCart);
  };

  const incrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }
    setCartItems(updatedCart);
  };

  const deleteItem = (index) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updatedCart);
  };

  const handleConfirmOrder = () => {
    navigate('/order-summary', {
      state: {
        cartItems: cartItems.filter((item) => item.selected),
        totalPrice,
        deliveryTruck,
        origin,
        destination,
        distance,
        deliveryPrice,
        storeCode: selectedStore?.store_code,
        shippingType,
      },
    });
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((val, key) => (
              <tr key={key}>
                <td>
                  <input
                    type="checkbox"
                    checked={val.selected}
                    onChange={() => toggleSelect(key)}
                  />
                </td>
                <td><img src={val.Image_Path} alt={val.Item_name} width="100" /></td>
                <td>{val.Item_name}</td>
                <td>${val.Price}</td>
                <td>
                  <button onClick={() => decrementQuantity(key)}>-</button>
                  {val.quantity || 1}
                  <button onClick={() => incrementQuantity(key)}>+</button>
                </td>
                <td>
                  <button onClick={() => deleteItem(key)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <GoogleMapsComponent 
          setRoute={setRoute}
          setDeliveryTruck={setDeliveryTruck}
          setSelectedStore={setSelectedStore}
        />
      </div>
      <div>
        <h3>Delivery Truck:</h3>
        {deliveryTruck && <p>Available Truck: {deliveryTruck}</p>}
      </div>
      <div>
        {route && (
          <>
            <p>Distance to store: {distance}</p>
            <p>Delivery Price: ${deliveryPrice}</p>
            {estimatedDeliveryTime && (
              <p>Estimated Delivery Date and Time: {estimatedDeliveryTime.toLocaleString()}</p>
            )}
          </>
        )}
      </div>
      <div>
        <h3>Starting Location:</h3>
        {origin && <p>{origin}</p>}
      </div>
      <div>
        <h3>Destination:</h3>
        {destination && <p>{destination}</p>}
      </div>

      <div>
        <h3>Shipping Method:</h3>
        <select value={shippingType} onChange={(e) => setShippingType(e.target.value)}>
          <option value="regular">Regular Shipping</option>
          <option value="express">Express Shipping</option>
        </select>
      </div>
      <div>
        <h3>Subtotal (Items): ${cartItems.reduce((total, item) => {
          if (item.selected) {
            return total + item.Price * (item.quantity || 1);
          }
          return total;
        }, 0).toFixed(2)}</h3>
        <h3>Tax (13%): ${(cartItems.reduce((total, item) => {
          if (item.selected) {
            return total + item.Price * (item.quantity || 1);
          }
          return total;
        }, 0) * taxRate).toFixed(2)}</h3>
        <h2>Total Price: ${totalPrice}</h2>
      </div>

      <button className="confirm-order" onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
}

export default Cart;