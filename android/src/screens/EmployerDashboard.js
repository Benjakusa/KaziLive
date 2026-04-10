import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { employerService } from '../services/api';
import { logout } from '../store/authSlice';

export default function EmployerDashboard({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await employerService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  const menuItems = profile?.verified 
    ? [
        { title: 'Find Talent', screen: 'JobseekerList', icon: '🔍' },
        { title: 'My Profile', screen: 'EmployerProfile', icon: '🏢' },
        { title: 'My Adverts', screen: 'Adverts', icon: '📢' },
      ]
    : [
        { title: 'Make Payment', screen: 'Payment', icon: '💳' },
        { title: 'My Profile', screen: 'EmployerProfile', icon: '🏢' },
      ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.username || 'Employer'}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {profile && (
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Company</Text>
          <Text style={styles.statusValue}>{profile.company_name || 'Not set'}</Text>
          <View style={[styles.verifiedBadge, profile.verified ? styles.verified : styles.pending]}>
            <Text style={styles.verifiedText}>{profile.verified ? '✓ Verified' : '⏳ Payment Required'}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#800000', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600' },
  statusCard: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, elevation: 2 },
  statusLabel: { fontSize: 12, color: '#666' },
  statusValue: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 4 },
  verifiedBadge: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  verified: { backgroundColor: '#10b981' },
  pending: { backgroundColor: '#f59e0b' },
  verifiedText: { color: '#fff', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 12, elevation: 2 },
  menuIcon: { fontSize: 28, marginRight: 16 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#333' },
});