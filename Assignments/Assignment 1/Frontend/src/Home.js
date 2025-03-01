import React, { useState, useEffect } from 'react';
import './Home.css';


function Home() {

  const phone_data = [
    { name: "Samsung Galaxy S25 Ultra 512GB Titanium Silverwhite",
      image: "assets/samsung_galaxy_ultra.png",
      price: "2098.99" },

    { name: "Apple iPhone 16 Pro Max 256GB Black Titanium",
      image: "assets/iphone16.png",
      price: "1749.99" },

    { name: "Apple iPhone 15 128GB Pink",
      image: "assets/iphone15.png",
      price: "999.99" },

    { name: "Samsung Galaxy S25 256GB Icyblue",
      image: "assets/samsung_galaxy.png",
      price: "1288.99" },
  ]

  const laptop_data = [
    { name: "Apple MacBook Pro 14.2\" 2024 1TB Space Black",
      image: "assets/2024_macbook_pro.png",
      price: "2349.99" },

    { name: "Apple MacBook Air 13\" 2024 512GB Midnight",
      image: "assets/macbook_air_13.png",
      price: "1699.99" },

    { name: "Microsoft Surface Laptop 13.8\" 1TB Sapphire",
      image: "assets/microsoft_surface_13.png",
      price: "18.99" },

    { name: "HP Omnibook X 14\" 1TB Glacier Silver",
      image: "assets/hp_omnibook.png",
      price: "1349.99" }

  ]

  const [selectedValue, setSelectedValue] = useState("");
  const [droppedItems, setDroppedItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("Loaded items from localStorage:", storedItems);
    setDroppedItems(storedItems);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      console.log("Saving items to localStorage:", droppedItems);
      localStorage.setItem("cartItems", JSON.stringify(droppedItems));
    }
  }, [droppedItems, initialLoad]);

  const selectedDropdownOption = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item)); // Store item
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const item = JSON.parse(event.dataTransfer.getData("text/plain"));
    setDroppedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.name === item.name);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
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

      <h2>Phones</h2>

      <table>
        <thead>
          <tr>
            {phone_data.map((val) => (
              <th key={val.name}>{val.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {phone_data.map((val) => (
              <td key={val.name} draggable onDragStart={(e) => handleDragStart(e, val)}>
                <img src={val.image} alt={val.name}/>
              </td>
            ))}
          </tr>
          <tr>
            {phone_data.map((val) => (
              <td key={val.name} draggable onDragStart={(e) => handleDragStart(e, val)}>
                ${parseFloat(val.price).toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <h2>Laptops</h2>

      <table>
        <thead>
          <tr>
            {laptop_data.map((val) => (
              <th key={val.name}>{val.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {laptop_data.map((val) => (
              <td key={val.name} draggable onDragStart={(e) => handleDragStart(e, val)}>
                <img src={val.image} alt={val.name}/>
              </td>
            ))}
          </tr>
          <tr>
            {laptop_data.map((val) => (
              <td key={val.name} draggable onDragStart={(e) => handleDragStart(e, val)}>
                ${parseFloat(val.price).toFixed(2)}
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
              <strong>{item.name}</strong> - ${item.price} (Quantity: {item.quantity})
              <img src={item.image} alt={item.name} width="40" />
            </li>
          ))}
        </ul>
      </div>

    </div>

  );
};



export default Home;
