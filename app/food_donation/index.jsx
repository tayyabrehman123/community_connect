import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DonationCard from '../../components/DonationCard';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodDonation = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const categoryFilters = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'hygiene', label: 'Hygiene' },
    { id: 'other', label: 'Other' }
  ];

  // Mock data for donations
  const mockDonations = [
    {
      _id: '1',
      title: 'Large Food Donation - Rice & Pulses',
      description: 'Fresh rice and pulses available for collection. Good quality food items that can help many families.',
      category: 'food',
      quantity: '50kg rice, 20kg pulses',
      location: 'Gulberg III, Lahore',
      contact: '+92 300 1234567',
      donorName: 'Ahmed Khan',
      createdAt: '2024-01-15',
      imageUrl: null
    },
    {
      _id: '2',
      title: 'Winter Clothing Collection',
      description: 'Warm winter clothes including jackets, sweaters, and blankets. All items are in good condition.',
      category: 'clothing',
      quantity: '25 jackets, 30 sweaters, 15 blankets',
      location: 'Defence Housing Authority, Karachi',
      contact: '+92 301 9876543',
      donorName: 'Fatima Ali',
      createdAt: '2024-01-14',
      imageUrl: null
    },
    {
      _id: '3',
      title: 'Hygiene Products Package',
      description: 'Essential hygiene products including soaps, shampoos, toothbrushes, and sanitary items.',
      category: 'hygiene',
      quantity: '100 soaps, 50 shampoos, 75 toothbrushes',
      location: 'F-7, Islamabad',
      contact: '+92 302 4567890',
      donorName: 'Sara Ahmed',
      createdAt: '2024-01-13',
      imageUrl: null
    },
    {
      _id: '4',
      title: 'Fresh Vegetables & Fruits',
      description: 'Fresh vegetables and fruits from local market. Includes potatoes, onions, tomatoes, and seasonal fruits.',
      category: 'food',
      quantity: '30kg vegetables, 20kg fruits',
      location: 'Model Town, Lahore',
      contact: '+92 303 1122334',
      donorName: 'Muhammad Hassan',
      createdAt: '2024-01-12',
      imageUrl: null
    },
    {
      _id: '5',
      title: 'Educational Supplies',
      description: 'School supplies including notebooks, pens, pencils, and backpacks for children in need.',
      category: 'other',
      quantity: '100 notebooks, 200 pens, 50 backpacks',
      location: 'Clifton, Karachi',
      contact: '+92 304 5566778',
      donorName: 'Ayesha Khan',
      createdAt: '2024-01-11',
      imageUrl: null
    }
  ];

  useEffect(() => {
    getUserRole();
    fetchDonations();
  }, []);

  const getUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } else {
        // Set default role for demo
        setUserRole('worker');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      setUserRole('worker');
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.104:5000/api/donations');
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        throw new Error('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      // Fallback to mock data for demo
      setDonations([
        {
          _id: '1',
          title: 'Large Food Donation - Rice & Pulses',
          description: 'Fresh rice and pulses available for collection. Good quality food items that can help many families.',
          category: 'food',
          quantity: '50kg rice, 20kg pulses',
          location: 'Gulberg III, Lahore',
          contact: '+92 300 1234567',
          donorName: 'Ahmed Khan',
          createdAt: '2024-01-15',
          imageUrl: null
        },
        {
          _id: '2',
          title: 'Winter Clothing Collection',
          description: 'Warm winter clothes including jackets, sweaters, and blankets. All items are in good condition.',
          category: 'clothing',
          quantity: '25 jackets, 30 sweaters, 15 blankets',
          location: 'Defence Housing Authority, Karachi',
          contact: '+92 301 9876543',
          donorName: 'Fatima Ali',
          createdAt: '2024-01-14',
          imageUrl: null
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  const handleClaimDonation = async (donationId) => {
    try {
      // Navigate to donation details screen
      router.push(`/food_donation/donation-details?id=${donationId}`);
    } catch (error) {
      console.error('Error claiming donation:', error);
      Alert.alert('Error', 'Failed to claim donation');
    }
  };
  
  const filteredDonations = donations.filter(donation => {
    const categoryMatch = activeCategory === 'all' || donation.category === activeCategory;
    const searchMatch = donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       donation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       donation.location.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });
  
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Food Donations</Text>
          <Text style={styles.headerSubtitle}>Available donations for collection</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.myDonationsButton}
            onPress={() => {
              if (userRole === 'donor') {
                router.push('/donor-dashboard');
              } else {
                router.push('/food_donation/my-donations');
              }
            }}
          >
            <Ionicons name="heart-outline" size={20} color="#006FFD" />
            <Text style={styles.myDonationsText}>
              {userRole === 'donor' ? 'Dashboard' : 'My Donations'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/food_donation/add-donation')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search donations by title, location..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Filter by Category</Text>
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading donations...</Text>
        </View>
      ) : filteredDonations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="gift-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No donations found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      ) : (
      <View style={styles.donationsList}>
        {filteredDonations.map(donation => (
          <DonationCard
              key={donation._id}
              id={donation._id}
            title={donation.title}
            description={donation.description}
              category={donation.category}
            location={donation.location}
            contact={donation.contact}
              quantity={donation.quantity}
              expiryDate={donation.expiryDate}
            imageUrl={donation.imageUrl}
              donorName={donation.donorName}
              date={donation.createdAt}
              onClaim={() => handleClaimDonation(donation._id)}
              userRole={userRole}
          />
        ))}
      </View>
      )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myDonationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  myDonationsText: {
    fontSize: 14,
    color: '#006FFD',
    marginLeft: 4,
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
    marginVertical: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterTag: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default FoodDonation; 