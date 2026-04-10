import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authService } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('jobseeker');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.login({ identifier, password });
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.access_token
      }));
      
      if (response.data.user.user_type === 'employer') {
        navigation.replace('EmployerDashboard');
      } else {
        navigation.replace('JobseekerDashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      dispatch(loginFailure(errorMsg));
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KaziLive</Text>
      <Text style={styles.subtitle}>Find Your Next Opportunity</Text>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, userType === 'jobseeker' && styles.activeTab]}
          onPress={() => setUserType('jobseeker')}
        >
          <Text style={[styles.tabText, userType === 'jobseeker' && styles.activeTabText]}>Jobseeker</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, userType === 'employer' && styles.activeTab]}
          onPress={() => setUserType('employer')}
        >
          <Text style={[styles.tabText, userType === 'employer' && styles.activeTabText]}>Employer</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email, Username, or Phone"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#800000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#800000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#800000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#800000',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});