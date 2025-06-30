import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCnic, setNewCnic] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState('worker');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.0.104:5000/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
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
            const response = await fetch(`http://192.168.0.104:5000/api/users/${id}`, {
              method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to remove user');
            setUsers(users.filter(u => u._id !== id));
            Alert.alert('Success', 'User removed successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to remove user: ' + error.message);
          }
        }
      },
    ]);
  };

  const handleAddUser = async () => {
    if (!newName || !newEmail || !newCnic || !newPassword || !newConfirmPassword) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }
    if (newPassword !== newConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('http://192.168.0.104:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          cnic: newCnic,
          password: newPassword,
          role: newRole
        })
      });
      if (!response.ok) throw new Error('Failed to add user');
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setNewName('');
      setNewEmail('');
      setNewCnic('');
      setNewPassword('');
      setNewConfirmPassword('');
      setNewRole('worker');
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
        keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.userCard}>
            <Card.Content style={styles.userContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userCnic}>CNIC: {item.cnic || 'N/A'}</Text>
                <Text style={styles.userRole}>Role: {item.role}</Text>
              </View>
              <IconButton icon="delete" color="#FF5252" onPress={() => handleRemove(item._id || item.id)} />
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
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={newCnic}
              onChangeText={setNewCnic}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={newConfirmPassword}
              onChangeText={setNewConfirmPassword}
              secureTextEntry
            />
            <Text style={{ alignSelf: 'flex-start', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>Role:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16, alignSelf: 'flex-start' }}>
              <TouchableOpacity onPress={() => setNewRole('worker')} style={[styles.roleButton, newRole === 'worker' && styles.selectedRole]}>
                <Text style={newRole === 'worker' ? styles.selectedRoleText : styles.roleText}>Worker</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewRole('donor')} style={[styles.roleButton, newRole === 'donor' && styles.selectedRole]}>
                <Text style={newRole === 'donor' ? styles.selectedRoleText : styles.roleText}>Donor</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewRole('employer')} style={[styles.roleButton, newRole === 'employer' && styles.selectedRole]}>
                <Text style={newRole === 'employer' ? styles.selectedRoleText : styles.roleText}>Employer</Text>
              </TouchableOpacity>
            </View>
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
  userCnic: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e90ff',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  selectedRole: {
    backgroundColor: '#1e90ff',
  },
  roleText: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  selectedRoleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ManageUsers; 