import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // Handle sign-up logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Image/sf.png')} style={styles.image} />
        {/* <Text style={styles.logo}>SF</Text> */}
      </View>
      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button title="Sign Up" buttonStyle={styles.signUpButton} onPress={handleSignUp}
        
        />
      </Card>
      <View style={styles.socialLoginContainer}>
        <Text style={styles.socialLoginText}>or Sign up with</Text>
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
        <Text style={styles.registerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.registerButtonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
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
  signUpButton: {
    backgroundColor: '#2ecc71',
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

export default SignUp;
