import React, { useState, useContext, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from 'react-native-paper';
import { UserContext } from '../components/AuthGate';

const DonorDashboard = () => {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login', { reset: true });
    } else if (user && user.role !== 'donor') {
      // Redirect non-donors to their correct dashboard
      if (user.role === 'admin') {
        router.replace('/admin/admin', { reset: true });
      } else if (user.role === 'employer') {
        router.replace('/employer-dashboard', { reset: true });
      } else if (user.role === 'worker') {
        router.replace('/', { reset: true });
      } else {
        router.replace('/login', { reset: true });
      }
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user) return null;
  if (user.role !== 'donor') return null;

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);
  
  const goToSettings = () => {
    closeSidebar();
    router.push('/settings');
  };

  const goToMyDonations = () => {
    router.push('/food_donation/my-donations');
  };

  const goToAddDonation = () => {
    router.push('/food_donation/add-donation');
  };

  const goToBrowseDonations = () => {
    router.push('/food_donation');
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
              <Ionicons name="settings-outline" size={24} color="#006FFD" style={{ marginRight: 12 }} />
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
              <Text style={styles.userName}>{user?.name || 'Donor'}</Text>
            </View>
            <TouchableOpacity onPress={openSidebar} style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Share your generosity with the community</Text>
        </View>
        
        <View style={styles.content}>
          {/* Quick Stats */}
          {/* <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="gift-outline" size={24} color="#006FFD" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Active Donations</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#28a745" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#ffc107" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>People Helped</Text>
            </View>
          </View> */}

          {/* Main Action Cards */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Post New Donation</Text>
                  <Text style={styles.cardSubtitle}>
                    Share food, clothing, or other items with people in need.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToAddDonation}
                  >
                    Post Donation
                  </Button>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="add-circle-outline" size={48} color="#006FFD" />
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>My Donations</Text>
                  <Text style={styles.cardSubtitle}>
                    View and manage all your posted donations, track their status.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToMyDonations}
                  >
                    Manage Donations
                  </Button>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="gift" size={48} color="#28a745" />
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Browse Donations</Text>
                  <Text style={styles.cardSubtitle}>
                    See other donations in the community and get inspired.
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={goToBrowseDonations}
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
          <Text style={styles.sectionTitle}>Community Services</Text>
          
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Find Community Resources</Text>
                  <Text style={styles.cardSubtitle}>
                    Discover shelters, food banks, and other community services.
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
              </Card.Content>
            </Card>
          </View>

          {/* Donation Tips */}
          <Text style={styles.sectionTitle}>Donation Tips</Text>
          
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Best Practices</Text>
                  <Text style={styles.cardSubtitle}>
                    • Ensure food items are not expired{'\n'}
                    • Package items securely{'\n'}
                    • Provide clear pickup instructions{'\n'}
                    • Be responsive to inquiries
                  </Text>
                </View>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="bulb-outline" size={48} color="#17a2b8" />
                </View>
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
    backgroundColor:'#006FFD',
    color: "#fff",
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

export default DonorDashboard; 