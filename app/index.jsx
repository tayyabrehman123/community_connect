import React from "react";
import { View, TextInput, Text, ScrollView, Image } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from 'react-native-paper';

const Home = () => {
  const router = useRouter();
  
  return (
    <ScrollView className="bg-[#006FFD]">
      <View className="ml-5 mb-1 mt-6 pb-5">
        <Text className="text-2xl font-bold text-white">Community Connect</Text>
        <Text className="text-white">Support for everyone in need</Text>
      </View>
      
      <View className="flex-1 bg-white items-center">
        <View className="flex-row items-center bg-[#e7e7e7] rounded-3xl px-6 mx-5 mt-5 h-[50px] shadow-md">
          <Ionicons name="search" size={20} color="gray" className="mr-3" />
          <TextInput 
            className="flex-1 text-[16px] text-gray-800" 
            placeholder="Search" 
            placeholderTextColor="gray" 
          />
        </View>
          
        <Text className="text-lg font-bold text-gray-800 mt-5 mr-[230px]">Services</Text>
    
        <View className="mt-2.5">
          <Card className="w-80 rounded-3xl bg-[#e7e7e7] shadow-md">
            <Card.Content className="flex-row">
              <View className="flex-1">
                <Text className="text-base font-bold">Shelters near you</Text>
                <Text className="mt-1 mb-2.5 w-48 text-gray-600">
                  Find nearby shelters with available space.
                </Text>
                <Button 
                  mode="contained" 
                  className="w-48 bg-[#006FFD] rounded-xl" 
                  onPress={() => router.push('/shelter')}
                >
                  Search
                </Button>
              </View>
              <Image 
                source={require("../assets/shelter.jpg")} 
                className="w-20 h-28 rounded-lg self-end" 
              />
            </Card.Content>
          </Card>
        </View>

        <View className="mt-5">
          <Card className="w-80 rounded-3xl bg-[#e7e7e7] shadow-md">
            <Card.Content className="flex-row">
              <View className="flex-1">
                <Text className="text-base font-bold">FoodBanks near you</Text>
                <Text className="mt-1 mb-2.5 w-48 text-gray-600">
                  Find nearby available foodbanks.
                </Text>
                <Button 
                  mode="contained" 
                  className="w-48 bg-[#006FFD] rounded-xl" 
                  onPress={() => router.push('/foodbank')}
                >
                  Search
                </Button>
              </View>
              <Image 
                source={require("../assets/foodbanks.jpg")} 
                className="w-20 h-28 rounded-lg self-end" 
              />
            </Card.Content>
          </Card>
        </View>

        <View className="mt-5">
          <Card className="w-80 rounded-3xl bg-[#e7e7e7] shadow-md">
            <Card.Content className="flex-row">
              <View className="flex-1">
                <Text className="text-base font-bold">Find Jobs near you</Text>
                <Text className="mt-1 mb-2.5 w-48 text-gray-600">
                  Find jobs according to your skills available.
                </Text>
                <Button 
                  mode="contained" 
                  className="w-48 bg-[#006FFD] rounded-xl" 
                  onPress={() => router.push('/job_recomand')}
                >
                  Search
                </Button>
              </View>
              <Image 
                source={require("../assets/jobfinder.jpg")} 
                className="w-20 h-28 rounded-lg self-end" 
              />
            </Card.Content>
          </Card>
        </View>

        <View className="mt-5 mb-5">
          <Card className="w-80 rounded-3xl bg-[#e7e7e7] shadow-md">
            <Card.Content className="flex-row">
              <View className="flex-1">
                <Text className="text-base font-bold">Food donation</Text>
                <Text className="mt-1 mb-2.5 w-48 text-gray-600">
                  Donate food for the people in need.
                </Text>
                <Button 
                  mode="contained" 
                  className="w-48 bg-[#006FFD] rounded-xl" 
                  onPress={() => router.push('/food_donation')}
                >
                  Search
                </Button>
              </View>
              <Image 
                source={require("../assets/donation.jpg")} 
                className="w-20 h-28 rounded-lg self-end" 
              />
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

