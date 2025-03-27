
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header with background gradient */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            // source={{ uri: 'https://randomuser.me/api/portraits/men/21.jpg' }} 
            style={styles.avatar}
          />
          <Text style={styles.name}>Michael Johnson</Text>
          <Text style={styles.subtitle}>Piano Enthusiast</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Songs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Ionicons name="musical-notes" size={24} color="#1db954" />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Note Accuracy</Text>
              <Text style={styles.progressSubtitle}>75% accuracy on average</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Ionicons name="time-outline" size={24} color="#1db954" />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Practice Time</Text>
              <Text style={styles.progressSubtitle}>3.5 hours this week</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <TouchableOpacity style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="mic-outline" size={24} color="#fff" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>C Major Scale</Text>
            <Text style={styles.activitySubtitle}>Yesterday • 10 min session</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="mic-outline" size={24} color="#fff" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>G Minor Chord</Text>
            <Text style={styles.activitySubtitle}>2 days ago • 15 min session</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    backgroundColor: '#111',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 25,
    marginBottom: 20,
    shadowColor: '#1db954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#1db954',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1db954',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: '#161616',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 3,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1db954',
    borderRadius: 4,
  },
  activityCard: {
    backgroundColor: '#161616',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1db954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    width: '30%',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  },
});