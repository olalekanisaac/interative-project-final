import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LevelSelectionScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleNext = async () => {
    if (selectedLevel) {
      // Save the selected level to AsyncStorage
      await AsyncStorage.setItem('selectedLevel', selectedLevel);
      console.log(`Selected Level: ${selectedLevel}`);
      navigation.navigate('ChooseInterestsScreen'); // Replace 'NextScreen' with the actual screen name
    } else {
      alert('Please select a level to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your level?</Text>
      <Text style={styles.subtitle}>We will personalize the app to match your experience</Text>

      <TouchableOpacity
        style={[styles.optionButton, selectedLevel === 'Beginner' && styles.Begin]}
        onPress={() => setSelectedLevel('Beginner')}
      >
        <Text style={styles.optionTitle}>Beginner</Text>
        <Text style={styles.optionSubtitle}>I am new to singing</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, selectedLevel === 'Intermediate' && styles.inter]}
        onPress={() => setSelectedLevel('Intermediate')}
      >
        <Text style={styles.optionTitle}>Intermediate</Text>
        <Text style={styles.optionSubtitle}>I have some singing experience</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, selectedLevel === 'Advanced' && styles.advance]}
        onPress={() => setSelectedLevel('Advanced')}
      >
        <Text style={styles.optionTitle}>Advanced</Text>
        <Text style={styles.optionSubtitle}>I am an experienced singer</Text>
      </TouchableOpacity>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonNext} onPress={handleNext}>
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  optionButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  Begin: {
    backgroundColor: '#87D4B1FF',
  },
  inter: {
    backgroundColor: '#F8C471FF',
  },
  advance: {
    backgroundColor: '#F14545FF',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: '40%',
    alignItems: 'center',
  },
  navButtonNext: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  
  
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LevelSelectionScreen;

