import { View, Text, StyleSheet, TextInput, ScrollView, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Foodbank = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Foodbanks</Text>
          <Text style={styles.headerSubtitle}>Find nearby foodbanks</Text>
        </View>
        <View style={styles.profileButton}>
          <Ionicons name="person" size={24} color="#B3DAFF" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search" 
          placeholderTextColor="gray" 
        />
      </View>
      
      <Text style={styles.sectionTitle}>Foodbanks near your Location</Text>
      
      <View style={styles.foodbankList}>
        <View style={styles.foodbankCard}>
          <Image source={require("../assets/gov.jpg")} style={styles.foodbankImage}/>
          <View style={styles.foodbankInfo}>
            <Text style={styles.foodbankName}>government foodbanks</Text>
            <Text style={styles.foodbankLocation}>garden town</Text>
          </View>
        </View>

        <View style={styles.foodbankCard}>
          <Image source={require("../assets/gov.jpg")} style={styles.foodbankImage}/>
          <View style={styles.foodbankInfo}>
            <Text style={styles.foodbankName}>government foodbanks</Text>
            <Text style={styles.foodbankLocation}>garden town</Text>
          </View>
        </View>

        <View style={styles.foodbankCard}>
          <Image source={require("../assets/gov.jpg")} style={styles.foodbankImage}/>
          <View style={styles.foodbankInfo}>
            <Text style={styles.foodbankName}>government foodbanks</Text>
            <Text style={styles.foodbankLocation}>garden town</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  profileButton: {
    backgroundColor: '#EAF2FF',
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 50,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginLeft: 20,
    marginBottom: 16,
  },
  foodbankList: {
    paddingHorizontal: 20,
  },
  foodbankCard: {
    flexDirection: 'row',
    backgroundColor: '#e7e7e7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
  },
  foodbankImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  foodbankInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  foodbankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodbankLocation: {
    fontSize: 14,
    color: '#71727A',
    marginTop: 4,
  },
});

export default Foodbank;