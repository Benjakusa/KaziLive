import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJobseekerProfile } from '../services/api.js';

export default function EmployerProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getJobseekerProfile(id);
      setProfile(data);
    }
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Skills: {profile.skills}</p>
      <p>Availability: {profile.availability}</p>
      <p>Salary Expectation: {profile.salary}</p>
    </div>
  );
}