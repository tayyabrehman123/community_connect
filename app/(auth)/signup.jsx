import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ScrollViewComponent, Modal, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import config from '../../config';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [role, setRole] = useState('worker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profession, setProfession] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
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
    'Welder'
  ];
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !cnic) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (role === 'worker' && !profession) {
      Alert.alert('Error', 'Please select a profession.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = { name, email, password, cnic, role };
      if (role === 'worker') body.profession = profession;
      const response = await fetch(`${config.BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      Alert.alert('Success', 'Account created! You can now log in.');
      router.replace('/login'); // Navigate to login screen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={require('../../assets/CommunityConnect.png')} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        value={cnic}
        onChangeText={setCnic}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
      />
      <Text style={styles.label}>I am a:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity onPress={() => setRole('worker')} style={[styles.roleButton, role === 'worker' && styles.selectedRole]}>
          <Text style={role === 'worker' ? styles.selectedRoleText : styles.roleText}>Worker</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('donor')} style={[styles.roleButton, role === 'donor' && styles.selectedRole]}>
          <Text style={role === 'donor' ? styles.selectedRoleText : styles.roleText}>Donor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('employer')} style={[styles.roleButton, role === 'employer' && styles.selectedRole]}>
          <Text style={role === 'employer' ? styles.selectedRoleText : styles.roleText}>Employer</Text>
        </TouchableOpacity>
      </View>
      {role === 'worker' && (
        <>
          <Text style={styles.label}>Profession</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowProfessionDropdown(true)}
          >
            <Text style={{ color: profession ? '#333' : '#999' }}>
              {profession || 'Select Profession'}
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
                        setProfession(item);
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
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Link href="/login">
          <Text style={styles.loginLink}> Log In</Text>
        </Link>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop:50,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    //resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e90ff',
    backgroundColor: '#fff',
    alignItems: 'center',
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
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#999',
  },
  loginLink: {
    fontSize: 16,
    color: '#1e90ff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 300,
    maxHeight: 350,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
}); 