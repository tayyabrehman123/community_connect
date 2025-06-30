import React from 'react';
import { View, Text, StyleSheet, Image , ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Manage Community Resources</Text>
      
      
      <View style={styles.cardContainer}>
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Add Shelter</Text>
              <Text style={styles.cardSubtitle}>Add a new shelter to the platform.</Text>
              <Button mode="contained" style={styles.button} onPress={() => router.push('/admin/admin-add-shelter')}>Add Shelter</Button>
            </View>
            <Image source={require('../../assets/shelter.jpg')} style={styles.cardImage} />
          </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Add Food Bank</Text>
              <Text style={styles.cardSubtitle}>Add a new food bank to the platform.</Text>
              <Button mode="contained" style={styles.button} onPress={() => router.push('/admin/admin-add-foodbank')}>Add Food Bank</Button>
            </View>
            <Image source={require('../../assets/foodbanks.jpg')} style={styles.cardImage} />
          </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Add Job</Text>
              <Text style={styles.cardSubtitle}>Post a new job opportunity.</Text>
              <Button mode="contained" style={styles.button} onPress={() => router.push('/job_recomand/add-job')}>Add Job</Button>
            </View>
            <Image source={require('../../assets/jobfinder.jpg')} style={styles.cardImage} />
          </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Add Donation</Text>
              <Text style={styles.cardSubtitle}>Post a new donation for workers to collect.</Text>
              <Button mode="contained" style={styles.button} onPress={() => router.push('/food_donation/add-donation')}>Add Donation</Button>
            </View>
            <Image source={require('../../assets/donation.jpg')} style={styles.cardImage} />
          </Card.Content>
        </Card>
        
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Manage Users</Text>
              <Text style={styles.cardSubtitle}>Add or remove users from the platform.</Text>
              <Button mode="contained" style={styles.button} onPress={() => router.push('/admin/manage-users')}>Manage Users</Button>
            </View>
            <Image source={require('../../assets/CommunityConnect.png')} style={styles.cardImage} />
          </Card.Content>
        </Card>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006FFD',
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 24,
    backgroundColor: '#e7e7e7',
    marginBottom: 16,
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

export default AdminDashboard; 