import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../components/AuthGate';
import config from '../../config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${config.BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      // Immediately update the user context
      setUser(data.user);
      
      console.log('User data stored, redirecting to:', data.user.role);
      
      // Small delay to ensure context is updated
      setTimeout(() => {
        // Redirect based on role with stack reset
        if (data.user.role === 'admin') {
          router.replace('/admin/admin', { reset: true });
        } else if (data.user.role === 'worker') {
          router.replace('/', { reset: true });
        } else if (data.user.role === 'donor') {
          router.replace('/donor-dashboard', { reset: true });
        } else if (data.user.role === 'employer') {
          router.replace('/employer-dashboard', { reset: true });
        } else {
          router.replace('/', { reset: true }); // fallback
        }
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return(
    <View style={styles.container}>
      <Image source={require('../../assets/CommunityConnect.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Log In'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <Link href="/signup">
          <Text style={styles.signupLink}> Sign Up here</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: '#999',
  },
  signupLink: {
    fontSize: 16,
    color: '#1e90ff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
}); 