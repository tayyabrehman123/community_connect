import React, { useState, useContext, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from 'react-native-paper';
import { UserContext } from '../components/AuthGate';

const EmployerDashboard = () => {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    console.log('EmployerDashboard: useEffect triggered', { loading, user });
    if (!loading && !user) {
      console.log('EmployerDashboard: No user, redirecting to login');
      router.replace('/login', { reset: true });
    } else if (user && user.role !== 'employer') {
      console.log('EmployerDashboard: User role is not employer:', user.role);
      // Redirect non-employers to their correct dashboard
      if (user.role === 'admin') {
        router.replace('/admin/admin', { reset: true });
      } else if (user.role === 'donor') {
        router.replace('/donor-dashboard', { reset: true });
      } else if (user.role === 'worker') {
        router.replace('/', { reset: true });
      } else {
        router.replace('/login', { reset: true });
      }
    } else if (user && user.role === 'employer') {
      console.log('EmployerDashboard: Valid employer user');
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user) return null;
  if (user.role !== 'employer') return null;

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);
  
  const goToSettings = () => {
    closeSidebar();
    router.push('/settings');
  };

  const goToMyJobs = () => {
    router.push('/job_recomand/my-jobs');
  };

  const goToAddJob = () => {
    router.push('/job_recomand/add-job');
  };

  const goToJobSearch = () => {
    router.push('/job_recomand');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={closeSidebar}
      >
        <TouchableOpacity style={styles.overlay} onPress={closeSidebar} activeOpacity={1}>
          <View style={styles.sidebarRight}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity style={styles.sidebarButton} onPress={goToSettings}>
              <Ionicons name="settings-outline" size={24} color="#fff" style={{ marginRight: 12 }} />
              <Text style={styles.sidebarButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'Employer'}</Text>
            </View>
            <TouchableOpacity onPress={openSidebar} style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={28} color="#006FFD" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Manage your job postings and find talent</Text>
        </View>
        
        <View style={styles.content}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="briefcase-outline" size={24} color="#006FFD" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Active Jobs</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#28a745" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="eye-outline" size={24} color="#ffc107" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Job Views</Text>
            </View>
          </View>

          {/* Main Action Cards */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Post New Job</Text>
                  <Text style={styles.cardSubtitle}>
                    Create and publish a new job posting to attract candidates.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToAddJob}
                  >
                    Post Job
                  </Button>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="add-circle-outline" size={48} color="#006FFD"/>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>My Job Postings</Text>
                  <Text style={styles.cardSubtitle}>
                    View and manage all your posted jobs, edit or delete them.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToMyJobs}
                  >
                    Manage Jobs
                  </Button>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="briefcase" size={48} color="#28a745" />
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Browse Jobs</Text>
                  <Text style={styles.cardSubtitle}>
                    Explore other job postings in the community.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToJobSearch}
                  >
                    Browse
                  </Button>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="search" size={48} color="#ffc107" />
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Additional Features */}
          <Text style={styles.sectionTitle}>Additional Services</Text>
          
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Community Services</Text>
                  <Text style={styles.cardSubtitle}>
                    Access shelters, food banks, and other community resources.
                  </Text>
                  <View style={styles.serviceButtons}>
                    <Button 
                      mode="contained" 
                      style={[styles.button, styles.serviceButton]}
                      onPress={() => router.push('/shelter')}
                    >
                      Shelters
                    </Button>
                    <Button 
                      mode="contained"
                      style={[styles.button, styles.serviceButton]}
                      onPress={() => router.push('/foodbank')}
                    >
                      FoodBanks
                    </Button>
                  </View>
                </View>
                {/* <View style={styles.cardIconContainer}>
                  <Ionicons name="people-circle-outline" size={48} color="#6f42c1" />
                </View> */}
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006FFD',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardIconContainer: {
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#006FFD',
  },
  serviceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceButton: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EmployerDashboard; 