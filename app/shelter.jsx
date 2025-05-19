import { View, Text, StyleSheet,TextInput, ScrollView , Image  } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper';
import { Ionicons, AntDesign } from '@expo/vector-icons'

const shelter = () => {
  return (
    
    <View className="flex-1  bg-white">
    <Appbar.Header className="bg-white flex-row items-center justify-between shadow-md px-2">
      {/* Left: Back Arrow */}
      <Appbar.Action icon={() => <AntDesign name="left" size={24} color="#006FFD" />} onPress={() => router.back()}/>

      {/* Center: Title */}
      <Appbar.Content title="Shelters" titleStyle={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }} />

      {/* Right: Person Icon */}
      <View className="bg-[#EAF2FF] w-12 h-12 rounded-2xl flex items-center justify-center mr-3">
        <Ionicons name="person" size={24} color="#B3DAFF" />
      </View>
    </Appbar.Header>
    
    <View className = "items-center">
      
    <View className="flex-row items-center bg-[#e7e7e7] rounded-3xl px-6 mx-5 mt-5 mb-5 h-[50px] shadow-md">
      <Ionicons name="search" size={20} color="gray" className="mr-3" />
      <TextInput 
        className="flex-1 text-[16px] text-gray-800" 
        placeholder="Search" 
        placeholderTextColor="gray" 
      />
    </View>
    <Text className= "font-bold text-2xl mb-5" >Shelters near your Location</Text>
    <View className = "flex-row w-[320px] mb-7 bg-[#e7e7e7] rounded-2xl">
      <View>
        <Image source={require("../assets/gov.jpg")} style={styles.images} />
      </View>
      
      <View className = "pt-5 ml-5" >
        <Text className = "font-bold text-[16px]">
          government shelter 
        </Text>
        <Text style={{ color: '#71727A' }} className = "">
          garden town
        </Text>
      </View>
    </View>
    
    <View className = "flex-row w-[320px] mb-7 bg-[#e7e7e7] rounded-2xl">
      <View>
        <Image source={require("../assets/gov.jpg")} style={styles.images} />
      </View>
      
      <View className = "pt-5 ml-5" >
        <Text className = "font-bold text-[16px]">
          government shelter 
        </Text>
        <Text style={{ color: '#71727A' }} className = "">
          garden town
        </Text>
      </View>
    </View>
    
    <View className = "flex-row w-[320px] mb-7 bg-[#e7e7e7] rounded-2xl">
      <View>
        <Image source={require("../assets/gov.jpg")} style={styles.images} />
      </View>
      
      <View className = "pt-5 ml-5" >
        <Text className = "font-bold text-[16px]">
          government shelter 
        </Text>
        <Text style={{ color: '#71727A' }} className = "">
          garden town
        </Text>
      </View>
    </View>
    
  </View>
  </View>
  );
};
const styles = StyleSheet.create({
  images:{
    width: 80, // Adjust size as needed
    height: 80,
    borderRadius: 16,
    marginLeft: "", // Moves image to the extreme right
    alignSelf: "flex-start", // Aligns image to the bottom right
    // resizeMode: "contain",
    }
});

export default shelter