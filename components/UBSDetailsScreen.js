import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function UBSDetailsScreen({ route }) {
  const { ubs } = route.params;
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    getLocationAsync();
  }, []);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCrM8BR55SSN_NX1xyzCEd4-Etd9nfr9Mc';

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    if (location && ubs) {
      getDirections(location.coords.latitude, location.coords.longitude, parseFloat(ubs.LATITUDE.replace(',', '.')), parseFloat(ubs.LONGITUDE.replace(',', '.')));
    }
  };

  const getDirections = async (originLat, originLng, destinationLat, destinationLng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.routes.length > 0 && data.routes[0].overview_polyline && data.routes[0].overview_polyline.points) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const decodePolyline = (encoded) => {
    const len = encoded.length;
    let index = 0;
    const array = [];
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      array.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return array;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {location && (
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Minha Localização" />
        )}
        {ubs && (
          <Marker coordinate={{ latitude: parseFloat(ubs.LATITUDE.replace(',', '.')), longitude: parseFloat(ubs.LONGITUDE.replace(',', '.')) }} title={ubs.NOME} />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={6} strokeColor="#000" />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
