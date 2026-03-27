/**
 * Tests for lib/authGuard.ts — resolveUserPortal and PORTAL_HOME
 */
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: { getSession: jest.fn(), onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })) },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));
jest.mock('react-native-url-polyfill/auto', () => ({}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn(),
}));

import { PORTAL_HOME } from '../../lib/authGuard';

describe('PORTAL_HOME', () => {
  it('maps owner to /owner/dashboard', () => {
    expect(PORTAL_HOME.owner).toBe('/owner/dashboard');
  });

  it('maps business to /business/(tabs)', () => {
    expect(PORTAL_HOME.business).toBe('/business/(tabs)');
  });

  it('maps individual to /(tabs)', () => {
    expect(PORTAL_HOME.individual).toBe('/(tabs)');
  });

  it('has exactly 3 portals', () => {
    expect(Object.keys(PORTAL_HOME)).toHaveLength(3);
  });
});
