import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchProfile } from '../../services/api';
import defaultAvatar from '../../assets/default-avatar.png';

/**
 * Fetches the logged-in user's full profile (name + avatar) from the API.
 * Returns { profile, loading, error }.
 * profile contains:
 *   - displayName  – company_name (employer) | full_name (jobseeker) | username (admin)
 *   - avatarUrl    – company_logo | profile_picture | defaultAvatar
 */
export function useProfile() {
    const { user, token } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !token) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchProfile(user.role, token)
            .then((data) => {
                if (cancelled) return;
                const displayName =
                    data.company_name ||   // employer
                    data.full_name ||       // jobseeker
                    data.username ||        // admin / fallback
                    user.username;
                const avatarUrl =
                    data.company_logo ||    // employer
                    data.profile_picture || // jobseeker
                    defaultAvatar;
                setProfile({ displayName, avatarUrl, raw: data });
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching profile:', err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [user, token]);

    return { profile, loading, error };
}
