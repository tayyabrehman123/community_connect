import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

const AdminAddFoodBank = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [timings, setTimings] = useState('');

  const handleSubmit = async () => {
    if (!name || !address || !latitude || !longitude || !accommodation || !timings) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    try {
      const response = await fetch('http://192.168.0.104:5000/api/foodbanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accommodation,
          timings
        })
      });
      if (!response.ok) throw new Error('Failed to add food bank');
      Alert.alert('Success', 'Food bank added successfully!');
      setName(''); setAddress(''); setLatitude(''); setLongitude(''); setAccommodation(''); setTimings('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Food Bank</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Accommodation (e.g. 50 bags available)" value={accommodation} onChangeText={setAccommodation} />
      <TextInput style={styles.input} placeholder="Timings" value={timings} onChangeText={setTimings} />
      <Button mode="contained" style={styles.button} onPress={handleSubmit}>Add Food Bank</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
  },
  button: {
    width: '100%',
    backgroundColor: '#006FFD',
    borderRadius: 12,
    marginTop: 12,
  },
});

export default AdminAddFoodBank; 