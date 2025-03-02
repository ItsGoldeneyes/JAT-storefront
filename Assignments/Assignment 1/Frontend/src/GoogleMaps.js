import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

const storeLocations = [
  { name: "Store 1", position: { lat: 43.65808, lng: -79.38138 }, deliveryTruck: "Truck 1" },
  { name: "Store 2", position: { lat: 44, lng: -80 }, deliveryTruck: "Truck 2" },
];

const BASE_DELIVERY_PRICE = 5;
const PRICE_PER_KM = 0.50;
const PROCESSING_TIME_HOURS = 6;
const AVERAGE_SPEED_KMH = 40;

const GoogleMapsComponent = ({ setDeliveryPrice, setDeliveryTruck, setOrigin, setDestination }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStore, setSelectedStore] = useState(storeLocations[0].position);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [deliveryPrice, setLocalDeliveryPrice] = useState(null);
  const [earliestDelivery, setEarliestDelivery] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [geolocationAllowed, setGeolocationAllowed] = useState(true);

  const API_KEY = "AIzaSyDTkwyTSOq5fh3ta9EZaIJRs1JNRUQWNbY";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY
  });

  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // TODO: pass the name of the location
          setOrigin(`Lat: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.warn("Geolocation denied, switching to manual input");
          setGeolocationAllowed(false);
        }
      );
    }
  }, [isLoaded, setOrigin]);

  useEffect(() => {
    if (isLoaded && currentPosition && selectedStore) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentPosition,
          destination: selectedStore,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const store = storeLocations.find(s => s.position === selectedStore);
            setDeliveryTruck(store.deliveryTruck);
            setDestination(store.name);

            // get distance
            const route = result.routes[0].legs[0];
            const distanceText = route.distance.text;
            setDistance(distanceText);

            const numericDistance = parseFloat(distanceText.replace(/[^\d.]/g, '')); // concert to num
            const price = BASE_DELIVERY_PRICE + (PRICE_PER_KM * numericDistance);
            setLocalDeliveryPrice(price.toFixed(2));
            setDeliveryPrice(price.toFixed(2));

            // calculate earliest delivery time
            const travelTimeHours = numericDistance / AVERAGE_SPEED_KMH;
            const totalHours = PROCESSING_TIME_HOURS + travelTimeHours;

            const currentTime = new Date();
            currentTime.setHours(currentTime.getHours() + totalHours);

            setEarliestDelivery(currentTime.toLocaleString());

          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, currentPosition, selectedStore, setDeliveryPrice, setDeliveryTruck, setDestination]);

  const handleStoreChange = (event) => {
    const store = storeLocations.find(s => s.name === event.target.value);
    setSelectedStore(store.position);
    setDeliveryTruck(store.deliveryTruck);
    setDestination(store.name);
    setDirections(null);
  };

  const handleManualLocation = async () => {
    if (!manualLocation) return;

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=${API_KEY}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setCurrentPosition({ lat, lng });
        setOrigin(data.results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", data.status);
        alert("Location not found. Try again.");
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
    }
  };

  return (
    <div>
      <h2>Shipping</h2>
      <label htmlFor="store-select">Select Store:</label>
      <select id="store-select" onChange={handleStoreChange}>
        {storeLocations.map(store => (
          <option key={store.name} value={store.name}>{store.name}</option>
        ))}
      </select>

      {!geolocationAllowed && (
        <div>
          <input
            type="text"
            placeholder="Enter your location..."
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <button onClick={handleManualLocation}>Submit</button>
        </div>
      )}

      {distance && <p>Distance to store: {distance}</p>}
      {deliveryPrice && <p>Delivery Price: ${deliveryPrice}</p>}
      {earliestDelivery && <p>Earliest Delivery: {earliestDelivery}</p>}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || selectedStore}
          zoom={10}
        >
          {currentPosition && <Marker position={currentPosition} label="You" />}
          <Marker position={selectedStore} label="Store" />
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapsComponent;