// components/MapScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import UBSList from './UBSList';
import ubsData from '../ubs_sip_para.json';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [nearestUBS, setNearestUBS] = useState([]);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    calculateDistances(location);
  };

  const calculateDistances = (location) => {
    const updatedUBS = ubsData.map((ubs) => {
      const latitude = parseFloat(ubs.LATITUDE.replace(',', '.'));
      const longitude = parseFloat(ubs.LONGITUDE.replace(',', '.'));
      const distance = getDistance(
        location.coords.latitude,
        location.coords.longitude,
        latitude,
        longitude
      );
      return { ...ubs, distance };
    });

    const sortedUBS = updatedUBS.sort((a, b) => a.distance - b.distance);
    setNearestUBS(sortedUBS);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 - Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const renderUBSMarkers = () => {
    return nearestUBS.map((ubs) => {
      const latitude = parseFloat(ubs.LATITUDE.replace(',', '.'));
      const longitude = parseFloat(ubs.LONGITUDE.replace(',', '.'));
      return (
        <Marker
          key={ubs.CNES.toString()}
          coordinate={{ latitude, longitude }}
          title={ubs.NOME}
          description={`Endereço: ${ubs.LOGRADOURO}, ${ubs.BAIRRO}`}
        />
          
      );
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          location && {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
        showsUserLocation={true}
      >
        {renderUBSMarkers()}
      </MapView>
      <View style={styles.listContainer}>
        <UBSList data={nearestUBS} navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '50%',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 5,
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
});

