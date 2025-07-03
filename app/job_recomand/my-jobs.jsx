import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserContext } from '../../components/AuthGate';
import config from '../../config';

const MyJobs = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' },
    { id: 'draft', label: 'Draft' }
  ];

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.BACKEND_URL}/api/jobs/my-jobs?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your jobs: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyJobs();
  };

  const handleDeleteJob = (jobId, jobTitle) => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteJob(jobId)
        }
      ]
    );
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete job');
      
      Alert.alert('Success', 'Job deleted successfully!');
      fetchMyJobs(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to delete job: ' + error.message);
    }
  };

  const handleEditJob = (jobId) => {
    router.push(`/job_recomand/edit-job/${jobId}`);
  };

  const getJobStatus = (job) => {
    // You can implement status logic based on your requirements
    // For now, we'll use a simple active/expired logic
    const postedDate = new Date(job.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return postedDate > thirtyDaysAgo ? 'active' : 'expired';
  };

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'all') return true;
    return getJobStatus(job) === activeFilter;
  });

  const JobCard = ({ job }) => {
    const status = getJobStatus(job);
    
    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[
              styles.statusBadge,
              status === 'active' ? styles.activeBadge : styles.expiredBadge
            ]}>
              <Text style={[
                styles.statusText,
                status === 'active' ? styles.activeStatusText : styles.expiredStatusText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handleEditJob(job._id)}
            >
              <Ionicons name="create-outline" size={20} color="#006FFD" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteJob(job._id, job.title)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.companyName}>{job.company}</Text>
        
        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.detailText}>{job.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color="#666" />
            <Text style={styles.detailText}>PKR {job.salaryMin} - {job.salaryMax}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.detailText}>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        {job.description && (
          <Text style={styles.description} numberOfLines={2}>
            {job.description}
          </Text>
        )}
        
        <View style={styles.jobStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Saves</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/employer-dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Job Postings</Text>
          <Text style={styles.headerSubtitle}>Manage your posted jobs</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/job_recomand/add-job')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTag,
              activeFilter === filter.id && styles.activeFilterTag
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.jobsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your jobs...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No jobs found</Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === 'all' 
                ? 'You haven\'t posted any jobs yet. Start by creating your first job posting!'
                : `No ${activeFilter} jobs found`
              }
            </Text>
            {activeFilter === 'all' && (
              <TouchableOpacity 
                style={styles.createFirstJobButton}
                onPress={() => router.push('/job_recomand/add-job')}
              >
                <Text style={styles.createFirstJobText}>Create Your First Job</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#006FFD',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006FFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  activeFilterTag: {
    backgroundColor: '#006FFD',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  jobsList: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  createFirstJobButton: {
    backgroundColor: '#006FFD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  createFirstJobText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  expiredBadge: {
    backgroundColor: '#FFE8E8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#2E7D32',
  },
  expiredStatusText: {
    color: '#D32F2F',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 12,
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default MyJobs; 