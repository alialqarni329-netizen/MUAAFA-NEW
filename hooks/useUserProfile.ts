import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import type { User } from '../types/database';

interface UseUserProfileResult {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserProfile(userId?: string): UseUserProfileResult {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (err) {
      setError(err.message);
    } else {
      setProfile(data as User);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { profile, loading, error, refetch: fetch };
}
