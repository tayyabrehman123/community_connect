import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../../components/JobCard';
import { useRouter } from 'expo-router';
import { UserContext } from '../../components/AuthGate';
import config from '../../config';

const JobRecomand = () => {
  const router = useRouter();
  const { user } = useContext(UserContext); // Get user from context
  const [activeFilter, setActiveFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState(user?.role || 'worker');
  const [userProfession, setUserProfession] = useState(user?.profession || '');
  
  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    // { id: 'internship', label: 'Internship' }
  ];

  // Test function to switch roles
  const toggleUserRole = () => {
    setUserRole(userRole === 'worker' ? 'employer' : 'worker');
  };

  useEffect(() => {
    // Update role and profession from user context
    if (user) {
      setUserRole(user.role);
      setUserProfession(user.profession || '');
    }
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let url = `${config.BACKEND_URL}/api/jobs`;
      if (userRole === 'worker' && userProfession) {
        url += `?profession=${encodeURIComponent(userProfession)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleGetDetails = (jobId) => {
    router.push(`/job_recomand/job-details?jobId=${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = activeFilter === 'all' || job.jobType === activeFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const canPostJob = userRole === 'employer' || userRole === 'admin';

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Find Jobs</Text>
          <Text style={styles.headerSubtitle}>
            {userRole === 'worker' ? 'Jobs matching your skills' : 'Manage your job postings'}
          </Text>
          {/* <TouchableOpacity 
            style={styles.roleToggleButton}
            onPress={toggleUserRole}
          >
            <Text style={styles.roleToggleText}>
              Switch to {userRole === 'worker' ? 'Employer' : 'Worker'} View
            </Text>
          </TouchableOpacity> */}
        </View>
        {canPostJob && (
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.myJobsButton}
              onPress={() => router.push('/job_recomand/my-jobs')}
            >
              <Ionicons name="briefcase-outline" size={20} color="#006FFD" />
              <Text style={styles.myJobsText}>My Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/job_recomand/add-job')}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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

      {userRole === 'worker' && (
        <View style={styles.recommendationSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skill based job Recommendations</Text>
            <TouchableOpacity style={styles.updateProfileButton}>
              {/* <Text style={styles.updateProfileText}>Update Profile</Text> */}
              {/* <Ionicons name="arrow-forward" size={16} color="#006FFD" /> */}
            </TouchableOpacity>
          </View>
          
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              Based on your skills in <Text style={styles.highlightText}>driving, electrician or any other service, and flexible availability</Text>, 
              we've found jobs that match your profile.
            </Text>
          </View>
        </View>
      )}

      {canPostJob && (
        <View style={styles.employerSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Employer Dashboard</Text>
          </View>
          
          <View style={styles.employerActions}>
            <TouchableOpacity 
              style={styles.manageJobsButton}
              onPress={() => router.push('/job_recomand/my-jobs')}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="briefcase" size={24} color="#fff" />
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.manageJobsTitle}>Manage My Jobs</Text>
                  <Text style={styles.manageJobsSubtitle}>View, edit, and delete your job postings</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.postNewJobButton}
              onPress={() => router.push('/job_recomand/add-job')}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="add-circle" size={24} color="#fff" />
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.postJobTitle}>Post New Job</Text>
                  <Text style={styles.postJobSubtitle}>Create a new job posting</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.jobsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No jobs found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or search terms</Text>
          </View>
        ) : (
          filteredJobs.map(job => (
            <JobCard
              key={job._id}
              id={job._id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={`PKR ${job.salaryMin} - ${job.salaryMax}`}
              postedTime={new Date(job.createdAt).toLocaleDateString()}
              jobType={job.jobType}
              description={job.description}
              requirements={job.requirements}
              onApply={() => handleGetDetails(job._id)}
              canEdit={userRole === 'employer' || userRole === 'admin'}
              onEdit={() => router.push(`/job_recomand/edit-job/${job._id}`)}
            />
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myJobsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  myJobsText: {
    color: '#006FFD',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#006FFD',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterTag: {
    backgroundColor: '#006FFD',
    borderColor: '#006FFD',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  recommendationSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  updateProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateProfileText: {
    color: '#006FFD',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  recommendationBox: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  highlightText: {
    color: '#006FFD',
    fontWeight: '600',
  },
  jobsList: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  employerSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employerActions: {
    gap: 12,
  },
  manageJobsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006FFD',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#006FFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  manageJobsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  manageJobsSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 2,
  },
  postNewJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  postJobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  postJobSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 2,
  },
  roleToggleButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default JobRecomand; 