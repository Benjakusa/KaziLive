import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { employerService } from '../services/api';

export default function JobseekerList({ navigation }) {
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ job_category: '', location: '' });

  useEffect(() => {
    searchJobseekers();
  }, []);

  const searchJobseekers = async () => {
    setLoading(true);
    try {
      const response = await employerService.searchJobseekers(filters);
      setJobseekers(response.data.jobseekers || []);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch jobseekers');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProfileDetail', { id: item.id })}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.full_name?.charAt(0) || '?'}</Text></View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.full_name || 'Anonymous'}</Text>
          <Text style={styles.category}>{item.job_category || 'Not specified'}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detail}>📍 {item.location || 'Not specified'}</Text>
        <Text style={styles.detail}>💰 KES {item.expected_salary || 'Negotiable'}</Text>
        <Text style={styles.status}>{item.availability_status || 'Unknown'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Job Category" value={filters.job_category} onChangeText={(v) => setFilters({...filters, job_category: v})} />
        <TextInput style={styles.searchInput} placeholder="Location" value={filters.location} onChangeText={(v) => setFilters({...filters, location: v})} />
        <TouchableOpacity style={styles.searchButton} onPress={searchJobseekers}><Text style={styles.searchButtonText}>Search</Text></TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#800000" style={styles.loader} />
      ) : (
        <FlatList data={jobseekers} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} ListEmptyComponent={<Text style={styles.empty}>No jobseekers found</Text>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { backgroundColor: '#fff', padding: 15, elevation: 2 },
  searchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  searchButton: { backgroundColor: '#800000', padding: 14, borderRadius: 8, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loader: { marginTop: 50 },
  card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#800000', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardInfo: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 14, color: '#666' },
  cardDetails: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  detail: { fontSize: 14, color: '#666' },
  status: { fontSize: 14, color: '#10b981', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 },
});