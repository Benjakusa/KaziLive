import { useState, useEffect } from "react";
import { getProfile } from "../../services/api";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();
      setProfile(data || {});
    } catch (err) {
      console.error("PROFILE ERROR:", err);
      setError(err?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { profile, loading, error, refresh: loadProfile };
} 