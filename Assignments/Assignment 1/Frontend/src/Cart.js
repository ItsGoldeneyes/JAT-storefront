import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMapsComponent from './GoogleMaps';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryTruck, setDeliveryTruck] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
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
        return total + item.price * (item.quantity || 1);
      }
      return total;
    }, 0);

      const tax = totalItemPrice * taxRate;
      const newTotalPrice = (totalItemPrice + tax + parseFloat(deliveryPrice)).toFixed(2);
      setTotalPrice(newTotalPrice);
    }, [cartItems, deliveryPrice]);

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
      },
    });
  };

  return (
    <div>
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
                <td><img src={val.image} alt={val.name} width="100" /></td>
                <td>{val.name}</td>
                <td>${val.price}</td>
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
          setDeliveryPrice={setDeliveryPrice}
          setDeliveryTruck={setDeliveryTruck}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />
      </div>
      <div>
        <h3>Subtotal (Items): ${cartItems.reduce((total, item) => {
          if (item.selected) {
            return total + item.price * (item.quantity || 1);
          }
          return total;
        }, 0).toFixed(2)}</h3>
        <h3>Tax (13%): ${(cartItems.reduce((total, item) => {
          if (item.selected) {
            return total + item.price * (item.quantity || 1);
          }
          return total;
        }, 0) * taxRate).toFixed(2)}</h3>
        <h2>Total Price: ${totalPrice}</h2>
      </div>
      <div>
        <h3>Delivery Truck:</h3>
        {deliveryTruck && <p>Assigned Truck: {deliveryTruck}</p>}
      </div>
      <div>
        <h3>Starting Location:</h3>
        {origin && <p>{origin}</p>}
      </div>
      <div>
        <h3>Destination:</h3>
        {destination && <p>{destination}</p>}
      </div>
      <button onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
}

export default Cart;
