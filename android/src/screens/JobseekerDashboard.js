import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { jobseekerService } from '../services/api';

export default function JobseekerDashboard({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await jobseekerService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const menuItems = [
    { title: 'My Profile', screen: 'JobseekerProfile', icon: '👤' },
    { title: 'Upload Documents', screen: 'JobseekerProfile', icon: '📄' },
    { title: 'Settings', screen: 'JobseekerProfile', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.username || 'Jobseeker'}!</Text>
        {profile?.profile_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
      </View>

      {profile && (
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={styles.statValue}>{profile.availability_status || 'Not set'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Category</Text>
            <Text style={styles.statValue}>{profile.job_category || 'Not set'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Expected Salary</Text>
            <Text style={styles.statValue}>KES {profile.expected_salary || 'Not set'}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.title}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#800000',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});