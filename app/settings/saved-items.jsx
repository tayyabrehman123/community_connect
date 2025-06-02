import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Briefcase, Trash2, ChevronRight } from 'lucide-react-native';

const SavedItemsSettings = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'locations'

  // Mock data - replace with actual data from your backend
  const savedJobs = [
    {
      id: '1',
      title: 'Warehouse Associate',
      company: 'Food Bank Distribution Center',
      location: 'New York, NY',
      date: '2024-03-15',
    },
    {
      id: '2',
      title: 'Community Outreach Coordinator',
      company: 'Homeless Shelter Network',
      location: 'Brooklyn, NY',
      date: '2024-03-10',
    },
  ];

  const savedLocations = [
    {
      id: '1',
      name: 'Community Food Bank',
      type: 'Food Bank',
      address: '123 Main St, New York, NY',
      distance: '2.5 miles',
    },
    {
      id: '2',
      name: 'Hope Shelter',
      type: 'Shelter',
      address: '456 Oak Ave, Brooklyn, NY',
      distance: '3.1 miles',
    },
  ];

  const renderJobItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <Briefcase size={20} color="#006FFD" style={styles.itemIcon} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.company}</Text>
          <Text style={styles.itemDetails}>
            {item.location} • Saved on {item.date}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Trash2 size={20} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );

  const renderLocationItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <MapPin size={20} color="#006FFD" style={styles.itemIcon} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.type}</Text>
          <Text style={styles.itemDetails}>
            {item.address} • {item.distance}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Trash2 size={20} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Items</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
            onPress={() => setActiveTab('jobs')}>
            <Briefcase size={20} color={activeTab === 'jobs' ? '#006FFD' : '#6B7280'} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'jobs' && styles.activeTabText,
              ]}>
              Saved Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'locations' && styles.activeTab]}
            onPress={() => setActiveTab('locations')}>
            <MapPin size={20} color={activeTab === 'locations' ? '#006FFD' : '#6B7280'} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'locations' && styles.activeTabText,
              ]}>
              Saved Locations
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'jobs' ? (
          <FlatList
            data={savedJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <FlatList
            data={savedLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Saved items help you quickly access important opportunities and locations.
            You can remove items by tapping the trash icon.
          </Text>
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#F0F7FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#006FFD',
  },
  listContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  note: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});

export default SavedItemsSettings; 