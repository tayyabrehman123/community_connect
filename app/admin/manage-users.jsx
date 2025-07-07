import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import config from '../../config';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [newProfession, setNewProfession] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showEditProfessionDropdown, setShowEditProfessionDropdown] = useState(false);
  const [editNewPassword, setEditNewPassword] = useState('');
  const [editConfirmNewPassword, setEditConfirmNewPassword] = useState('');

  const professions = [
    'Construction Worker',
    'Plumber',
    'Driver',
    'Electrician',
    'House Keeper',
    'Painter',
    'Carpenter',
    'Cleaner',
    'Mechanic',
    'Welder',
    'None'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/users`);
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
            const response = await fetch(`${config.BACKEND_URL}/api/users/${id}`, {
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
      const response = await fetch(`${config.BACKEND_URL}/api/users/register`, {
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.cnic && user.cnic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openEditModal = (user) => {
    setEditUser({ ...user });
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    if (!editUser.name || !editUser.email || !editUser.cnic) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }
    if (editNewPassword || editConfirmNewPassword) {
      if (!editNewPassword || !editConfirmNewPassword) {
        Alert.alert('Error', 'Please fill both password fields.');
        return;
      }
      if (editNewPassword !== editConfirmNewPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
    }
    try {
      const updateBody = {
        name: editUser.name,
        email: editUser.email,
        cnic: editUser.cnic,
        role: editUser.role,
        profession: editUser.profession || ''
      };
      if (editNewPassword && editNewPassword === editConfirmNewPassword) {
        updateBody.password = editNewPassword;
      }
      const response = await fetch(`${config.BACKEND_URL}/api/users/${editUser._id || editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody)
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updatedUser = await response.json();
      setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
      setEditModalVisible(false);
      setEditUser(null);
      setEditNewPassword('');
      setEditConfirmNewPassword('');
      Alert.alert('Success', 'User updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user: ' + error.message);
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email, or CNIC"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button mode="contained" style={styles.addButton} onPress={() => setModalVisible(true)}>Add User</Button>
      <FlatList
        data={filteredUsers}
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
              <IconButton icon="pencil" color="#006FFD" onPress={() => openEditModal(item)} />
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
            {newRole === 'worker' && (
              <>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setShowProfessionDropdown(true)}
                >
                  <Text style={{ color: newProfession ? '#333' : '#999' }}>
                    {newProfession || 'Select Profession'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  visible={showProfessionDropdown}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowProfessionDropdown(false)}
                >
                  <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowProfessionDropdown(false)}>
                    <View style={styles.dropdownModal}>
                      <FlatList
                        data={professions}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                              setNewProfession(item);
                              setShowProfessionDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}
            <Button mode="contained" style={styles.button} onPress={handleAddUser}>Add User</Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setEditModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editUser?.name || ''}
              onChangeText={name => setEditUser({ ...editUser, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editUser?.email || ''}
              onChangeText={email => setEditUser({ ...editUser, email })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={editUser?.cnic || ''}
              onChangeText={cnic => setEditUser({ ...editUser, cnic })}
            />
            <Text style={{ alignSelf: 'flex-start', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>Role:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16, alignSelf: 'flex-start' }}>
              <TouchableOpacity onPress={() => setEditUser({ ...editUser, role: 'worker' })} style={[styles.roleButton, editUser?.role === 'worker' && styles.selectedRole]}>
                <Text style={editUser?.role === 'worker' ? styles.selectedRoleText : styles.roleText}>Worker</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditUser({ ...editUser, role: 'donor' })} style={[styles.roleButton, editUser?.role === 'donor' && styles.selectedRole]}>
                <Text style={editUser?.role === 'donor' ? styles.selectedRoleText : styles.roleText}>Donor</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditUser({ ...editUser, role: 'employer' })} style={[styles.roleButton, editUser?.role === 'employer' && styles.selectedRole]}>
                <Text style={editUser?.role === 'employer' ? styles.selectedRoleText : styles.roleText}>Employer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditUser({ ...editUser, role: 'admin' })} style={[styles.roleButton, editUser?.role === 'admin' && styles.selectedRole]}>
                <Text style={editUser?.role === 'admin' ? styles.selectedRoleText : styles.roleText}>Admin</Text>
              </TouchableOpacity>
            </View>
            {editUser?.role === 'worker' && (
              <>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setShowEditProfessionDropdown(true)}
                >
                  <Text style={{ color: editUser?.profession ? '#333' : '#999' }}>
                    {editUser?.profession || 'Select Profession'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  visible={showEditProfessionDropdown}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowEditProfessionDropdown(false)}
                >
                  <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowEditProfessionDropdown(false)}>
                    <View style={styles.dropdownModal}>
                      <FlatList
                        data={professions}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                              setEditUser({ ...editUser, profession: item });
                              setShowEditProfessionDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="New Password (leave blank to keep unchanged)"
              value={editNewPassword}
              onChangeText={setEditNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={editConfirmNewPassword}
              onChangeText={setEditConfirmNewPassword}
              secureTextEntry
            />
            <Button mode="contained" style={styles.button} onPress={handleUpdateUser}>Save Changes</Button>
            <Button mode="text" onPress={() => setEditModalVisible(false)}>Cancel</Button>
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
  searchInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: '80%',
    alignSelf: 'center',
    maxHeight: 300,
    elevation: 10,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ManageUsers;