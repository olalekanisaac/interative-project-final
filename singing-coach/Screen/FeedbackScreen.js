import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av"; // Using expo-av for audio playback

const FeedbackScreen = ({ route }) => {
  // Log route parameters for debugging
  console.log("FeedbackScreen received params:", route.params);

  const feedbackData = route.params?.feedbackData || { pitch: 0, loudness: 0, duration: 0 };
  const audioUrl = route.params?.audioUrl; // Get the recording URL from the backend

  const [sound, setSound] = useState(null);
  const [detectedKey, setDetectedKey] = useState("Detecting...");

  // useeffect for the sound of audio
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  //  useeffect for detection of key
  useEffect(() => {
    const fetchKey = async () => {
      const keyData = await detectedKey();
      setDetectedKey(keyData.key);
    };
    fetchKey();
  }, []);

  // Function to play the audio
  const playRecording = async () => {
    if (!audioUrl) {
      alert("No audio file available");
      return;
    }

    console.log("Playing audio:", audioUrl);
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>

      {/* Button to play my audio */}
      <TouchableOpacity style={styles.button} onPress={playRecording}>
        <Text style={styles.buttonText}>Play Recording</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Key: {detectedKey}</Text>

    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1db954",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});