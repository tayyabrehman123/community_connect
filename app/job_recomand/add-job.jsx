import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddJob = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    requiredSkills: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    deadline: '',
    workSchedule: '',
    benefits: ''
  });

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Navigate back to jobs page
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
          <Text style={styles.headerTitle}>Post a New Job</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Job Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Delivery Rider"
              value={formData.jobTitle}
              onChangeText={(text) => setFormData({...formData, jobTitle: text})}
            />
          </View>

          {/* Company Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., FoodPanda Pakistan"
              value={formData.companyName}
              onChangeText={(text) => setFormData({...formData, companyName: text})}
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
              <Text style={styles.label}>Minimum Salary *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25000"
                keyboardType="numeric"
                value={formData.salaryMin}
                onChangeText={(text) => setFormData({...formData, salaryMin: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Maximum Salary *</Text>
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
              <TouchableOpacity
                style={[
                  styles.jobTypeButton,
                  formData.jobType === 'full-time' && styles.activeJobType
                ]}
                onPress={() => setFormData({...formData, jobType: 'full-time'})}
              >
                <Text style={[
                  styles.jobTypeText,
                  formData.jobType === 'full-time' && styles.activeJobTypeText
                ]}>Full-time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.jobTypeButton,
                  formData.jobType === 'part-time' && styles.activeJobType
                ]}
                onPress={() => setFormData({...formData, jobType: 'part-time'})}
              >
                <Text style={[
                  styles.jobTypeText,
                  formData.jobType === 'part-time' && styles.activeJobTypeText
                ]}>Part-time</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Required Skills */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Skills *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter skills separated by commas"
              multiline
              value={formData.requiredSkills}
              onChangeText={(text) => setFormData({...formData, requiredSkills: text})}
            />
          </View>

          {/* Job Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the job responsibilities and requirements..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          {/* Contact Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., hr@company.com"
              keyboardType="email-address"
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({...formData, contactEmail: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone *</Text>
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
            <Text style={styles.label}>Benefits</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List the benefits offered..."
              multiline
              value={formData.benefits}
              onChangeText={(text) => setFormData({...formData, benefits: text})}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Post Job</Text>
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
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  jobTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  activeJobType: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  jobTypeText: {
    fontSize: 16,
    color: '#333',
  },
  activeJobTypeText: {
    color: '#fff',
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

export default AddJob; 