
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LibraryScreen = () => {
  // Sample data for library items
  const libraryItems = [
    { id: '1', title: 'C Major Scale', date: '2 days ago', duration: '10 min', icon: 'musical-notes' },
    { id: '2', title: 'G Minor Chord', date: '3 days ago', duration: '15 min', icon: 'musical-notes' },
    { id: '3', title: 'F# Pentatonic', date: '1 week ago', duration: '20 min', icon: 'musical-notes' },
    { id: '4', title: 'D Dorian Mode', date: '1 week ago', duration: '12 min', icon: 'musical-notes' },
    { id: '5', title: 'A Minor Scale', date: '2 weeks ago', duration: '18 min', icon: 'musical-notes' },
    { id: '6', title: 'E Blues Scale', date: '3 weeks ago', duration: '25 min', icon: 'musical-notes' },
  ];

  // Sample data for categories
  const categories = [
    { id: '1', title: 'Recent', icon: 'time-outline' },
    { id: '2', title: 'Scales', icon: 'list-outline' },
    { id: '3', title: 'Chords', icon: 'grid-outline' },
    { id: '4', title: 'Favorites', icon: 'heart-outline' },
  ];

  const renderLibraryItem = ({ item }) => (
    <TouchableOpacity style={styles.libraryCard}>
      <View style={styles.libraryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <View style={styles.libraryContent}>
        <Text style={styles.libraryTitle}>{item.title}</Text>
        <Text style={styles.librarySubtitle}>{item.date} • {item.duration}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={28} color="#1db954" />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={22} color="#1db954" />
      </View>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User profile header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            // source={{ uri: 'https://randomuser.me/api/portraits/men/21.jpg' }} 
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

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

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
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    backgroundColor: '#161616',
    padding: 16,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: '#222',
  },
  categoryIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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