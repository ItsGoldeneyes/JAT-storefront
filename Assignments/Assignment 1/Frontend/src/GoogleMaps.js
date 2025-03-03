import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

const storeLocations = [
  { name: "Store 1", position: { lat: 43.65808062403946, lng: -79.38138663721685 } },
  { name: "Store 2", position: { lat: 44, lng: -80 } },
];

const deliveryTrucks = {
  "Store 1": "Truck 1",
  "Store 2": "Truck 2",
};

const GoogleMapsComponent = ({ setRoute, setDeliveryTruck }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStore, setSelectedStore] = useState(storeLocations[0].position);
  const [map, setMap] = useState(null);
  const directionsRendererRef = useRef(null);

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

            const store = storeLocations.find(
              store =>
                store.position.lat === selectedStore.lat &&
                store.position.lng === selectedStore.lng
            );

            if (store) {
              setDeliveryTruck(deliveryTrucks[store.name]);
            } else {
              console.error("Store not found");
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, currentPosition, selectedStore, map, setRoute]);

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
          onLoad={(map) => setMap(map)}
        >
          {currentPosition && <Marker position={currentPosition} label="You" />}
          <Marker position={selectedStore} label="Store" />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapsComponent;