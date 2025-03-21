import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import Appnavigate from './AppNavigation/Appnavigate'; // Import the Appnavigate component
import SplashScreenView from './SplashScreenView';
import { NavigationContainer } from '@react-navigation/native';
import TabHolder from './Screen/TabHolder';
import FlaskChecking from './Screen/FlaskChecking';




const App = () => {
  const [isShowSplash, setisShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setisShowSplash(false);
    }, 2000); // Delay of 2 seconds for splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isShowSplash ? (
        <SplashScreenView /> // Your Splash Screen component
      ) : (
        
       <NavigationContainer>
        <TabHolder/>
       </NavigationContainer>
      // <FlaskChecking/>
     
       
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
