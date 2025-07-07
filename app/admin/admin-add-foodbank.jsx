import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import config from '../../config';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AdminAddFoodBank = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({
    latitude: 31.5204, // Default to Lahore
    longitude: 74.3587,
  });
  const [accommodation, setAccommodation] = useState('');
  const [timings, setTimings] = useState('');
  const [latitudeInput, setLatitudeInput] = useState(location.latitude.toString());
  const [longitudeInput, setLongitudeInput] = useState(location.longitude.toString());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get your current position.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    setLatitudeInput(location.latitude.toString());
    setLongitudeInput(location.longitude.toString());
  }, [location]);

  const handleSubmit = async () => {
    if (!name || !address || !accommodation || !timings) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/foodbanks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          latitude: location.latitude,
          longitude: location.longitude,
          accommodation,
          timings
        })
      });
      if (!response.ok) throw new Error('Failed to add food bank');
      Alert.alert('Success', 'Food bank added successfully!');
      setName(''); setAddress(''); setLocation({ latitude: 31.5204, longitude: 74.3587 }); setAccommodation(''); setTimings('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Food Bank</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <Text style={{ alignSelf: 'flex-start', marginBottom: 8 }}>Tap on the map to select location:</Text>
      <MapView
        style={{ width: '100%', height: 350, marginBottom: 12, borderRadius: 12 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={e => setLocation(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={location} />
      </MapView>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <Text style={{ marginRight: 16 }}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text>Longitude: {location.longitude.toFixed(6)}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 16, width: '100%' }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Latitude"
          keyboardType="numeric"
          value={latitudeInput}
          onChangeText={val => {
            setLatitudeInput(val);
            const lat = parseFloat(val);
            if (!isNaN(lat)) setLocation(l => ({ ...l, latitude: lat }));
          }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Longitude"
          keyboardType="numeric"
          value={longitudeInput}
          onChangeText={val => {
            setLongitudeInput(val);
            const lng = parseFloat(val);
            if (!isNaN(lng)) setLocation(l => ({ ...l, longitude: lng }));
          }}
        />
      </View>
      <TextInput style={styles.input} placeholder="Accommodation (e.g. Meals for 70 to 80 persons)" value={accommodation} onChangeText={setAccommodation} />
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