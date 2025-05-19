import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobCard from './components/JobCard';

const job_recomand = () => {
  const [activeFilter, setActiveFilter] = useState('recommended');
  
  const filters = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'parttime', label: 'Part-time' },
    { id: 'fulltime', label: 'Full-time' },
    { id: 'latest', label: 'Latest' }
  ];
  
  const jobs = [
    {
      id: 1,
      title: "Delivery Driver",
      company: "Local Eats",
      location: "Downtown, 1.5 miles away",
      salary: "$18/hour",
      postedTime: "3 hours ago",
      matchScore: 92,
      skills: ["Driving", "Flexible hours"]
    },
    {
      id: 2,
      title: "Warehouse Associate",
      company: "QuickShip Logistics",
      location: "Industrial District, 2.3 miles away",
      salary: "$17/hour",
      postedTime: "1 day ago",
      matchScore: 85,
      skills: ["Loading", "Unloading", "Inventory"]
    },
    {
      id: 3,
      title: "Restaurant Server",
      company: "The Family Table",
      location: "Uptown, 0.8 miles away",
      salary: "$15/hour + tips",
      postedTime: "2 days ago",
      matchScore: 78,
      skills: ["Customer service", "Food handling"]
    },
    {
      id: 4,
      title: "Cleaning Staff",
      company: "CleanPros",
      location: "Various locations",
      salary: "$16/hour",
      postedTime: "3 days ago",
      matchScore: 76,
      skills: ["Cleaning", "Flexible schedule"]
    }
  ];
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Work</Text>
        <Text style={styles.headerSubtitle}>Jobs matching your skills and location</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#666" />
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
      
      <View style={styles.recommendationSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          <TouchableOpacity style={styles.updateProfileButton}>
            <Text style={styles.updateProfileText}>Update Profile</Text>
            <Ionicons name="arrow-forward" size={16} color="#006FFD" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationText}>
            Based on your skills in <Text style={styles.highlightText}>driving, customer service, and flexible availability</Text>, 
            we've found jobs that match your profile.
          </Text>
        </View>
      </View>
      
      <View style={styles.jobsList}>
        {jobs.map(job => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            postedTime={job.postedTime}
            matchScore={job.matchScore}
            skills={job.skills}
          />
        ))}
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
    padding: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
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
  recommendationSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  updateProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateProfileText: {
    color: '#006FFD',
    fontSize: 14,
    marginRight: 4,
  },
  recommendationBox: {
    backgroundColor: '#E6F2FF',
    borderRadius: 12,
    padding: 16,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: '500',
  },
  jobsList: {
    padding: 20,
  },
});

export default job_recomand;