import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { jobseekerService } from '../services/api';

export default function JobseekerProfile({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    availability_status: 'available',
    job_category: '',
    expected_salary: '',
    skills: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await jobseekerService.getProfile();
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        availability_status: response.data.availability_status || 'available',
        job_category: response.data.job_category || '',
        expected_salary: response.data.expected_salary?.toString() || '',
        skills: response.data.skills || [],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...formData,
        expected_salary: parseInt(formData.expected_salary) || 0,
        skills: formData.skills,
      };
      await jobseekerService.updateProfile(data);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // Handle image upload to backend
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#800000" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{formData.full_name?.charAt(0) || 'U'}</Text>
          </View>
        </TouchableOpacity>
        {profile?.profile_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified Profile</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={formData.full_name} onChangeText={(v) => setFormData({...formData, full_name: v})} />

        <Text style={styles.label}>Bio</Text>
        <TextInput style={[styles.input, styles.textArea]} value={formData.bio} onChangeText={(v) => setFormData({...formData, bio: v})} multiline numberOfLines={4} />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={formData.location} onChangeText={(v) => setFormData({...formData, location: v})} />

        <Text style={styles.label}>Availability Status</Text>
        <View style={styles.statusButtons}>
          {['available', 'not_available', 'open_to_work'].map((status) => (
            <TouchableOpacity key={status} style={[styles.statusButton, formData.availability_status === status && styles.statusButtonActive]} onPress={() => setFormData({...formData, availability_status: status})}>
              <Text style={[styles.statusButtonText, formData.availability_status === status && styles.statusButtonTextActive]}>{status.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Job Category</Text>
        <TextInput style={styles.input} value={formData.job_category} onChangeText={(v) => setFormData({...formData, job_category: v})} placeholder="e.g., Software Engineering" />

        <Text style={styles.label}>Expected Salary (KES)</Text>
        <TextInput style={styles.input} value={formData.expected_salary} onChangeText={(v) => setFormData({...formData, expected_salary: v})} keyboardType="numeric" placeholder="e.g., 50000" />

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 20, backgroundColor: '#800000' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, color: '#800000', fontWeight: 'bold' },
  verifiedBadge: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
  verifiedText: { color: '#fff', fontSize: 12 },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  statusButtonActive: { backgroundColor: '#800000' },
  statusButtonText: { fontSize: 14, color: '#666' },
  statusButtonTextActive: { color: '#fff' },
  button: { backgroundColor: '#800000', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});