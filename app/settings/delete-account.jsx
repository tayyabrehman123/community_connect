import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react-native';

const DeleteAccount = () => {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [deleteData, setDeleteData] = useState(true);

  const handleDeleteAccount = () => {
    if (confirmation.toLowerCase() !== 'delete') {
      Alert.alert('Error', 'Please type "delete" to confirm');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion functionality
            Alert.alert(
              'Account Deleted',
              'Your account has been successfully deleted.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // TODO: Navigate to login or home screen
                    router.replace('/');
                  },
                },
              ],
            );
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
        <Text style={styles.title}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.warningContainer}>
          <AlertTriangle size={24} color="#DC2626" />
          <Text style={styles.warningTitle}>Warning: This action is permanent</Text>
          <Text style={styles.warningText}>
            Deleting your account will permanently remove all your data and cannot be undone.
            Please make sure you want to proceed with this action.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before you delete your account:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Download any data you want to keep</Text>
            <Text style={styles.bulletPoint}>• Cancel any active donations or subscriptions</Text>
            <Text style={styles.bulletPoint}>• Save any important information</Text>
            <Text style={styles.bulletPoint}>• Consider deactivating instead of deleting</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What happens when you delete your account:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• All your personal information will be deleted</Text>
            <Text style={styles.bulletPoint}>• Your saved jobs and locations will be removed</Text>
            <Text style={styles.bulletPoint}>• Your donation history will be erased</Text>
            <Text style={styles.bulletPoint}>• You won't be able to recover your account</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Deletion Options</Text>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setDeleteData(!deleteData)}>
            <View style={styles.optionInfo}>
              <View style={[styles.iconContainer, styles.dangerIcon]}>
                <Trash2 size={20} color="#DC2626" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Delete All Data</Text>
                <Text style={styles.optionDescription}>
                  Permanently delete all your personal data
                </Text>
              </View>
            </View>
            <Switch
              value={deleteData}
              onValueChange={setDeleteData}
              trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
              thumbColor={deleteData ? '#DC2626' : '#F3F4F6'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm Deletion</Text>
          <Text style={styles.confirmationText}>
            To confirm, please type "delete" below:
          </Text>
          <TextInput
            style={styles.input}
            value={confirmation}
            onChangeText={setConfirmation}
            placeholder="Type 'delete' to confirm"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, !confirmation && styles.deleteButtonDisabled]}
          onPress={handleDeleteAccount}
          disabled={!confirmation}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#DC2626',
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
  warningContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 8,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  confirmationText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccount; 