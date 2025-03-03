import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = { width: '100%', height: '400px' };

const GoogleMapsComponent = ({ setRoute, setDeliveryTruck, setSelectedStore }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStorePosition, setSelectedStorePosition] = useState(null);
  const [map, setMap] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [stores, setStores] = useState([]);
  const directionsRendererRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTkwyTSOq5fh3ta9EZaIJRs1JNRUQWNbY" 
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost/Assignment1/get_stores.php');
        if (response.data.success) {
          setStores(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedStorePosition(response.data.data[0].position);
            setSelectedStore(response.data.data[0]);
          }
        } else {
          console.error('Error fetching stores:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, [setSelectedStore]);

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
    if (isLoaded && currentPosition && selectedStorePosition && map) {
      const directionsService = new window.google.maps.DirectionsService();

      // Clear previous directions renderer if it exists
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }

      directionsService.route(
        {
          origin: currentPosition,
          destination: selectedStorePosition,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // Create new DirectionsRenderer instance
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
  }, [isLoaded, currentPosition, selectedStorePosition, map, setRoute, selectedTruck]);

  const handleStoreChange = (event) => {
    const selectedStore = stores.find(store => store.name === event.target.value);
    setSelectedStorePosition(selectedStore.position);
    setSelectedStore(selectedStore);
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
        {stores.map(store => (
          <option key={store.store_id} value={store.name}>{store.name}</option>
        ))}
      </select>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || selectedStorePosition}
          zoom={10}
          onLoad={(map) => setMap(map)}
        >
          {currentPosition && <Marker position={currentPosition} label="You" />}
          {selectedStorePosition && <Marker position={selectedStorePosition} label="Store" />}
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