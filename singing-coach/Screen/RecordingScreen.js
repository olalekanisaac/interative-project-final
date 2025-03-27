import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { startRecording, stopRecording, getCurrentNote } from "../api";  // ✅ API calls

const RecordingScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [recordingFile, setRecordingFile] = useState(null);
  const [currentNote, setCurrentNote] = useState("...");
  const lottieRef = useRef(null);
  const noteInterval = useRef(null);

  const backendURL = "http://192.168.105.12:5000";

  useEffect(() => {
    return () => {
      if (noteInterval.current) clearInterval(noteInterval.current);
    };
  }, []);

  // ✅ Fetch Current Note During Recording
  const fetchCurrentNote = async () => {
    try {
      const note = await getCurrentNote();
      console.log("Fetched Note:", note); // ✅ Debugging: Check if backend sends live updates
      setCurrentNote(note);
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };
  

  // ✅ Start Recording
  const startRecordingHandler = async () => {
    try {
      const result = await startRecording();
      if (result.message === "Recording started") {
        setIsListening(true);
        if (lottieRef.current) lottieRef.current.play();
        noteInterval.current = setInterval(fetchCurrentNote, 500);  // 🔥 Fetch note every second
      } else {
        Alert.alert("Error", "Failed to start recording.");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "An error occurred while starting recording.");
    }
  };

  // ✅ Stop Recording
// ✅ Stop Recording
const stopRecordingHandler = async () => {
  try {
    const result = await stopRecording();
    if (result.file) {
      setRecordingFile(result.file);
      
      // ✅ Use the latest fetched note instead of result.last_note
      setCurrentNote((prevNote) => {
        console.log("Final Detected Note:", prevNote);
        return prevNote; // Ensures last fetched note is used
      });

      setIsListening(false);
      if (noteInterval.current) clearInterval(noteInterval.current);

      // ✅ Navigate to FeedbackScreen with the last detected note
      setTimeout(() => {
        navigation.navigate("Feedback", {
          audioUrl: `${backendURL}/recordings/${encodeURIComponent(result.file.split('/').pop())}`,
          lastNote: currentNote || "Unknown"
        });
      }, 1000);
    } else {
      Alert.alert("Error", "Failed to stop recording.");
    }
  } catch (error) {
    console.error("Error stopping recording:", error);
    Alert.alert("Error", "An error occurred while stopping recording.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isListening ? "Recording..." : "Tap to Record"}</Text>
      <Text style={styles.noteText}>Current Note: {currentNote}</Text>

      <TouchableOpacity style={styles.micButton} onPress={isListening ? stopRecordingHandler : startRecordingHandler}>
        <Ionicons name="mic" size={120} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default RecordingScreen;

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", justifyContent: "center", alignItems: "center" },
  header: { color: "white", fontSize: 24, marginBottom: 20 },
  noteText: { color: "#00ffcc", fontSize: 20, marginBottom: 10 },
  micButton: { width: 220, height: 220, borderRadius: 150, justifyContent: "center", alignItems: "center", marginTop: 50 },
  lottie: { width: 250, height: 250 },
});
