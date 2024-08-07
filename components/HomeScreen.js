import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={require('../assets/+.png')} style={styles.backgroundImage}>
        <Text style={styles.title}>UBS</Text>
        <TouchableOpacity style={styles.button} onPress={() => alert('Função de Entrar/Registrar ainda não implementada')}>
          <Text style={styles.buttonText}>Entrar/Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ubsButton]} onPress={() => navigation.navigate('Map')}>
          <Text style={styles.buttonText}>Ver UBS's</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  title: {
    fontSize: 120,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 110,
    color: '#007bff',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 210,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  ubsButton: {
    backgroundColor: '#28a745',
    marginTop: 5,
  },
});

export default HomeScreen;
