import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

function Home() {

  const [items, setItems] = useState([])
  const [selectedValue, setSelectedValue] = useState("");
  const [droppedItems, setDroppedItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost/Assignment1/get_items.php');
        if (response.data.success) {
          setItems(response.data.data);
        } else {
          console.error('Error fetching items:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    // console.log("Loaded items from localStorage:", storedItems);
    setDroppedItems(storedItems);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      // console.log("Saving items to localStorage:", droppedItems);
      localStorage.setItem("cartItems", JSON.stringify(droppedItems));
    }
  }, [droppedItems, initialLoad]);

  const selectedDropdownOption = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item)); // store item
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const item = JSON.parse(event.dataTransfer.getData("text/plain"));
    setDroppedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.Item_Id === item.Item_Id);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((i) =>
          i.Item_Id === item.Item_Id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
      }
      console.log("Updated items after drop:", updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };


  return (
    <div>
      <h1>Welcome to JAT</h1>
      {/* Add more store content here */}
      <div>
      <label htmlFor="dropdown">Sort by:</label>
      <select id="dropdown" value={selectedValue} onChange={selectedDropdownOption}>
        <option value="best-match">Best Match</option>
        <option value="lowest-price">Lowest Price</option>
        <option value="highest-price">Highest Price</option>
        <option value="best-selling">Best Selling</option>
        <option value="best-rating">Best Rating</option>
        <option value="most-reviews">Most Reviews</option>
      </select>
    </div>

      <h2>Electronics</h2>

      <table>
        <thead>
          <tr>
            {items.map((item) => (
              <th key={item.Item_Id}>{item.Item_name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {items.map((item) => (
              <td key={item.Item_Id} draggable onDragStart={(e) => handleDragStart(e, item)}>
                <img src={item.Image_Path} alt={item.Item_name}/>
              </td>
            ))}
          </tr>
          <tr>
            {items.map((item) => (
              <td key={item.Item_Id} draggable onDragStart={(e) => handleDragStart(e, item)}>
                ${parseFloat(item.Price).toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="floating-drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        <p>Drop items here into your cart</p>
        <ul>
          {droppedItems.map((item, index) => (
            <li key={index}>
              <strong>{item.Item_name}</strong> - ${item.Price} (Quantity: {item.quantity})
              <img src={item.Image_Path} alt={item.Item_name} width="40" />
            </li>
          ))}
        </ul>
      </div>

    </div>

  );
};



export default Home;
