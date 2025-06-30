import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const JobCard = ({ 
  id,
  title, 
  company, 
  location, 
  salary, 
  postedTime,
  jobType,
  description,
  requirements = [],
  onApply,
  canEdit = false,
  onEdit
}) => {
  const router = useRouter();

  const handleGetDetails = () => {
    if (onApply) {
      onApply();
    } else {
      // Navigate to job details screen
      router.push(`/job_recomand/job-details?jobId=${id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.jobTypeBadge}>
            <Text style={styles.jobTypeText}>
              {jobType ? jobType.charAt(0).toUpperCase() + jobType.slice(1).replace('-', ' ') : 'Full-time'}
            </Text>
          </View>
        </View>
        {canEdit && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#006FFD" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.company}>{company}</Text>
      
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={14} color="#666" />
        <Text style={styles.location}>{location}</Text>
      </View>
      
      {requirements && requirements.length > 0 && (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Required Skills:</Text>
          <View style={styles.skillsList}>
            {requirements.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {requirements.length > 3 && (
              <Text style={styles.moreSkills}>+{requirements.length - 3} more</Text>
            )}
          </View>
        </View>
      )}
      
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.salaryContainer}>
          <Ionicons name="cash-outline" size={16} color="#FF6B00" />
          <Text style={styles.salary}>{salary}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={12} color="#666" />
          <Text style={styles.timeText}>{postedTime}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.applyButton} onPress={handleGetDetails}>
        <Text style={styles.applyButtonText}>Get Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  jobTypeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  company: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#006FFD',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salary: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#006FFD',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006FFD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default JobCard; 