import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // For tab icons
import RecordingScreen from "../Screen/RecordingScreen";
import ProfileScreen from "../Screen/ProfileScreen";
import FeedbackScreen from "../Screen/FeedbackScreen";
import LibraryScreen from "../Screen/LibraryScreen";

// Import screens (You'll need to create these separately)
 // Your existing recording screen




export default function TabNavigation() {
    const Tab = createBottomTabNavigator();
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Recording") {
              iconName = "mic-outline";
            } else if (route.name === "Profile") {
              iconName = "person-outline";
            }else if (route.name === "Feedback") {
              iconName = "chatbubble-ellipses-outline";
            } else if (route.name === "Library") {
              iconName = "book-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4CAF50", // Active tab color (green)
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "black",
            paddingBottom: 5,
            height: 80,
            
          },
        })}
      >
        <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Recording" component={RecordingScreen}  options={{ headerShown: false }} />
        <Tab.Screen name="Library" component={LibraryScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    
  );
}
