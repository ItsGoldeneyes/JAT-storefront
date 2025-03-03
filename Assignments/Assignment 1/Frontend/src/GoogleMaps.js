import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = { width: '100%', height: '400px' };

const storeLocations = [
  { name: "Store 1", position: { lat: 43.65808062403946, lng: -79.38138663721685 } },
  { name: "Store 2", position: { lat: 44, lng: -80 } },
];

const GoogleMapsComponent = ({ setRoute, setDeliveryTruck }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStore, setSelectedStore] = useState(storeLocations[0].position);
  const [map, setMap] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const directionsRendererRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTkwyTSOq5fh3ta9EZaIJRs1JNRUQWNbY"
  });

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await axios.get('http://localhost/Assignment1/get_trucks.php');
        if (response.data.success) {
          setTrucks(response.data.data);
        } else {
          console.error('Error fetching trucks:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching trucks:', error);
      }
    };

    fetchTrucks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && currentPosition && selectedStore && map) {
      const directionsService = new window.google.maps.DirectionsService();

      // clear previous directions renderer if it exists
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }

      directionsService.route(
        {
          origin: currentPosition,
          destination: selectedStore,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // create new DirectionsRenderer instance
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
            directionsRendererRef.current.setMap(map);
            directionsRendererRef.current.setDirections(result);

            setRoute(result.routes[0].legs[0]);

            if (selectedTruck) {
              setDeliveryTruck(selectedTruck);
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, currentPosition, selectedStore, map, setRoute, trucks]);

  const handleStoreChange = (event) => {
    const selectedStore = storeLocations.find(store => store.name === event.target.value);
    setSelectedStore(selectedStore.position);
    setSelectedTruck(null);
  };

  const handleTruckChange = (event) => {
    const truckCode = event.target.value;
    setSelectedTruck(truckCode);
    setDeliveryTruck(truckCode); 
  };

  const availableTrucks = trucks.filter(truck => truck.Availability_Code === 'AVAILABLE');

  return (
    <div>
      <h2>Shipping</h2>
      <label htmlFor="store-select">Select Store:</label>
      <select id="store-select" onChange={handleStoreChange}>
        {storeLocations.map(store => (
          <option key={store.name} value={store.name}>{store.name}</option>
        ))}
      </select>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || selectedStore}
          zoom={10}
          onLoad={(map) => setMap(map)}
        >
          {currentPosition && <Marker position={currentPosition} label="You" />}
          <Marker position={selectedStore} label="Store" />
        </GoogleMap>
      )}
      <div>
        <h3>Available Trucks</h3>
        <ul>
          {trucks.map(truck => (
            <li key={truck.Truck_Id}>
              {truck.Truck_Code} - {truck.Availability_Code}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="truck-select">Select Truck:</label>
        <select id="truck-select" onChange={handleTruckChange} value={selectedTruck || ''}>
          <option value="">Select a truck</option>
          {availableTrucks.map(truck => (
            <option key={truck.Truck_Id} value={truck.Truck_Code}>
              {truck.Truck_Code} - {truck.Availability_Code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GoogleMapsComponent;