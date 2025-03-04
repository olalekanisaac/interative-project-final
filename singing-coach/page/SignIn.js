import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity,Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Image/sf.png')} style={styles.image} />
        {/* <Text style={styles.logo}>Singing Feedback</Text> */}
      </View>
      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeButton}>
            <FontAwesome5 name="eye" size={20} color="gray" /> 
          </TouchableOpacity>
        </View>
        <View style={styles.rememberContainer}>
          <TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <Button title="Sign In" buttonStyle={styles.loginButton} onPress={() => navigation.navigate('LevelSelectionScreen')}/>
      </Card>
      <View style={styles.socialLoginContainer}>
        <Text style={styles.socialLoginText}>or Sign in with</Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="facebook-f" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="google" size={24} color="#db4437" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818', // Dark background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {

  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff', 
  },
  image:{
    width: 200, // Adjust width and height as needed
    height: 150,
    marginBottom: 40,
    resizeMode:'contain'
  },
  card: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#fff', 
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#fff', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    marginLeft: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rememberText: {
    color: '#fff', 
  },
  forgotText: {
    color: '#fff', 
  },
  loginButton: {
    backgroundColor: '#2ecc71', // Green button color
    borderRadius: 5,
  },
  socialLoginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialLoginText: {
    color: '#fff', 
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
  },
  socialButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  registerContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#fff', 
  },
  registerButtonText: {
    color: '#2ecc71', 
    fontWeight: 'bold',
  },
});

export default LoginScreen;