import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ChevronRight, User, Lock, Globe, Bell, BookmarkCheck, Shield, Trash2, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../components/AuthGate';
import { ArrowLeft} from 'lucide-react-native';

// import { signOut } from 'firebase/auth';
// import { auth } from '../../firebaseConfig';

const settingsSections = [
  {
    id: 'profile',
    icon: User,
    title: 'Edit Profile',
    description: 'Update your personal information',
    route: '/settings/profile'
  },
  {
    id: 'password',
    icon: Lock,
    title: 'Change Password',
    description: 'Update your security credentials',
    route: '/settings/password'
  },
  {
    id: 'language',
    icon: Globe,
    title: 'Language Preference',
    description: 'Choose your preferred language',
    route: '/settings/language'
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notification Settings',
    description: 'Manage your notifications',
    route: '/settings/notifications'
  },
  // {
  //   id: 'saved',
  //   icon: BookmarkCheck,
  //   title: 'Saved Jobs & Locations',
  //   description: 'View your saved items',
  //   route: '/settings/saved-items'
  // },
  // {
  //   id: 'privacy',
  //   icon: Shield,
  //   title: 'Privacy Settings',
  //   description: 'Manage your privacy preferences',
  //   route: '/settings/privacy'
  // },
  {
    id: 'delete',
    icon: Trash2,
    title: 'Delete Account',
    description: 'Permanently delete your account',
    route: '/settings/delete-account',
    danger: true,
  },
];

const Settings = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setUser(null);
              router.replace('/login', { reset: true });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.stitle}>Manage your account preferences</Text>
      </View>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronRight size={25} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account preferences</Text>
        </View>
      </View> */}

      <View style={styles.settingsList}>
        {settingsSections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.settingItem,
              section.danger && styles.dangerItem,
            ]}
            onPress={() => router.push(section.route)}>
            <View style={styles.settingContent}>
              <section.icon
                size={24}
                color={section.danger ? '#DC2626' : '#1F2937'}
              />
              <View style={styles.settingText}>
                <Text
                  style={[
                    styles.settingTitle,
                    section.danger && styles.dangerText,
                  ]}>
                  {section.title}
                </Text>
                <Text style={styles.settingDescription}>
                  {section.description}
                </Text>
              </View>
            </View>
            <ChevronRight
              size={20}
              color={section.danger ? '#DC2626' : '#6B7280'}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#006FFD',
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft:45,
    marginTop:5,
  },
  stitle: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft:45,
    marginTop:5,
  },
  // subtitle: {
  //   fontSize: 16,
  //   color: '#FFFFFF',
  //   marginTop: 4,
  // },
  settingsList: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dangerItem: {
    backgroundColor: '#FEF2F2',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dangerText: {
    color: '#DC2626',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006FFD',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  headerContent: {
    marginTop: 40,
  },
});

export default Settings; 