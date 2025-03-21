import { Button, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { startRecording, stopRecording } from '../api';

const RecordingScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const lottieRef = useRef(null);

  const toggleRecording = async () => {
    try {
      if (isListening) {
        // Stop recording
        const response = await stopRecording();
        if (!response || !response.file) {
          Alert.alert("Error", "Failed to stop recording. Please try again.");
          return;
        }

        setIsListening(false);
        if (lottieRef.current) {
          lottieRef.current.pause(); // Stop animation properly
        }

        console.log("Recording stopped:", response);

        // Wait 1 second before navigating to ensure file is saved
        setTimeout(() => {
          navigation.navigate("Feedback", { audioUrl: response.file });
        }, 1000);
      } else {
        // Start recording
        const response = await startRecording();
        if (!response) {
          Alert.alert("Error", "Failed to start recording. Please try again.");
          return;
        }

        setIsListening(true);
        if (lottieRef.current) {
          lottieRef.current.play();
        }

        console.log("Recording started:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isListening ? "Recording..." : "Tap to Record"}</Text>
      <TouchableOpacity style={styles.micButton} onPress={toggleRecording}>
        {isListening ? (
          <LottieView ref={lottieRef} source={require('../lottifile/Animation - 1741258417059.json')} autoPlay loop style={styles.lottie} />
        ) : (
          <Ionicons name="mic" size={120} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' },
  header: { color: 'white', fontSize: 24, marginBottom: 20 },
  micButton: { width: 220, height: 220, borderRadius: 150, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  lottie: { width: 250, height: 250 },
});
