import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { checkBackendConnection } from "../api"; // Import function

const FlaskChecking = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      const result = await checkBackendConnection();
      setMessage(result);
      setLoading(false);
    };

    fetchMessage();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="blue" /> : <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

export default FlaskChecking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
