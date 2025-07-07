import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import config from '../../config';
import { UserContext } from '../../components/AuthGate';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AddDonation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = React.useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    quantity: '',
    location: '',
    contact: '',
    expiryDate: '',
    imageUrl: '',
    pickupInstructions: '',
    availableTime: '9:00 AM - 6:00 PM',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to pick your current location.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setFormData(f => ({
        ...f,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      }));
    })();
  }, []);

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['title', 'description', 'quantity', 'location', 'contact', 'pickupInstructions', 'address', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate coordinates
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid latitude and longitude coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      Alert.alert('Error', 'Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      Alert.alert('Error', 'Longitude must be between -180 and 180');
      return;
    }

    try {
      setLoading(true);
      
      const donationData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        location: formData.location,
        address: formData.address,
        latitude: lat,
        longitude: lng,
        contact: formData.contact,
        expiryDate: formData.expiryDate,
        imageUrl: formData.imageUrl,
        pickupInstructions: formData.pickupInstructions,
        availableTime: formData.availableTime,
        donorId: user.id
      };

      const response = await fetch(`${config.BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Donation created:', result);
        Alert.alert(
          'Success! 🎉', 
          'Donation posted successfully! Workers will be able to see and claim your donation.',
          [
            { text: 'OK', onPress: () => router.push('/donor-dashboard') }
          ]
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post donation');
      }
    } catch (error) {
      console.error('Error posting donation:', error);
      Alert.alert('Error', 'Failed to post donation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Donation</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {['food', 'clothing', 'hygiene', 'other'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.activeCategory
                  ]}
                  onPress={() => setFormData({...formData, category})}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category === category && styles.activeCategoryText
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Large Food Donation - Rice & Pulses"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you're donating in detail. Include quantity, condition, etc..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          {/* Quantity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50kg rice, 20kg pulses"
              value={formData.quantity}
              onChangeText={(text) => setFormData({...formData, quantity: text})}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Gulberg III, Lahore"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Full address for pickup"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
            />
          </View>

          {/* Map Picker for Location */}
          <Text style={{ alignSelf: 'flex-start', marginBottom: 8 }}>Tap on the map to select donation location:</Text>
          <MapView
            style={{ width: '100%', height: 500, marginBottom: 12, borderRadius: 12 }}
            region={mapRegion}
            onPress={e => {
              setFormData({
                ...formData,
                latitude: e.nativeEvent.coordinate.latitude.toString(),
                longitude: e.nativeEvent.coordinate.longitude.toString(),
              });
              setMapRegion({
                ...mapRegion,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
            showsUserLocation={true}
          >
            {formData.latitude && formData.longitude ? (
              <Marker
                coordinate={{
                  latitude: parseFloat(formData.latitude),
                  longitude: parseFloat(formData.longitude),
                }}
              />
            ) : null}
          </MapView>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <Text style={{ marginRight: 16 }}>
              Latitude: {formData.latitude}
            </Text>
            <Text>
              Longitude: {formData.longitude}
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Information *</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number or email"
              value={formData.contact}
              onChangeText={(text) => setFormData({...formData, contact: text})}
            />
          </View>

          {/* Available Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Available Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 9:00 AM - 6:00 PM"
              value={formData.availableTime}
              onChangeText={(text) => setFormData({...formData, availableTime: text})}
            />
          </View>

          {/* Pickup Instructions */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Instructions *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Please call 15 minutes before arrival. Ring the doorbell and ask for Ahmed."
              multiline
              numberOfLines={3}
              value={formData.pickupInstructions}
              onChangeText={(text) => setFormData({...formData, pickupInstructions: text})}
            />
          </View>

          {/* Expiry Date (for food items) */}
          {formData.category === 'food' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2024-12-31"
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({...formData, expiryDate: text})}
              />
            </View>
          )}

          {/* Image Upload
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Photo (Optional)</Text>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Ionicons name="camera" size={24} color="#666" />
              <Text style={styles.imageUploadText}>Upload Photo</Text>
            </TouchableOpacity>
          </View> */}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Posting...' : 'Post Donation'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    backgroundColor: '#EAF2FF',
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeCategory: {
    backgroundColor: '#28A745',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  imageUploadButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#28A745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddDonation; 