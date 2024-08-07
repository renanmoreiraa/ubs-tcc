// components/CustomMarker.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomMarker = () => {
  return (
    <View style={styles.marker}>
      <Image source={require('../assets/ubs-icon.png')} style={styles.icon} />
    </View>
  );
};
const CustomMarker2 = () => {
  return (
    <View style={styles.marker}>
      <Image source={require('../assets/location-icon.png')} style={styles.icon} />
    </View>
  );
};
const styles = StyleSheet.create({
  marker: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 40, // Ajuste o tamanho conforme necessário
    height: 40, // Ajuste o tamanho conforme necessário
  },
});

export default CustomMarker2;

