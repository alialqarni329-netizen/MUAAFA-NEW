/**
 * Resolves the correct home route for a signed-in user.
 * Checks admin_users first (owner portal), then users table (individual / business_owner).
 * Falls back to 'individual' if any DB error occurs — never throws to callers.
 */
import { supabase } from '@lib/supabase';

export type UserPortal = 'owner' | 'business' | 'individual';

export async function resolveUserPortal(userId: string): Promise<UserPortal> {
  try {
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
  } catch {
    // DB unreachable or RLS error — default to individual portal to avoid getting stuck
    console.warn('[authGuard] resolveUserPortal failed, defaulting to individual');
    return 'individual';
  }
}

/**
 * Returns true if the user has confirmed their email address.
 * Uses email_confirmed_at from the Supabase auth user object.
 */
export function isEmailConfirmed(user: { email_confirmed_at?: string | null }): boolean {
  return !!user.email_confirmed_at;
}

export const PORTAL_HOME: Record<UserPortal, string> = {
  owner:      '/owner/dashboard',
  business:   '/business/(tabs)',
  individual: '/(tabs)',
};
