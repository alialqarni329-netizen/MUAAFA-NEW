/**
 * Resolves the correct home route for a signed-in user.
 * Checks admin_users first (owner portal), then users table (individual / business_owner).
 */
import { supabase } from '@lib/supabase';

export type UserPortal = 'owner' | 'business' | 'individual';

export async function resolveUserPortal(userId: string): Promise<UserPortal> {
  // 1. Check owner portal
  const { data: admin } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (admin?.role === 'owner') return 'owner';

  // 2. Check regular user role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.role === 'business_owner') return 'business';

  return 'individual';
}

export const PORTAL_HOME: Record<UserPortal, string> = {
  owner:      '/owner/dashboard',
  business:   '/business/(tabs)',
  individual: '/(tabs)',
};
