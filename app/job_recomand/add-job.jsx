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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../components/AuthGate';
import config from '../../config';

const AddJob = () => {
  const router = useRouter();
  const { user, loading } = React.useContext(UserContext);
  const [loadingLocal, setLoading] = useState(false);
  // Debug: log user and loading from context
  console.log('User in AddJob:', user, 'Loading:', loading);
  // Debug: log user from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('user').then(data => {
      console.log('User in AsyncStorage:', data);
    });
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    requirements: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    workSchedule: '',
    benefits: ''
  });
  const [profession, setProfession] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);

  const professions = [
    'Construction Worker',
    'Plumber',
    'Driver',
    'Electrician',
    'House Keeper',
    'Painter',
    'Carpenter',
    'Cleaner',
    'Mechanic',
    'Welder'
  ];

  const validateForm = () => {
    const required = ['title', 'company', 'location', 'salaryMin', 'salaryMax', 'description', 'contactEmail'];
    for (const field of required) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!profession) {
      Alert.alert('Error', 'Please select a profession required for this job');
      return false;
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      Alert.alert('Error', 'Minimum salary cannot be greater than maximum salary');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User not loaded. Please log in again.');
      return;
    }
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      console.log('Posting job as user:', user);
      const response = await fetch(`${config.BACKEND_URL}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          profession,
          salaryMin: parseInt(formData.salaryMin),
          salaryMax: parseInt(formData.salaryMax),
          requirements: formData.requirements.split(',').map(skill => skill.trim()).filter(skill => skill),
          postedBy: user.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post job');
      }
      
      Alert.alert('Success', 'Job posted successfully!', [
        { text: 'OK', onPress: () => router.push('/employer-dashboard') }
      ]);
    } catch (error) {
      console.error('Job posting error:', error);
      Alert.alert('Error', 'Failed to post job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a New Job</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Job Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Delivery Rider"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>

          {/* Company Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company / Employer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., FoodPanda Pakistan"
              value={formData.company}
              onChangeText={(text) => setFormData({...formData, company: text})}
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

          {/* Salary Range */}
          <View style={styles.salaryContainer}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Minimum pay (PKR)*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25000"
                keyboardType="numeric"
                value={formData.salaryMin}
                onChangeText={(text) => setFormData({...formData, salaryMin: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Maximum pay (PKR)*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 35000"
                keyboardType="numeric"
                value={formData.salaryMax}
                onChangeText={(text) => setFormData({...formData, salaryMax: text})}
              />
            </View>
          </View>

          {/* Job Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Type *</Text>
            <View style={styles.jobTypeContainer}>
              {['full-time', 'part-time', 'contract', 'internship'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.jobTypeButton,
                    formData.jobType === type && styles.activeJobType
                  ]}
                  onPress={() => setFormData({...formData, jobType: type})}
                >
                  <Text style={[
                    styles.jobTypeText,
                    formData.jobType === type && styles.activeJobTypeText
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Required Skills */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Skills *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter skills separated by commas (e.g., Driving License, Customer Service)"
              multiline
              numberOfLines={3}
              value={formData.requirements}
              onChangeText={(text) => setFormData({...formData, requirements: text})}
            />
          </View>

          {/* Job Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
              multiline
              numberOfLines={6}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          {/* Profession Required */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profession Required *</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowProfessionDropdown(true)}
            >
              <Text style={{ color: profession ? '#333' : '#999' }}>
                {profession || 'Select Profession'}
              </Text>
            </TouchableOpacity>
            {showProfessionDropdown && (
              <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 4 }}>
                {professions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={{ padding: 12 }}
                    onPress={() => {
                      setProfession(item);
                      setShowProfessionDropdown(false);
                    }}
                  >
                    <Text style={{ color: '#333' }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Contact Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., hr@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({...formData, contactEmail: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +92 300 1234567"
              keyboardType="phone-pad"
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({...formData, contactPhone: text})}
            />
          </View>

          {/* Work Schedule */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work Schedule</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Monday to Friday, 9 AM to 5 PM"
              value={formData.workSchedule}
              onChangeText={(text) => setFormData({...formData, workSchedule: text})}
            />
          </View>

          {/* Benefits */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Benefits & Perks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Health insurance, flexible hours, performance bonuses"
              multiline
              numberOfLines={3}
              value={formData.benefits}
              onChangeText={(text) => setFormData({...formData, benefits: text})}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loadingLocal && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loadingLocal}
          >
            <Text style={styles.submitButtonText}>
              {loadingLocal ? 'Posting Job...' : 'Post Job'}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  salaryContainer: {
    flexDirection: 'row',
  },
  jobTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTypeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  activeJobType: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  jobTypeText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeJobTypeText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#006FFD',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddJob; 