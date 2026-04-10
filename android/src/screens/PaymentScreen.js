import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { paymentService } from '../services/api';

export default function PaymentScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const handlePayment = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentService.initMpesa(phone);
      if (response.data.transaction_id) {
        setTransactionId(response.data.transaction_id);
        Alert.alert('Success', 'Payment initiated. Check your phone for M-Pesa prompt.');
        setTimeout(() => {
          navigation.replace('EmployerDashboard');
        }, 3000);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>M-Pesa Payment</Text>
        <Text style={styles.subtitle}>Pay KES 500 to access jobseeker profiles</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Why Pay?</Text>
          <Text style={styles.infoText}>• Access verified jobseeker profiles</Text>
          <Text style={styles.infoText}>• Direct contact with candidates</Text>
          <Text style={styles.infoText}>• One-time payment, lifetime access</Text>
        </View>

        <Text style={styles.label}>Phone Number (M-Pesa registered)</Text>
        <TextInput
          style={styles.input}
          placeholder="0712345678"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay with M-Pesa</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>You will receive an STK push on your phone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#800000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },
});