import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const ChooseInterestsScreen = ({ navigation }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    'Pop', 'Classical', 'Jazz', 'Rock',
    'R&B', 'Gospel', 'Hip-Hop', 'Country',
    'Acapella', 'Folk', 'Opera', 'Traditional',
    'Warm-Ups', 'Pitch Drills', 'Harmonies', 'Key Exercises',
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
      
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Which category do you prefer?</Text>
        <Text style={styles.subtitle}>Choose your favorite category for more personalized music</Text>
      </View>
      <ScrollView contentContainerStyle={styles.interestsContainer}>
        {interests.map((interest, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.interestButton,
              selectedInterests.includes(interest) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                selectedInterests.includes(interest) && styles.selectedText,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('RecordingScreen', { interests: selectedInterests })}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // White text for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888', // Grey text for subtitle
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestButton: {
    width: '48%', 
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#555', 
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Dark background for buttons
  },
  selectedInterest: {
    backgroundColor: '#4444FF', // Highlighted color for selected
    borderColor: 'gold',
  },
  interestText: {
    fontSize: 14,
    color: '#FFF', // White text for unselected buttons
  },
  selectedText: {
    color: '#FFF', // White text for selected buttons
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseInterestsScreen;
