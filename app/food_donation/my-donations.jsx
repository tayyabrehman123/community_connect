import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { UserContext } from '../../components/AuthGate';

const MyDonations = () => {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.104:5000/api/donations/my-donations');
      
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
          title: 'Fresh Food Donation',
          category: 'food',
          quantity: '25kg rice, 10kg pulses',
          location: 'Gulberg III, Lahore',
          status: 'available',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Winter Clothing',
          category: 'clothing',
          quantity: '15 jackets, 20 sweaters',
          location: 'Defence, Karachi',
          status: 'claimed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyDonations();
  };

  const handleDeleteDonation = (donationId, title) => {
    Alert.alert(
      'Delete Donation',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteDonation(donationId)
        }
      ]
    );
  };

  const deleteDonation = async (donationId) => {
    try {
      const response = await fetch(`http://192.168.0.104:5000/api/donations/${donationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDonations(prev => prev.filter(donation => donation._id !== donationId));
        Alert.alert('Success', 'Donation deleted successfully!');
      } else {
        throw new Error('Failed to delete donation');
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      Alert.alert('Error', 'Failed to delete donation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'claimed': return '#F59E0B';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'claimed': return 'Claimed';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const DonationCard = ({ donation }) => (
    <View style={styles.donationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.donationTitle}>{donation.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
            <Text style={styles.statusText}>{getStatusText(donation.status)}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteDonation(donation._id, donation.title)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{donation.category.charAt(0).toUpperCase() + donation.category.slice(1)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="scale-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{donation.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{donation.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            Posted {new Date(donation.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setSettingsVisible(false);
    router.replace('/login', { reset: true });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/donor-dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Donations</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/food_donation/add-donation')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{ marginLeft: 12, backgroundColor: '#eee', borderRadius: 20, padding: 6 }}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="person-circle-outline" size={28} color="#006FFD" />
          </TouchableOpacity> */}
        </View>
      </View>
      {/* Settings Modal */}
      {/* {settingsVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setSettingsVisible(false); router.push('/settings/profile'); }}>
              <Ionicons name="settings-outline" size={20} color="#006FFD" style={{ marginRight: 8 }} />
              <Text style={styles.modalButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.modalButtonText, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setSettingsVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{donations.filter(d => d.status === 'available').length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{donations.filter(d => d.status === 'claimed').length}</Text>
          <Text style={styles.statLabel}>Claimed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{donations.filter(d => d.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Donations List */}
      <ScrollView 
        style={styles.donationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your donations...</Text>
          </View>
        ) : donations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No donations yet</Text>
            <Text style={styles.emptySubtitle}>Start helping others by posting your first donation</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/food_donation/add-donation')}
            >
              <Text style={styles.emptyButtonText}>Post Donation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          donations.map(donation => (
            <DonationCard key={donation._id} donation={donation} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EAF2FF',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#006FFD',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006FFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  donationsList: {
    flex: 1,
    padding: 20,
  },
  donationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  cardContent: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#006FFD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 260,
    alignItems: 'flex-start',
    elevation: 8,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#006FFD',
    fontWeight: '600',
  },
});

export default MyDonations; 