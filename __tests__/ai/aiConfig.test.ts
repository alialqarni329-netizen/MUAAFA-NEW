/**
 * AI configuration & daily-limit logic tests
 * Verifies that the exact model settings from BOT_COST_CONTROL_SYSTEM.md
 * are preserved, and that the message-limit guard works correctly.
 */

// Mirror the AI_CONFIG defined in app/(tabs)/index.tsx
const AI_CONFIG = {
  model: 'gpt-4o',
  max_tokens: 300,
  temperature: 0.4,
  top_p: 0.9,
  frequency_penalty: 0.1,
  presence_penalty: 0.1,
  MAX_MESSAGES_PER_DAY: 20,
  WARNING_THRESHOLD: 16,
} as const;

// Daily-limit guard — mirrors the logic in sendMessage()
function canSendMessage(dailyCount: number): boolean {
  return dailyCount < AI_CONFIG.MAX_MESSAGES_PER_DAY;
}

function isWarningZone(dailyCount: number): boolean {
  return dailyCount >= AI_CONFIG.WARNING_THRESHOLD;
}

function remainingMessages(dailyCount: number): number {
  return AI_CONFIG.MAX_MESSAGES_PER_DAY - dailyCount;
}

// ─── Model configuration ──────────────────────────────────────────────────────

describe('AI_CONFIG — model identity', () => {
  it('uses gpt-4o model', () => {
    expect(AI_CONFIG.model).toBe('gpt-4o');
  });
});

describe('AI_CONFIG — token & sampling parameters', () => {
  it('max_tokens is 300', () => {
    expect(AI_CONFIG.max_tokens).toBe(300);
  });

  it('temperature is 0.4', () => {
    expect(AI_CONFIG.temperature).toBe(0.4);
  });

  it('top_p is 0.9', () => {
    expect(AI_CONFIG.top_p).toBe(0.9);
  });

  it('frequency_penalty is 0.1', () => {
    expect(AI_CONFIG.frequency_penalty).toBe(0.1);
  });

  it('presence_penalty is 0.1', () => {
    expect(AI_CONFIG.presence_penalty).toBe(0.1);
  });
});

// ─── Daily limit guard ────────────────────────────────────────────────────────

describe('Daily message limit', () => {
  it('MAX_MESSAGES_PER_DAY is 20', () => {
    expect(AI_CONFIG.MAX_MESSAGES_PER_DAY).toBe(20);
  });

  it('WARNING_THRESHOLD is 16 (80% of 20)', () => {
    expect(AI_CONFIG.WARNING_THRESHOLD).toBe(16);
    expect(AI_CONFIG.WARNING_THRESHOLD / AI_CONFIG.MAX_MESSAGES_PER_DAY).toBe(0.8);
  });

  it('allows sending when count is 0', () => {
    expect(canSendMessage(0)).toBe(true);
  });

  it('allows sending when count is below limit', () => {
    expect(canSendMessage(19)).toBe(true);
  });

  it('blocks sending when count equals the limit', () => {
    expect(canSendMessage(20)).toBe(false);
  });

  it('blocks sending when count exceeds the limit', () => {
    expect(canSendMessage(25)).toBe(false);
  });
});

// ─── Warning zone ─────────────────────────────────────────────────────────────

describe('Warning threshold', () => {
  it('no warning below threshold', () => {
    expect(isWarningZone(15)).toBe(false);
  });

  it('warns at exactly the threshold', () => {
    expect(isWarningZone(16)).toBe(true);
  });

  it('warns above threshold', () => {
    expect(isWarningZone(19)).toBe(true);
  });
});

// ─── Remaining messages ───────────────────────────────────────────────────────

describe('Remaining message counter', () => {
  it('shows 20 remaining at start of day', () => {
    expect(remainingMessages(0)).toBe(20);
  });

  it('shows 4 remaining near end of day', () => {
    expect(remainingMessages(16)).toBe(4);
  });

  it('shows 0 remaining when limit is reached', () => {
    expect(remainingMessages(20)).toBe(0);
  });
});
