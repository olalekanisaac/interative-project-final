import { View, Text, StyleSheet } from "react-native";
import React from "react";



const FeedbackScreen = ({ route }) => {
  const feedbackData = route.params?.feedbackData || { pitch: 0, loudness: 0, duration: 0 };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Analysis Feedback</Text>
      <Text style={styles.text}>Pitch: {feedbackData.pitch.toFixed(2)} Hz</Text>
      <Text style={styles.text}>Loudness: {feedbackData.loudness.toFixed(2)}</Text>
      <Text style={styles.text}>Duration: {feedbackData.duration.toFixed(2)} sec</Text>
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
});
