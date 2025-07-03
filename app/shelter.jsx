import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text, Modal, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';
import config from '../config';

export default function Shelter() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);

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
    // Fetch shelters from backend
    fetch(`${config.BACKEND_URL}/api/shelters`)
      .then(res => res.json())
      .then(data => setShelters(data))
      .catch(err => console.log(err));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006FFD" />
        <Text style={styles.loadingText}>Please wait, finding shelters near your location</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }} >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shelters</Text>
          <Text style={styles.headerSubtitle}>Find nearby Shelters</Text>
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
          {shelters.map((shelter) => (
            <Marker
              key={shelter._id || shelter.id}
              coordinate={{
                latitude: shelter.latitude,
                longitude: shelter.longitude,
              }}
              onPress={() => setSelectedShelter(shelter)}
            />
          ))}
        </MapView>
        {/* Custom Modal Callout */}
        <Modal
          visible={!!selectedShelter}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedShelter(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setSelectedShelter(null)}
          >
            {selectedShelter && (
              <View style={styles.customCallout}>
                <Text style={styles.calloutTitle}>{selectedShelter.name}</Text>
                <Text style={styles.calloutAddress}>{selectedShelter.address}</Text>
                <Text style={styles.calloutDetail}>Accommodation: {selectedShelter.accommodation}</Text>
                <Text style={styles.calloutDetail}>Timings: {selectedShelter.timings}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedShelter(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      </View>
      <View style={styles.textcont}>
      <Text style={styles.texts}>choose any near by shelters </Text>
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



    





  // import React, { useEffect, useState } from "react";
  // import { View , StyleSheet , ActivityIndicator , Alert , Text , ScrollView , TextInput} from "react-native";
  // import MapView, { Marker } from "react-native-maps";
  // import * as Location from "expo-location";
  // import { Ionicons } from '@expo/vector-icons';
  
  // const shelters = [
  //   {
  //     id: 1,
  //     name: "Hope Shelter",
  //     latitude: 31.495328,
  //     longitude: 74.313139,
  //     address: "123 Main St, San Francisco, CA"
  //   },
  //   {
  //     id: 2,
  //     name: "Safe Haven",
  //     latitude: 37.7849,
  //     longitude: -122.4094,
  //     address: "456 Oak Ave, San Francisco, CA"
  //   },
  // ];
  
  // export default function Shelter() {
  //   const [location, setLocation] = useState(null);
  //   const [loading, setLoading] = useState(true);
  
  //   useEffect(() => {
  //     (async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         Alert.alert("Permission denied", "Location permission is required to show your position.");
  //         setLoading(false);
  //         return;
  //       }
  //       let loc = await Location.getCurrentPositionAsync({});
  //       setLocation(loc.coords);
  //       setLoading(false);
  //     })();
  //   }, []);
  
  //   if (loading) {
  //     return (
  //       <View style={styles.centered}>
  //         <ActivityIndicator size="large" color="#006FFD" />
  //       </View>
  //     );
  //   }
  
  //   return (
  //     // <ScrollView style={styles.containers}>
  //     <View style={{ flex: 1, backgroundColor: '#fff' }} >
  //       <View style={styles.header}>
  //         <View>
  //           <Text style={styles.headerTitle}>Shelters</Text>
  //           <Text style={styles.headerSubtitle}>Find nearby Shelters</Text>
  //         </View>
  //         <View style={styles.profileButton}>
  //           <Ionicons name="person" size={24} color="#B3DAFF" />
  //         </View>
  //       </View>
  
  //       {/* <View style={styles.searchContainer}>
  //         <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
  //         <TextInput 
  //           style={styles.searchInput}
  //           placeholder="Search" 
  //           placeholderTextColor="gray" 
  //         />
  //       </View> */}
        
  //     <View style={styles.container}>
  //       <MapView
  //         style={styles.map}
  //         initialRegion={{
  //           latitude: location ? location.latitude : 37.7749,
  //           longitude: location ? location.longitude : -122.4194,
  //           latitudeDelta: 0.05,
  //           longitudeDelta: 0.05,
  //         }}
  //         showsUserLocation={true}
  //       >
  //         {shelters.map((shelter) => (
  //           <Marker
  //             key={shelter.id}
  //             coordinate={{
  //               latitude: shelter.latitude,
  //               longitude: shelter.longitude,
  //             }}
  //             title={shelter.name}
  //             description={shelter.address}
  //           />
            
  //         ))}
  //       </MapView>
  //     </View>
  //     <Text style={styles.texts}></Text>
  //     </View>
  //     // </ScrollView>
  //   );
  // }
  
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     borderColor: '#006FFD',
  //     overflow: 'hidden',
  //     borderRadius: 40,
  //   },
  //   texts: {
  //     marginTop: 0,
  //   },
  //   map: {
  //     flex: 1,
  //   },
  //   centered: { 
  //     flex: 1, 
  //     justifyContent: "center", 
  //     alignItems: "center",
  //   },
  //   containers: {
  //     flex: 1,
  //     backgroundColor: '#fff',
  //   },
  //   header: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     padding: 20,
  //     backgroundColor: '#fff',
  //   },
  //   headerTitle: {
  //     fontSize: 24,
  //     fontWeight: 'bold',
  //     color: '#333',
  //   },
  //   headerSubtitle: {
  //     fontSize: 16,
  //     color: '#666',
  //     marginTop: 4,
  //   },
  //   profileButton: {
  //     backgroundColor: '#EAF2FF',
  //     width: 48,
  //     height: 48,
  //     borderRadius: 16,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   },
  //   searchContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     backgroundColor: '#e7e7e7',
  //     marginHorizontal: 20,
  //     marginTop: 10,
  //     borderRadius: 24,
  //     paddingHorizontal: 16,
  //     height: 50,
  //     elevation: 5,
  //   },
  //   searchIcon: {
  //     marginRight: 8,
  //   },
  //   searchInput: {
  //     flex: 1,
  //     fontSize: 16,
  //     color: '#333',
  //   },
    
  //   });
  
  