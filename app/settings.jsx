import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, User, Lock, Globe, Bell, BookmarkCheck, Shield, Trash2 } from 'lucide-react-native';

const settingsSections = [
  {
    id: 'profile',
    icon: User,
    title: 'Edit Profile',
    description: 'Update your personal information',
  },
  {
    id: 'password',
    icon: Lock,
    title: 'Change Password',
    description: 'Update your security credentials',
  },
  {
    id: 'language',
    icon: Globe,
    title: 'Language Preference',
    description: 'Choose your preferred language',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notification Settings',
    description: 'Manage your notifications',
  },
  {
    id: 'saved',
    icon: BookmarkCheck,
    title: 'Saved Jobs & Locations',
    description: 'View your saved items',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy Settings',
    description: 'Manage your privacy preferences',
  },
  {
    id: 'delete',
    icon: Trash2,
    title: 'Delete Account',
    description: 'Permanently delete your account',
    danger: true,
  },
];

const Settings = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account preferences</Text>
      </View>

      <View style={styles.settingsList}>
        {settingsSections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.settingItem,
              section.danger && styles.dangerItem,
            ]}>
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
      </View>
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
      },
      header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
      },
      subtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 4,
      },
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
})
