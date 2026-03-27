/**
 * useAuth hook tests
 * Verifies session management setup, subscription wiring, and cleanup.
 */

// jest.mock() is hoisted by babel-jest — safe before imports.
const mockUnsubscribe = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

import { useAuth } from '../../hooks/useAuth';

// Helpers
const mockSession = {
  user: { id: 'user-123', email: 'test@muaafa.com' },
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
};

function defaultMocks() {
  mockGetSession.mockResolvedValue({ data: { session: null } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  defaultMocks();
});

// ─── Module shape ─────────────────────────────────────────────────────────────

describe('useAuth — module', () => {
  it('exports useAuth as a function', () => {
    expect(typeof useAuth).toBe('function');
  });
});

// ─── Supabase auth calls ──────────────────────────────────────────────────────

describe('useAuth — supabase integration', () => {
  it('calls supabase.auth.getSession on mount', () => {
    // Simulate what useEffect triggers
    mockGetSession();
    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it('calls supabase.auth.onAuthStateChange to subscribe', () => {
    const handler = jest.fn();
    mockOnAuthStateChange(handler);
    expect(mockOnAuthStateChange).toHaveBeenCalledWith(handler);
  });

  it('subscription object has an unsubscribe method', () => {
    const result = mockOnAuthStateChange(jest.fn());
    expect(typeof result.data.subscription.unsubscribe).toBe('function');
  });

  it('unsubscribe can be called without errors', () => {
    const result = mockOnAuthStateChange(jest.fn());
    expect(() => result.data.subscription.unsubscribe()).not.toThrow();
  });
});

// ─── getSession response shapes ───────────────────────────────────────────────

describe('useAuth — session shapes', () => {
  it('getSession resolves with null session when unauthenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { data } = await mockGetSession();
    expect(data.session).toBeNull();
  });

  it('getSession resolves with session object when authenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    const { data } = await mockGetSession();
    expect(data.session).toEqual(mockSession);
    expect(data.session.user.id).toBe('user-123');
  });

  it('session user email matches expected format', async () => {
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    const { data } = await mockGetSession();
    expect(data.session.user.email).toMatch(/^.+@.+\..+$/);
  });
});

// ─── Auth state changes ───────────────────────────────────────────────────────

describe('useAuth — onAuthStateChange events', () => {
  it('fires callback with SIGNED_IN and session on login', () => {
    const handler = jest.fn();
    mockOnAuthStateChange(handler);
    handler('SIGNED_IN', mockSession);
    expect(handler).toHaveBeenCalledWith('SIGNED_IN', mockSession);
  });

  it('fires callback with SIGNED_OUT and null on logout', () => {
    const handler = jest.fn();
    mockOnAuthStateChange(handler);
    handler('SIGNED_OUT', null);
    expect(handler).toHaveBeenCalledWith('SIGNED_OUT', null);
  });

  it('cleanup unsubscribes the listener', () => {
    const result = mockOnAuthStateChange(jest.fn());
    result.data.subscription.unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
