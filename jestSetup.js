// Global test environment setup — runs before any module is imported.
// Provides Supabase env vars so lib/supabase.ts doesn't throw on load.
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-abc123';
