import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase  from '../Supabase/SupabaseClient'; // Import your supabase client

const LibraryScreen = () => {
  const [libraryItems, setLibraryItems] = useState([]); // To store fetched library items

  useEffect(() => {
    const fetchLibraryItems = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (user) {
        const { data, error } = await supabase
          .from('user_library')
          .select('*')
          .eq('user_email', user.email) // Correct filter
  
        if (error) {
          console.error('Error fetching library items:', error);
        } else {
          setLibraryItems(data);
        }
      } else if (userError) {
        console.error('User fetch error:', userError);
      }
    };
  
    fetchLibraryItems();
  }, []);
  

  const renderLibraryItem = ({ item }) => (
    <TouchableOpacity style={styles.libraryCard}>
      <View style={styles.libraryIconContainer}>
        <Ionicons name="musical-notes" size={24} color="#fff" />
      </View>
      <View style={styles.libraryContent}>
        <Text style={styles.libraryTitle}>Key: {item.musical_key || "N/A"}</Text>
        <Text style={styles.librarySubtitle}>{item.feedback || "No feedback"}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={28} color="#1db954" />
    </TouchableOpacity>
  );
  

  return (
    <ScrollView style={styles.container}>
      {/* User profile header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>Michael Johnson</Text>
            <Text style={styles.subtitle}>Piano Enthusiast</Text>
          </View>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Search your library</Text>
      </View>

      {/* Your Library */}
      <View style={styles.librarySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Library</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={libraryItems}
          renderItem={renderLibraryItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#1db954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#1db954',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    margin: 20,
    marginTop: 25,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  librarySection: {
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#1db954',
    fontSize: 14,
    fontWeight: '500',
  },
  libraryCard: {
    backgroundColor: '#161616',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  libraryIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1db954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  libraryContent: {
    flex: 1,
  },
  libraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  librarySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 3,
  },
  bottomPadding: {
    height: 40,
  },
});
