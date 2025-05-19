import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DonationCard from './_components/DonationCard';

const FoodDonation = () => {
  const [activeType, setActiveType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const typeFilters = [
    { id: 'all', label: 'All' },
    { id: 'need', label: 'Needed' },
    { id: 'offer', label: 'Offered' }
  ];
  
  const categoryFilters = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'hygiene', label: 'Hygiene' },
    { id: 'other', label: 'Other' }
  ];
  
  const donations = [
    {
      id: 1,
      title: "Canned Food Items",
      description: "Various canned vegetables, soups, and beans. All unexpired.",
      type: "offer",
      location: "Downtown",
      contact: "555-123-4567",
      date: "Today",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
      id: 2,
      title: "Winter Jackets Needed",
      description: "In need of winter jackets for adults. Any size welcome.",
      type: "need",
      location: "Southside",
      contact: "help@shelter.org",
      date: "2 days ago",
      imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
      id: 3,
      title: "Personal Hygiene Kits",
      description: "Offering 10 hygiene kits with toothbrush, toothpaste, soap, etc.",
      type: "offer",
      location: "Westside",
      contact: "555-987-6543",
      date: "1 week ago"
    },
    {
      id: 4,
      title: "Baby Formula Needed",
      description: "Urgently need baby formula for 6-month old infant.",
      type: "need",
      location: "Eastside",
      contact: "555-789-0123",
      date: "3 days ago"
    }
  ];
  
  const filteredDonations = donations.filter(donation => {
    const typeMatch = activeType === 'all' || donation.type === activeType;
    return typeMatch;
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Donate & Request</Text>
          <Text style={styles.headerSubtitle}>Share resources with the community</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Type</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {typeFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTag,
                activeType === filter.id && styles.activeFilterTag
              ]}
              onPress={() => setActiveType(filter.id)}
            >
              <Text style={[
                styles.filterText,
                activeType === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {categoryFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTag,
                activeCategory === filter.id && styles.activeFilterTag
              ]}
              onPress={() => setActiveCategory(filter.id)}
            >
              <Text style={[
                styles.filterText,
                activeCategory === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.donationsList}>
        {filteredDonations.map(donation => (
          <DonationCard
            key={donation.id}
            title={donation.title}
            description={donation.description}
            type={donation.type}
            location={donation.location}
            contact={donation.contact}
            date={donation.date}
            imageUrl={donation.imageUrl}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#006FFD',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filtersSection: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeFilterTag: {
    backgroundColor: '#006FFD',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  donationsList: {
    padding: 20,
  },
});

export default FoodDonation; 