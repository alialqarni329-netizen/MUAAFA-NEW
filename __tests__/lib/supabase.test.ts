/**
 * Supabase client initialization tests
 * Verifies env vars are read correctly and client config is correct.
 */

// jest.mock() calls are hoisted by babel-jest — safe before imports.
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: { getSession: jest.fn(), onAuthStateChange: jest.fn() },
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  })),
}));

jest.mock('react-native-url-polyfill/auto', () => ({}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';

// supabase is loaded lazily in beforeAll so env vars are set first.
// (babel-jest hoists `import` above process.env assignments, so we use require() here.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: any;

beforeAll(() => {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-abc123';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  supabase = require('../../lib/supabase').supabase;
});

describe('Supabase client', () => {
  it('calls createClient with the env URL', () => {
    expect(createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-anon-key-abc123',
      expect.any(Object),
    );
  });

  it('configures auth with persistent session and token refresh', () => {
    const callArgs = (createClient as jest.Mock).mock.calls[0];
    const options = callArgs[2] as { auth: Record<string, unknown> };

    expect(options.auth.autoRefreshToken).toBe(true);
    expect(options.auth.persistSession).toBe(true);
    expect(options.auth.detectSessionInUrl).toBe(false);
  });

  it('exports a supabase object with an auth property', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});

describe('Supabase env validation', () => {
  it('EXPO_PUBLIC_SUPABASE_URL is a valid https URL', () => {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
    expect(url).toMatch(/^https:\/\/.+\.supabase\.co$/);
  });

  it('EXPO_PUBLIC_SUPABASE_ANON_KEY is non-empty', () => {
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
    expect(key.length).toBeGreaterThan(10);
  });
});
