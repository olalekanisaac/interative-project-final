import { Button, StyleSheet, Text, View, TouchableOpacity, FlatList, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';


// const NUM_BARS = 20; // Number of bars in the visualizer

const RecordingScreen = () => {
  const navigation = useNavigation(); // Get navigation object

  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  // const barAnimations = useRef([...Array(NUM_BARS)].map(() => new Animated.Value(0))).current;
  const lottieRef = useRef(null); // Ref for Lottie animation

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
        setIsListening(true);
        // animateBars(); // Start visualizer animation
        if (lottieRef.current) {
          lottieRef.current.play(); // Start Lottie animation
        }
      }
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      setRecordings([...recordings, { sound, duration: getDurationFormatted(status.durationMillis), file: uri }]);
      
      setRecording(null);
      setIsListening(false);
      // resetBars();
  
      if (lottieRef.current) {
        lottieRef.current.reset();
      }
  
      // Sends the file to Flask backend for analysis
      analyzeRecording(uri);
  
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  }
  
  async function analyzeRecording() {
    if (!audioUri) return;
  
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      name: "recording.wav",
      type: "audio/wav",
    });
  
    try {
      const response = await fetch("http://192.168.150.12:5000/analyze", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const result = await response.json();
      console.log("Analysis Result:", result);
     navigation.navigate("FeedbackScreen", { feedbackData: result }); // Navigate with data
  
    } catch (error) {
      console.error("Error analyzing audio:", error);
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.round((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function deleteRecording(index) {
    setRecordings(recordings.filter((_, i) => i !== index));
  }

  // function animateBars() {
  //   barAnimations.forEach((bar) => {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(bar, { toValue: Math.random() * 100, duration: 200, useNativeDriver: false }),
  //         Animated.timing(bar, { toValue: Math.random() * 50, duration: 200, useNativeDriver: false }),
  //       ])
  //     ).start();
  //   });
  // }

  // function resetBars() {
  //   barAnimations.forEach((bar) => bar.setValue(0));
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isListening ? "Listening..." : "Tap to Record"}</Text>

      {/* Live Audio Visualizer */}
      {/* <View style={styles.visualizer}>
        {barAnimations.map((bar, index) => (
          <Animated.View key={index} style={[styles.bar, { height: bar }]} />
        ))}
      </View> */}

      {/* Lottie Animation for Recording */}
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        {isListening ? (
          <LottieView
            ref={lottieRef}
            source={require('../lottifile/Animation - 1741258417059.json')} // Replace with your Lottie file
            autoPlay
            loop
            style={styles.lottie}
          />
        ) : (
          <Ionicons name="mic" size={120} color="#fff" />
        )}
      </TouchableOpacity>

      {/* Recorded Audio List */}
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>Recording {index + 1} | {item.duration}</Text>
            <TouchableOpacity onPress={() => item.sound.replayAsync()}>
              <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteRecording(index)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Clear All Button */}
      {recordings.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Clear All" color="red" onPress={() => setRecordings([])} />
        </View>
      )}
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    width: 400,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  bar: {
    width: 20,
    backgroundColor: '#6b21a8',
    marginHorizontal: 2,
    borderRadius: 5,
  },
  micButton: {
    width: 220,
    height: 220,
    borderRadius: 150,
    // backgroundColor: '#6b21a8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666161FF',
    padding: 20,
    marginVertical: 50,
    borderRadius: 10,
    width: '100%',
  },
  recordingText: {
    color: 'white',
    flex: 1,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
});
