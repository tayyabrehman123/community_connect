import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import config from '../../config';

const JobDetails = () => {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.BACKEND_URL}/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job details');
      const data = await response.json();
      setJob(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load job details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('No Contact', 'Phone number not available for this job posting.');
      return;
    }

    Alert.alert(
      'Call Employer',
      `Would you like to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B35" />
        <Text style={styles.errorText}>Job not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.jobTypeBadge}>
            <Text style={styles.jobTypeText}>
              {job.jobType ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ') : 'Full-time'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>{job.company}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.location}>{job.location}</Text>
        </View>
        
        <View style={styles.salaryContainer}>
          <Ionicons name="cash-outline" size={16} color="#FF6B35" />
          <Text style={styles.salary}>PKR {job.salaryMin} - {job.salaryMax}</Text>
        </View>
        
        <View style={styles.postedContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.postedText}>
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      {job.requirements && job.requirements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            {job.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {job.workSchedule && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Schedule</Text>
          <Text style={styles.scheduleText}>{job.workSchedule}</Text>
        </View>
      )}

      {job.benefits && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <Text style={styles.benefitsText}>{job.benefits}</Text>
        </View>
      )}

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Employer Contact</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <Ionicons name="business-outline" size={20} color="#006FFD" />
            <Text style={styles.contactLabel}>Company</Text>
            <Text style={styles.contactValue}>{job.company}</Text>
          </View>
          
          {job.contactEmail && (
            <View style={styles.contactInfo}>
              <Ionicons name="mail-outline" size={20} color="#006FFD" />
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{job.contactEmail}</Text>
            </View>
          )}
          
          {job.contactPhone && (
            <View style={styles.contactInfo}>
              <Ionicons name="call-outline" size={20} color="#006FFD" />
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{job.contactPhone}</Text>
            </View>
          )}
        </View>
        
        {job.contactPhone && (
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall(job.contactPhone)}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
  },
  jobCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  jobTypeBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  jobTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salary: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  postedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postedText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
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
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  benefitsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactCard: {
    gap: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
  },
  contactValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 16,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default JobDetails; 