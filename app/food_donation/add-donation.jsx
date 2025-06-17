import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddDonation = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'offer', // 'offer' or 'need'
    category: 'food', // 'food', 'clothing', 'hygiene', 'other'
    location: '',
    contact: '',
    quantity: '',
    expiryDate: '',
    imageUrl: ''
  });

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Navigate back to donations page
    router.back();
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
          <Text style={styles.headerTitle}>Add New Donation</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type *</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'offer' && styles.activeType
                ]}
                onPress={() => setFormData({...formData, type: 'offer'})}
              >
                <Text style={[
                  styles.typeText,
                  formData.type === 'offer' && styles.activeTypeText
                ]}>I Want to Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'need' && styles.activeType
                ]}
                onPress={() => setFormData({...formData, type: 'need'})}
              >
                <Text style={[
                  styles.typeText,
                  formData.type === 'need' && styles.activeTypeText
                ]}>I Need Help</Text>
              </TouchableOpacity>
            </View>
          </View>

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
              placeholder="e.g., Dry Food Items"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you're offering or need..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Gulberg, Lahore"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
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

          {/* Quantity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5 kg, 10 pieces"
              value={formData.quantity}
              onChangeText={(text) => setFormData({...formData, quantity: text})}
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

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Photo</Text>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Ionicons name="camera" size={24} color="#666" />
              <Text style={styles.imageUploadText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {formData.type === 'offer' ? 'Post Donation' : 'Post Request'}
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
    borderBottomColor: '#e7e7e7',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e7e7e7',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  activeType: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
  activeTypeText: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  activeCategory: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  activeCategoryText: {
    color: '#fff',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#006FFD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddDonation; 