import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, MessageSquare, MapPin, Briefcase, Heart } from 'lucide-react-native';

const notificationTypes = [
  {
    id: 'general',
    title: 'General Notifications',
    description: 'Important updates and announcements',
    icon: Bell,
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'New messages and communication',
    icon: MessageSquare,
  },
  {
    id: 'nearby',
    title: 'Nearby Services',
    description: 'Updates about nearby food banks and shelters',
    icon: MapPin,
  },
  {
    id: 'jobs',
    title: 'Job Opportunities',
    description: 'New job postings and updates',
    icon: Briefcase,
  },
  {
    id: 'donations',
    title: 'Donation Updates',
    description: 'Updates about your donations and impact',
    icon: Heart,
  },
];

const NotificationSettings = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    general: true,
    messages: true,
    nearby: true,
    jobs: true,
    donations: true,
  });

  const toggleNotification = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Choose which notifications you want to receive
        </Text>

        <View style={styles.notificationList}>
          {notificationTypes.map((type) => (
            <View key={type.id} style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <View style={styles.iconContainer}>
                  <type.icon size={20} color="#006FFD" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.notificationTitle}>{type.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {type.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications[type.id]}
                onValueChange={() => toggleNotification(type.id)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={notifications[type.id] ? '#006FFD' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Note: Some notifications may still be sent for critical updates
            regardless of these settings.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  description: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  notificationList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationInfo: {
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
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationDescription: {
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
  saveButton: {
    backgroundColor: '#006FFD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationSettings; 