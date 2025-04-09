import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const data = [
  {
    image: require("../Image/Untitled design 2.png"),
    title: "Discover Your Voice",
    description: "Unlock your singing potential with personalized vocal training and real-time feedback."
  },
  {
    image: require("../Image/soundtrap-PdO-fDWXQ5I-unsplash.jpg"),
    title: "Find Your Perfect Key",
    description: "Explore your vocal range and sing in the key that suits you best."
  },
  {
    image: require("../Image/bandlab-3W2wiLH2tw0-unsplash.jpg"),
    title: "Track Your Progress",
    description: "Watch yourself improve with progress tracking and tailored exercises."
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}></Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WelcomeScreen")}
        >
          <Text style={styles.buttonText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      
      <Carousel
        loop
        width={width}
        height={height * 0.8}
        autoPlay={false}
        data={data}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ index }) => (
          <View style={styles.slide}>
            <View style={styles.circleContainer}>
              <Image source={data[index].image} style={styles.image} />
            </View>
            <Text style={styles.title}>{data[index].title}</Text>
            <Text style={styles.description}>{data[index].description}</Text>
          </View>
        )}
      />

      {/* Dots Indicator */}
      <View style={styles.progressDots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#000"
      },
      slide: {
        alignItems: "center",
        justifyContent: "center",
        height: height * 0.8
      },
      circleContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 90,
        marginTop: 40,
      },
      image: {
        width: 250,
        height: 250,
        resizeMode: "cover",
        borderRadius: 75
      },
      title: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10
      },
      description: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginHorizontal: 20
      },
      progressDots: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 90
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 6,
      },
      activeDot: {
        backgroundColor: "#E01B84FF"
      },
      inactiveDot: {
        backgroundColor: "gray"
      },
      header: {
        flexDirection: "row", // Place elements side by side
        justifyContent: "space-between", // Push "SKIP" to the right
        alignItems: "center",
        paddingHorizontal: 20, // Add spacing inside the header
        paddingVertical: 10, // Add spacing inside the header
      
      },
      button: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        // backgroundColor: "#E01B84FF"
      },
      buttonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold"
      }
    });
    
export default OnboardingScreen;