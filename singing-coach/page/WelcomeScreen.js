import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image on top, not covering the entire screen */}
      <Image source={require('../Image/sf.png')} style={styles.image} />

      {/* "HELLO" and subtitle text */}
      <Text style={styles.title}>HELLO</Text>
      <Text style={styles.subtitle}>Welcome to your musical journey! Let's begin with finding your perfect voice.</Text>
      
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
      backgroundColor:'black'
  },
  image: {
    width: 500,  
    height: 150,   
    resizeMode: 'contain',  
    marginTop: 40,  
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', 
    marginTop: 20,  
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',  // White text color for subtitle
    marginBottom: 60,


    
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,  // Add horizontal padding for the buttons
  },
  signInButton: {
   backgroundColor:'white',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
