import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    Alert.alert('Remove User', 'Are you sure you want to remove this user?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', id));
            setUsers(users.filter(u => u.id !== id));
            Alert.alert('Success', 'User removed successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to remove user: ' + error.message);
          }
        }
      },
    ]);
  };

  const handleAddUser = async () => {
    if (!newName || !newEmail) {
      Alert.alert('Error', 'Please enter name and email.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        name: newName,
        email: newEmail,
        role: 'user',
        createdAt: new Date(),
      });
      setUsers([...users, { id: docRef.id, name: newName, email: newEmail, role: 'user' }]);
      setNewName('');
      setNewEmail('');
      setModalVisible(false);
      Alert.alert('Success', 'User added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add user: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <Button mode="contained" style={styles.addButton} onPress={() => setModalVisible(true)}>Add User</Button>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.userCard}>
            <Card.Content style={styles.userContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>Role: {item.role}</Text>
              </View>
              <IconButton icon="delete" color="#FF5252" onPress={() => handleRemove(item.id)} />
            </Card.Content>
          </Card>
        )}
        style={{ width: '100%' }}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
            />
            <Button mode="contained" style={styles.button} onPress={handleAddUser}>Add User</Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: '#006FFD',
    borderRadius: 12,
    width: '100%',
  },
  userCard: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
  },
  button: {
    width: '100%',
    backgroundColor: '#006FFD',
    borderRadius: 12,
    marginBottom: 8,
  },
});

export default ManageUsers; 