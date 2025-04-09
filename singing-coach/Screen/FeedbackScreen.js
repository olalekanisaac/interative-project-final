import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  RefreshControl,
  Dimensions,
  StatusBar
} from "react-native";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import supabase from '../Supabase/SupabaseClient'

const { width } = Dimensions.get("window");
const backendURL = "http://192.168.230.12:5000";


const FeedbackScreen = ({ route }) => {
  console.log("FeedbackScreen received params:", route.params);

  const [audioUrl, setAudioUrl] = useState(route.params?.audioUrl || null);
  const [detectedKey, setDetectedKey] = useState(route.params?.lastNote || "Unknown");
  const [feedbackText, setFeedbackText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sound, setSound] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const keyLottieRef = useRef(null);
  const geminiLottieRef = useRef(null);

  useEffect(() => {
    if (route.params?.audioUrl) {
      console.log("New recording detected, updating audio URL...");
      setAudioUrl(route.params.audioUrl);
      fetchKey();
    }

    if (route.params?.lastNote) {
      console.log("New detected note received:", route.params.lastNote);
      setDetectedKey(route.params.lastNote);
    }
  }, [route.params]);

  // Play recorded audio
  const playRecording = async () => {
    if (!audioUrl) {
      Alert.alert("Error", "No audio file available.");
      return;
    }
  
    const audioUri = `https://rrgscadnpzbecaakhfbk.supabase.co/storage/v1/object/public/audio-files/recordings/${audioUrl.replace(/^.*[\\/]/, '')}`;
  
    try {
      console.log("Playing audio:", audioUri);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri }, // Use Supabase URL
        { shouldPlay: true }
      );
  
      setSound(sound);
      await sound.playAsync();
  
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("Playback finished");
          sound.unloadAsync();
        }
      });
  
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Could not play the recording.");
    }
  };
  
  
  // Fetch the latest detected key
  const fetchKey = async () => {
    try {
      setIsRefreshing(true);

      if (keyLottieRef.current) {
        keyLottieRef.current.reset();
        keyLottieRef.current.play();
      }

      console.log("Fetching latest key detection...");
      const response = await fetch(`${backendURL}/detect_key`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      console.log("Key Detected:", data.current_note);
      setDetectedKey(data.current_note || "Unknown");
    } catch (error) {
      console.error("Error fetching key:", error);
      setDetectedKey("Error detecting key");
    } finally {
      setIsRefreshing(false);
      if (keyLottieRef.current) keyLottieRef.current.pause();
    }
  };

  // Fetch Gemini Feedback
  const fetchGeminiFeedback = async () => {
    if (!detectedKey || detectedKey === "Unknown") {
      Alert.alert("Error", "No valid note detected for feedback.");
      return;
    }
  
    try {
      setFeedbackText(""); // Clear previous feedback
      setIsTyping(true);
  
      if (geminiLottieRef.current) {
        geminiLottieRef.current.reset();
        geminiLottieRef.current.play();
      }
  
      console.log("Fetching feedback from Gemini...");
      const response = await fetch(`${backendURL}/get_feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch: detectedKey, key: detectedKey }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Gemini Feedback:", data.feedback);
  
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < data.feedback.length) {
          setFeedbackText((prev) => prev + data.feedback[i]);
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          if (geminiLottieRef.current) geminiLottieRef.current.pause();
        }
      }, 50);
  
      // ✅ Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (userError || !user) {
        console.error("Error retrieving user:", userError);
        return;
      }
  
      const userEmail = user.email;
  
      // ✅ Save to Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from('user_library') // ✅ correct table name
        .insert([
          {
            user_email: userEmail,
            audio_url: audioUrl,
            musical_key: detectedKey,
            feedback: data.feedback,
          },
        ]);
  
      if (insertError) {
        throw new Error(insertError.message);
      }
  
      console.log("Feedback saved to user_library:", insertedData);
  
    } catch (error) {
      console.error("Error fetching Gemini feedback:", error);
      setFeedbackText("Error retrieving feedback.");
      setIsTyping(false);
    }
  };
  
  

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={fetchKey}
          colors={["#1db954"]} 
          tintColor="#1db954"
        />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Audio Feedback</Text>
          <Text style={styles.headerSubtitle}>Analyze your performance</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recording</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity style={styles.playButton} onPress={playRecording}>
              <Ionicons name="play" size={24} color="white" />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Note Detection</Text>
              <View style={styles.divider} />
            </View>
            
            {isRefreshing ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  ref={keyLottieRef}
                  source={require("../lottifile/Animation - 1742539341065.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text style={styles.loadingText}>Detecting note...</Text>
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <Text style={styles.noteText}>{detectedKey}</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchKey}>
                  <Ionicons name="refresh" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.feedbackCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>AI Feedback</Text>
              <View style={styles.divider} />
            </View>
            
            {isTyping ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  ref={geminiLottieRef}
                  source={require("../lottifile/Animation - 1743000519790.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text style={styles.loadingText}>Generating feedback...</Text>
              </View>
            ) : (
              <Text style={[styles.feedbackText, !feedbackText && styles.placeholderText]}>
                {feedbackText || "Get feedback on your performance"}
              </Text>
            )}
            
            <TouchableOpacity 
              style={styles.getFeedbackButton} 
              onPress={fetchGeminiFeedback}
              disabled={isTyping}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              <Text style={styles.buttonText}>Get Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#9e9e9e",
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  feedbackCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: 220,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    width: "100%",
  },
  playButton: {
    backgroundColor: "#1db954",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    alignSelf: "stretch",
  },
  refreshButton: {
    backgroundColor: "#333333",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  noteText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1db954",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "#9e9e9e",
    marginTop: 12,
  },
  lottie: {
    width: 60,
    height: 60,
  },
  feedbackText: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    marginVertical: 16,
  },
  placeholderText: {
    color: "#9e9e9e",
    fontStyle: "italic",
    textAlign: "center",
  },
  getFeedbackButton: {
    backgroundColor: "#1db954",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    alignSelf: "stretch",
    marginTop: 16,
  },
});

export default FeedbackScreen;
