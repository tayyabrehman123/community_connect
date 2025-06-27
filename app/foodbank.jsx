import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text, Modal, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';

export default function Foodbank() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodbanks, setFoodbanks] = useState([]);
  const [selectedFoodbank, setSelectedFoodbank] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to show your position.");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
    })();
    // Fetch foodbanks from backend
    fetch('http://192.168.0.104:5000/api/foodbanks')
      .then(res => res.json())
      .then(data => setFoodbanks(data))
      .catch(err => console.log(err));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006FFD" />
        <Text style={styles.loadingText}>Please wait, finding foodbanks near your location</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }} >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Foodbanks</Text>
          <Text style={styles.headerSubtitle}>Find nearby foodbanks</Text>
        </View>
        <View style={styles.profileButton}>
          <Ionicons name="person" size={24} color="#B3DAFF" />
        </View>
      </View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location ? location.latitude : 31.5204,
            longitude: location ? location.longitude : 74.3587,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {foodbanks.map((foodbank) => (
            <Marker
              key={foodbank._id || foodbank.id}
              coordinate={{
                latitude: foodbank.latitude,
                longitude: foodbank.longitude,
              }}
              onPress={() => setSelectedFoodbank(foodbank)}
            />
          ))}
        </MapView>
        {/* Custom Modal Callout */}
        <Modal
          visible={!!selectedFoodbank}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedFoodbank(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setSelectedFoodbank(null)}
          >
            {selectedFoodbank && (
              <View style={styles.customCallout}>
                <Text style={styles.calloutTitle}>{selectedFoodbank.name}</Text>
                <Text style={styles.calloutAddress}>{selectedFoodbank.address}</Text>
                <Text style={styles.calloutDetail}>Accommodation: {selectedFoodbank.accommodation}</Text>
                <Text style={styles.calloutDetail}>Timings: {selectedFoodbank.timings}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedFoodbank(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      </View>
      <View style={styles.textcont}>
      <Text style={styles.texts}>choose any near by foodbanks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderColor: '#006FFD',
    overflow: 'hidden',
    borderRadius: 40,
  },
  textcont:{
    //flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  texts: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: '#666',
  },
  map: {
    flex: 1,
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
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
  customCallout: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 8,
    textAlign: 'center',
  },
  calloutAddress: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  calloutDetail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#006FFD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});



    



