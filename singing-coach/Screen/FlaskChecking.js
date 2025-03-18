import React, { useEffect, useState, } from "react";
import {StyleSheet, View, Text, ActivityIndicator,  } from "react-native";
import { checkBackendConnection } from "../api"; // Import the function

const FlaskChecking = () => {
 const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const result = await checkBackendConnection();
      setMessage(result);
    };

    fetchMessage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {message ? <Text>{message}</Text> : <ActivityIndicator size="large" />}
    </View>
  );
};


export default FlaskChecking

const styles = StyleSheet.create({})