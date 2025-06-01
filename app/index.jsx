import React from "react";
import { View, TextInput, Text, ScrollView, Image, StyleSheet, Touchable } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from 'react-native-paper';

const Home = () => {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Connect</Text>
        <Text style={styles.headerSubtitle}>Support for everyone in need</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search" 
            placeholderTextColor="gray" 
          />
        </View>
          
        <Text style={styles.sectionTitle}>Services</Text>
    
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Shelters near you</Text>
                <Text style={styles.cardSubtitle}>
                  Find nearby shelters with available space.
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.button}
                  onPress={() => router.push('/shelter')}
                >
                  Search
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
                <Text style={styles.cardTitle}>FoodBanks near you</Text>
                <Text style={styles.cardSubtitle}>
                  Find nearby available foodbanks.
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.button}
                  onPress={() => router.push('/foodbank')}
                >
                  Search
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
                <Text style={styles.cardTitle}>Find Jobs near you</Text>
                <Text style={styles.cardSubtitle}>
                  Find jobs according to your skills available.
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.button}
                  onPress={() => router.push('/job_recomand')}
                >
                  Search
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
                <Text style={styles.cardTitle}>Food donation</Text>
                <Text style={styles.cardSubtitle}>
                  Donate food for the people in need.
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.button}
                  onPress={() => router.push('/food_donation')}
                >
                  Search
                </Button>
              </View>
              <Image 
                source={require("../assets/donation.jpg")} 
                style={styles.cardImage}
              />
            </Card.Content>
          </Card>
        </View>
        
          
      </View>
      
      
      <View className="flex-1 items-center bg-blue-850 p-4">
          <Text className="text-lg font-bold text-black-500">Hello World</Text>
      </View>
      
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006FFD',
  },
  header: {
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#FFFFFF',
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

