import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PasswordSettings = () => {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch('http://192.168.0.104:5000/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      Alert.alert('Success', 'Password changed successfully', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={passwords.current}
                onChangeText={(text) => setPasswords({ ...passwords, current: text })}
                placeholder="Enter current password"
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('current')}
                style={styles.eyeIcon}>
                {showPasswords.current ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={passwords.new}
                onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                placeholder="Enter new password"
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('new')}
                style={styles.eyeIcon}>
                {showPasswords.new ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                value={passwords.confirm}
                onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                placeholder="Confirm new password"
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('confirm')}
                style={styles.eyeIcon}>
                {showPasswords.confirm ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <Text style={styles.requirement}>• At least 8 characters long</Text>
          <Text style={styles.requirement}>• Include uppercase and lowercase letters</Text>
          <Text style={styles.requirement}>• Include at least one number</Text>
          <Text style={styles.requirement}>• Include at least one special character</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Change Password</Text>
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
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  requirements: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
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

export default PasswordSettings; 