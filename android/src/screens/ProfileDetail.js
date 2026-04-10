import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { employerService } from '../services/api';

export default function ProfileDetail({ route, navigation }) {
  const { id } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await employerService.viewJobseeker(id);
      setProfile(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!message || message.length < 10) {
      Alert.alert('Error', 'Message must be at least 10 characters');
      return;
    }
    setSending(true);
    try {
      await employerService.contactJobseeker(id, message);
      Alert.alert('Success', 'Message sent to jobseeker');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#800000" /></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{profile.full_name?.charAt(0) || '?'}</Text></View>
        <Text style={styles.name}>{profile.full_name || 'Anonymous'}</Text>
        <Text style={styles.category}>{profile.job_category || 'Not specified'}</Text>
        <View style={styles.statusBadge}><Text style={styles.statusText}>{profile.availability_status || 'Unknown'}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{profile.bio || 'No bio available'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>📍 Location:</Text><Text style={styles.detailValue}>{profile.location || 'Not specified'}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>💰 Expected Salary:</Text><Text style={styles.detailValue}>KES {profile.expected_salary || 'Negotiable'}</Text></View>
      </View>

      {profile.skills && profile.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Jobseeker</Text>
        <TextInput style={styles.messageInput} placeholder="Write your message..." value={message} onChangeText={setMessage} multiline numberOfLines={4} />
        <TouchableOpacity style={styles.contactButton} onPress={handleContact} disabled={sending}>
          <Text style={styles.contactButtonText}>{sending ? 'Sending...' : 'Send Message'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#800000', padding: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, color: '#800000', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  category: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  statusBadge: { backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginTop: 10 },
  statusText: { color: '#fff', fontSize: 12 },
  section: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  bio: { fontSize: 16, color: '#666', lineHeight: 24 },
  detailRow: { flexDirection: 'row', marginBottom: 10 },
  detailLabel: { fontSize: 16, color: '#666', width: 140 },
  detailValue: { fontSize: 16, color: '#333', fontWeight: '600' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillTag: { backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  skillText: { fontSize: 14, color: '#333' },
  contactSection: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, marginBottom: 30 },
  messageInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, height: 100, textAlignVertical: 'top' },
  contactButton: { backgroundColor: '#800000', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});