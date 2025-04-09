import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import supabase from '../Supabase/SupabaseClient'; // Import Supabase client
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Start loading
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        setLoading(false);
        alert(error.message);
      } else {
        // ✅ Save the user's email to AsyncStorage
        await AsyncStorage.setItem('userEmail', email);

        // ✅ Save the user's email to Supabase
        const { data: userData, error: insertError } = await supabase
          .from('user_library') // Assuming the table is user_library
          .upsert([{
            user_email: email,
          }]);

        if (insertError) {
          alert('Error saving email to Supabase');
          console.error(insertError);
        }

        setLoading(false);
        alert('Login successful');
        navigation.navigate('LevelSelectionScreen');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Image/sf.png')} style={styles.image} />
      </View>
      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={20} color="gray" />
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
        <Button
          title={loading ? "Signing In..." : "Sign In"}
          buttonStyle={styles.loginButton}
          onPress={handleLogin}
          disabled={loading} // Disable button while loading
        />
        {loading && <ActivityIndicator size="small" color="#2ecc71" style={styles.loader} />}
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
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {},
  image: {
    width: 200,
    height: 150,
    marginBottom: 40,
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
    color: 'black',
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
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  loader: {
    marginTop: 10,
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
