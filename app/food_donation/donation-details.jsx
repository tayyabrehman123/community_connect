import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import config from '../../config';

export default function DonationDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to show your position.");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();

    // Fetch donation details from backend
    fetchDonationDetails();
  }, [params.id]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);
      const donationId = params.id;
      
      if (!donationId) {
        Alert.alert('Error', 'No donation ID provided');
        setLoading(false);
        return;
      }

      const response = await fetch(`${config.BACKEND_URL}/api/donations/${donationId}`);
      
      if (response.ok) {
        const data = await response.json();
        setDonation(data);
      } else {
        throw new Error('Failed to fetch donation details');
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      Alert.alert('Error', 'Failed to load donation details');
      
      // Fallback to mock data for demo
      const mockDonations = {
        '1': {
          _id: '1',
          title: 'Large Food Donation - Rice & Pulses',
          description: 'Fresh rice and pulses available for collection. Good quality food items that can help many families.',
          category: 'food',
          quantity: '50kg rice, 20kg pulses',
          location: 'Gulberg III, Lahore',
          contact: '+92 300 1234567',
          donorName: 'Ahmed Khan',
          createdAt: '2024-01-15',
          latitude: 31.5204,
          longitude: 74.3587,
          address: 'House #123, Street 5, Gulberg III, Lahore',
          pickupInstructions: 'Please call 15 minutes before arrival. Ring the doorbell and ask for Ahmed.',
          availableTime: '9:00 AM - 6:00 PM'
        }
      };
      
      const donationId = params.id || '1';
      setDonation(mockDonations[donationId] || mockDonations['1']);
    } finally {
      setLoading(false);
    }
  };

  const handleCallDonor = () => {
    if (donation?.contact) {
      Alert.alert(
        'Call Donor',
        `Call ${donation.donorName} at ${donation.contact}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => console.log('Calling donor...') }
        ]
      );
    }
  };

  const handleNavigate = () => {
    Alert.alert(
      'Navigation',
      'Opening navigation app to donation location...',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006FFD" />
        <Text style={styles.loadingText}>Loading donation details...</Text>
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Donation not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Donation Details</Text>
          <Text style={styles.headerSubtitle}>Pickup location & instructions</Text>
        </View>
        <View style={styles.profileButton}>
          <Ionicons name="gift" size={24} color="#B3DAFF" />
        </View>
      </View>

      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: donation.latitude,
            longitude: donation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: donation.latitude,
              longitude: donation.longitude,
            }}
            title={donation.title}
            description={donation.address}
          />
        </MapView>
      </View>

      <ScrollView style={styles.detailsContainer}>
        <View style={styles.donationInfo}>
          <View style={styles.categoryBadge}>
            <Ionicons 
              name={donation.category === 'food' ? 'restaurant' : donation.category === 'clothing' ? 'shirt' : 'gift'} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.categoryText}>
              {donation.category.charAt(0).toUpperCase() + donation.category.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.donationTitle}>{donation.title}</Text>
          <Text style={styles.donationDescription}>{donation.description}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="scale" size={20} color="#666" />
            <Text style={styles.infoText}>{donation.quantity}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.infoText}>{donation.donorName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.infoText}>Available: {donation.availableTime}</Text>
          </View>
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={20} color="#006FFD" />
            <Text style={styles.addressText}>{donation.address}</Text>
          </View>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Pickup Instructions</Text>
          <Text style={styles.instructionsText}>{donation.pickupInstructions}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCallDonor}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call Donor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.buttonText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    margin: 20,
  },
  map: {
    flex: 1,
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: '#EAF2FF',
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileButton: {
    backgroundColor: '#EAF2FF',
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  donationInfo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  donationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  donationDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  locationSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  instructionsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: '#006FFD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 