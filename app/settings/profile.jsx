import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileSettings = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    cnic: '',
    role: 'worker',
    photo: '',
  });
  const [loading, setLoading] = useState(true);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.104:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        cnic: data.cnic || '',
        role: data.role || 'worker',
        phone: data.phone || '',
        address: data.address || '',
        emergencyContact: data.emergencyContact || '',
        dietaryRestrictions: data.dietaryRestrictions || '',
        accessibilityNeeds: data.accessibilityNeeds || '',
        photo: data.photo || '',
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const res = await fetch('http://192.168.0.104:5000/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      Alert.alert('Success', 'Profile updated!');
      router.back();
    } else {
      const err = await res.json();
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUploading(true);
      // For now, store base64 string in photo field (backend should handle this)
      setProfile({ ...profile, photo: `data:image/jpeg;base64,${result.assets[0].base64}` });
      setPhotoUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <Camera size={24} color="#006FFD" />
            )}
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickPhoto} disabled={photoUploading}>
            <Text style={styles.changePhotoText}>{photoUploading ? 'Uploading...' : 'Change Photo'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={profile.address}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
              placeholder="Enter your address"
              multiline
            />
          </View> */}

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={styles.input}
              value={profile.emergencyContact}
              onChangeText={(text) => setProfile({ ...profile, emergencyContact: text })}
              placeholder="Enter emergency contact details"
            />
          </View> */}

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Dietary Restrictions</Text>
            <TextInput
              style={styles.input}
              value={profile.dietaryRestrictions}
              onChangeText={(text) => setProfile({ ...profile, dietaryRestrictions: text })}
              placeholder="Enter any dietary restrictions"
              multiline
            />
          </View> */}

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Accessibility Needs</Text>
            <TextInput
              style={styles.input}
              value={profile.accessibilityNeeds}
              onChangeText={(text) => setProfile({ ...profile, accessibilityNeeds: text })}
              placeholder="Enter any accessibility needs"
              multiline
            />
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC</Text>
            <TextInput
              style={styles.input}
              value={profile.cnic}
              onChangeText={(text) => setProfile({ ...profile, cnic: text })}
              placeholder="Enter your CNIC"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <TextInput
              style={styles.input}
              value={profile.role}
              onChangeText={(text) => setProfile({ ...profile, role: text })}
              placeholder="Enter your role (worker, donor, employer)"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#006FFD',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#006FFD',
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#006FFD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSettings; 