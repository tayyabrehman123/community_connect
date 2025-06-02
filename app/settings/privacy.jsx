import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Eye, MapPin, Download, Trash2, ChevronRight } from 'lucide-react-native';

const PrivacySettings = () => {
  const router = useRouter();
  const [privacySettings, setPrivacySettings] = useState({
    locationSharing: true,
    profileVisibility: true,
    activityStatus: true,
    dataCollection: true,
  });

  const toggleSetting = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
  };

  const handleDownloadData = () => {
    // TODO: Implement data download functionality
    Alert.alert('Download Data', 'Your data will be downloaded shortly.');
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement data deletion functionality
            Alert.alert('Success', 'All your data has been deleted.');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Controls</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <MapPin size={20} color="#006FFD" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Location Sharing</Text>
                  <Text style={styles.settingDescription}>
                    Allow sharing your location with nearby services
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.locationSharing}
                onValueChange={() => toggleSetting('locationSharing')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.locationSharing ? '#006FFD' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Eye size={20} color="#006FFD" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Profile Visibility</Text>
                  <Text style={styles.settingDescription}>
                    Make your profile visible to other users
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.profileVisibility}
                onValueChange={() => toggleSetting('profileVisibility')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.profileVisibility ? '#006FFD' : '#F3F4F6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Shield size={20} color="#006FFD" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Activity Status</Text>
                  <Text style={styles.settingDescription}>
                    Show when you're active on the app
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.activityStatus}
                onValueChange={() => toggleSetting('activityStatus')}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={privacySettings.activityStatus ? '#006FFD' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={handleDownloadData}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Download size={20} color="#006FFD" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Download Your Data</Text>
                  <Text style={styles.settingDescription}>
                    Get a copy of all your data
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleDeleteData}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, styles.dangerIcon]}>
                  <Trash2 size={20} color="#DC2626" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Delete All Data
                  </Text>
                  <Text style={styles.settingDescription}>
                    Permanently delete all your data
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Your privacy is important to us. We only collect data that helps us provide
            better services to you and the community.
          </Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEF2F2',
  },
  settingText: {
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
  note: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});

export default PrivacySettings; 