import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const storeLocations = [
  { name: "Store 1", position: { lat: 43.65808062403946, lng: -79.38138663721685 } },
  { name: "Store 2", position: { lat: 44, lng: -80 } },
];

const GoogleMapsComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStore, setSelectedStore] = useState(storeLocations[0].position);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDTkwyTSOq5fh3ta9EZaIJRs1JNRUQWNbY"
  });

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
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, currentPosition, selectedStore]);

  const handleStoreChange = (event) => {
    const selectedStore = storeLocations.find(store => store.name === event.target.value);
    setSelectedStore(selectedStore.position);
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