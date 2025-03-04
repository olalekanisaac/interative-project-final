import { Button, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const RecordingScreen = () => {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isListening, setIsListening] = useState(false);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
        setIsListening(true);
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
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      setRecordings([...recordings, { sound, duration: getDurationFormatted(status.durationMillis), file: uri }]);
      setRecording(null);
      setIsListening(false);
    } catch (err) {
      console.error("Failed to stop recording:", err);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isListening ? "Listening" : "Tap to Record"}</Text>
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Ionicons name="mic" size={60} color="#fff" />
      </TouchableOpacity>
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
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6b21a8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: '90%',
  },
  recordingText: {
    color: 'white',
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
});
