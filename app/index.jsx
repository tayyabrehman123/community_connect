import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, Text, ScrollView, Image, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from 'react-native-paper';
import { UserContext } from '../components/AuthGate';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, loading } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login', { reset: true });
    } else if (user && user.role !== 'worker') {
      // Redirect non-workers to their correct dashboard
      if (user.role === 'admin') {
        router.replace('/admin/admin', { reset: true });
      } else if (user.role === 'donor') {
        router.replace('/donor-dashboard', { reset: true });
      } else if (user.role === 'employer') {
        router.replace('/employer-dashboard', { reset: true });
      } else {
        router.replace('/login', { reset: true });
      }
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user) return null;
  if (user.role !== 'worker') return null;

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);
  const goToSettings = () => {
    closeSidebar();
    router.push('/settings');
  };

  // Add navigation functions for testing
  const goToLogin = () => router.push('/admin/admin');
  const goToSignup = () => router.push('/(auth)/signup');

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
            <Text style={styles.sidebarTitle}>{t('menu')}</Text>
            <TouchableOpacity style={styles.sidebarButton} onPress={goToSettings}>
              <Ionicons name="settings-outline" size={24} color="#006FFD" style={{ marginRight: 12 }} />
              <Text style={styles.sidebarButtonText}>{t('settings')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('community_connect')}</Text>
          <TouchableOpacity onPress={openSidebar} style={styles.menuButtonRight}>
            <Ionicons name="menu" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>{t('support_for_everyone')}</Text>
        </View>
        
        {user && (
          <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderColor: '#eee',
            borderRadius: 19,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
            marginBottom:10,
            marginInline: 10,
          }}
        >
          <Text
            style={{
              color: '#1e90ff',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 4,
            }}
          >
            {t('welcome')},
          </Text>
          <Text
            style={{
              color: '#333',
              fontSize: 20,
              fontWeight: '600',
              //fontFamily: 'Poppins-Regular',
            }}
          >
            {user.name}
          </Text>
        </View>
        
            // <View style={{ flex: 1, backgroundColor:'#fff', paddingLeft: 19,paddingTop:10,}}>
            //   <Text style={{ color: '#666', fontWeight: 'bold',fontSize: 18 }}>
            //     Welcome, {user.name} {/*({user.role})*/}
            //   </Text>
            // </View>
          )}
        <View style={styles.content}>
          {/* Add test buttons here */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search" 
              placeholderTextColor="gray" 
            />
          </View>
          
          <Text style={styles.sectionTitle}>{t('Services')}</Text>
    
          {user?.role === 'admin' && (
            <Button mode="contained" style={{ marginBottom: 16 }} onPress={() => router.push('/admin/manage-users')}>
              Manage Users (Admin Only)
            </Button>
          )}

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{t('shelters_near_you')}</Text>
                  <Text style={styles.cardSubtitle}>
                  {t('find_nearby_shelters')}
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={() => router.push('/shelter')}
                  >
                   {t('Search')}
                  </Button>
                </View>
                <Image 
                  source={require("../assets/shelter.jpg")} 
                  style={styles.cardImage}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{t('foodbanks_near_you')}</Text>
                  <Text style={styles.cardSubtitle}>
                  {t('find_nearby_foodbanks')}
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={() => router.push('/foodbank')}
                  >
                    {t('Search')}
                  </Button>
                </View>
                <Image 
                  source={require("../assets/foodbanks.jpg")} 
                  style={styles.cardImage}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{t('find_jobs_near_you')}</Text>
                  <Text style={styles.cardSubtitle}>
                  {t('find_jobs_description')} 
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={() => router.push('/job_recomand')}
                  >
                    {t('Search')}
                  </Button>
                </View>
                <Image 
                  source={require("../assets/jobfinder.jpg")} 
                  style={styles.cardImage}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{t('food_donation')}</Text>
                  <Text style={styles.cardSubtitle}>
                  {t('donate_food_for_people_in_need')}
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={() => router.push('/food_donation')}
                  >
                   {t('Search')} 
                  </Button>
                </View>
                <Image 
                  source={require("../assets/donation.jpg")} 
                  style={styles.cardImage}
                />
              </Card.Content>
            </Card>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16, marginTop: 8 }}>
            <Button title="Login" onPress={goToLogin}>admin</Button>
            {/* <Button title="Login" onPress={goToSignup}>signup</Button> */}
          </View>
          
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006FFD',
    borderRadius:0,
  },
  header: {
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 24,
    paddingBottom: 20,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButtonRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
    padding: 10,
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 0,
    flex: 1,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    bottom: 2,
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebarRight: {
    width: 250,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'flex-start',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#006FFD',
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sidebarButtonText: {
    fontSize: 16,
    color: '#006FFD',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 50,
    width: '90%',
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginRight: 'auto',
    marginLeft: 20,
  },
  cardContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 24,
    backgroundColor: '#e7e7e7',
    marginBottom: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    marginTop: 4,
    marginBottom: 10,
    width: '80%',
    color: '#666',
  },
  button: {
    width: '80%',
    backgroundColor: '#006FFD',
    borderRadius: 12,
  },
  cardImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
});

export default Home;

