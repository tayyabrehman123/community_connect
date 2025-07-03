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
import { useRouter, useLocalSearchParams } from 'expo-router';
import config from '../../../config';

const EditJob = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${config.BACKEND_URL}/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      
      const job = await response.json();
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        jobType: job.jobType || 'full-time',
        requirements: job.requirements?.join(', ') || '',
        description: job.description || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || '',
        workSchedule: job.workSchedule || '',
        benefits: job.benefits || ''
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load job: ' + error.message);
      router.back();
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const required = ['title', 'company', 'location', 'salaryMin', 'salaryMax', 'description', 'contactEmail'];
    for (const field of required) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      Alert.alert('Error', 'Minimum salary cannot be greater than maximum salary');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          salaryMin: parseInt(formData.salaryMin),
          salaryMax: parseInt(formData.salaryMax),
          requirements: formData.requirements.split(',').map(skill => skill.trim()).filter(skill => skill)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }
      
      Alert.alert('Success', 'Job updated successfully!', [
        { text: 'OK', onPress: () => router.push('/employer-dashboard') }
      ]);
    } catch (error) {
      console.error('Job update error:', error);
      Alert.alert('Error', 'Failed to update job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading job...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Job</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
              placeholder="e.g., Warehouse Associate"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.company}
              onChangeText={(text) => setFormData({...formData, company: text})}
              placeholder="e.g., Community Food Bank"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              placeholder="e.g., New York, NY"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Min Salary (PKR) *</Text>
              <TextInput
                style={styles.input}
                value={formData.salaryMin}
                onChangeText={(text) => setFormData({...formData, salaryMin: text})}
                placeholder="25000"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Max Salary (PKR) *</Text>
              <TextInput
                style={styles.input}
                value={formData.salaryMax}
                onChangeText={(text) => setFormData({...formData, salaryMax: text})}
                placeholder="35000"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Type</Text>
            <View style={styles.jobTypeContainer}>
              {['full-time', 'part-time', 'contract', 'internship'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.jobTypeButton,
                    formData.jobType === type && styles.activeJobTypeButton
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Skills</Text>
            <TextInput
              style={styles.textArea}
              value={formData.requirements}
              onChangeText={(text) => setFormData({...formData, requirements: text})}
              placeholder="e.g., driving license, customer service, flexible schedule"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Description *</Text>
            <TextInput
              style={styles.textArea}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Describe the job responsibilities and requirements..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({...formData, contactEmail: text})}
              placeholder="hr@company.com"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({...formData, contactPhone: text})}
              placeholder="+92 300 1234567"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work Schedule</Text>
            <TextInput
              style={styles.input}
              value={formData.workSchedule}
              onChangeText={(text) => setFormData({...formData, workSchedule: text})}
              placeholder="e.g., Monday-Friday, 9 AM-5 PM"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Benefits</Text>
            <TextInput
              style={styles.textArea}
              value={formData.benefits}
              onChangeText={(text) => setFormData({...formData, benefits: text})}
              placeholder="e.g., Health insurance, paid time off, flexible hours"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  form: {
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
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  activeJobTypeButton: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  jobTypeText: {
    fontSize: 14,
    color: '#666',
  },
  activeJobTypeText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#006FFD',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditJob; 