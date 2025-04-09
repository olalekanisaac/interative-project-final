import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { supabase } from './Supabase/SupabaseClient';
import Appnavigate from './AppNavigation/Appnavigate';
import SplashScreenView from './SplashScreenView';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Fetching session from Supabase...");
        const { data: { session }, error } = await supabase.auth.getSession();
  
        if (error) {
          console.log("Error fetching session:", error.message);
        } else {
          console.log("Session fetched:", session);
        }
  
        setUser(session?.user || null);
        setIsShowSplash(false);
      } catch (e) {
        console.log("Exception while initializing app:", e);
        setIsShowSplash(false); // Still proceed to app even if there's an error
      }
    };
  
    const timer = setTimeout(() => {
      initializeApp();
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <SafeAreaView style={styles.container}>
      {isShowSplash ? (
        <SplashScreenView />
      ) : (
        <Appnavigate user={user} />
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
