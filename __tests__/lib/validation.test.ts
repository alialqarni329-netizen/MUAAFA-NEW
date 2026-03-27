/**
 * Tests for Zod validation schemas in lib/validation.ts
 */
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  businessRegisterSchema,
  addEmployeeSchema,
  getFirstError,
  getFieldErrors,
} from '../../lib/validation';

// ── loginSchema ──────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('passes with valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secret1' });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret1' });
    expect(result.success).toBe(false);
  });

  it('rejects malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret1' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 chars', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'abc' });
    expect(result.success).toBe(false);
  });
});

// ── registerSchema ───────────────────────────────────────────────────────────

describe('registerSchema', () => {
  const valid = {
    fullName: 'محمد علي',
    phone: '0512345678',
    email: 'user@example.com',
    password: 'secret123',
  };

  it('passes with valid data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 3 chars', () => {
    expect(registerSchema.safeParse({ ...valid, fullName: 'أب' }).success).toBe(false);
  });

  it('rejects invalid Saudi phone (wrong prefix)', () => {
    expect(registerSchema.safeParse({ ...valid, phone: '0412345678' }).success).toBe(false);
  });

  it('rejects phone shorter than 10 digits', () => {
    expect(registerSchema.safeParse({ ...valid, phone: '051234' }).success).toBe(false);
  });

  it('accepts phone starting with 5 (without leading 0)', () => {
    expect(registerSchema.safeParse({ ...valid, phone: '0551234567' }).success).toBe(true);
  });
});

// ── forgotPasswordSchema ─────────────────────────────────────────────────────

describe('forgotPasswordSchema', () => {
  it('passes with valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });

  it('rejects empty email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

// ── businessRegisterSchema ───────────────────────────────────────────────────

describe('businessRegisterSchema', () => {
  const valid = {
    businessName: 'عيادة النور',
    businessType: 'clinic',
    ownerName: 'أحمد محمد',
    phone: '0501234567',
    email: 'clinic@example.com',
    address: 'الرياض، حي النزهة',
  };

  it('passes with valid data', () => {
    expect(businessRegisterSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects business name shorter than 3 chars', () => {
    expect(businessRegisterSchema.safeParse({ ...valid, businessName: 'أب' }).success).toBe(false);
  });

  it('rejects missing business type', () => {
    expect(businessRegisterSchema.safeParse({ ...valid, businessType: '' }).success).toBe(false);
  });

  it('accepts optional licenseNumber', () => {
    expect(businessRegisterSchema.safeParse({ ...valid, licenseNumber: '123456' }).success).toBe(true);
    expect(businessRegisterSchema.safeParse({ ...valid }).success).toBe(true);
  });
});

// ── addEmployeeSchema ────────────────────────────────────────────────────────

describe('addEmployeeSchema', () => {
  const valid = { full_name: 'سارة أحمد', email: 'sara@clinic.com', phone: '0501111111', role: 'doctor' as const };

  it('passes with valid data', () => {
    expect(addEmployeeSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid role', () => {
    expect(addEmployeeSchema.safeParse({ ...valid, role: 'chef' }).success).toBe(false);
  });

  it('accepts all valid roles', () => {
    const roles = ['doctor', 'nurse', 'admin', 'pharmacist', 'receptionist'] as const;
    roles.forEach(role => {
      expect(addEmployeeSchema.safeParse({ ...valid, role }).success).toBe(true);
    });
  });

  it('accepts empty email string', () => {
    expect(addEmployeeSchema.safeParse({ ...valid, email: '' }).success).toBe(true);
  });
});

// ── getFirstError ────────────────────────────────────────────────────────────

describe('getFirstError', () => {
  it('returns null when valid', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'abc123' });
    expect(getFirstError(result)).toBeNull();
  });

  it('returns an Arabic error message when invalid', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });
    const err = getFirstError(result);
    expect(typeof err).toBe('string');
    expect(err!.length).toBeGreaterThan(0);
  });
});

// ── getFieldErrors ───────────────────────────────────────────────────────────

describe('getFieldErrors', () => {
  it('returns empty object when valid', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'abc123' });
    expect(getFieldErrors(result)).toEqual({});
  });

  it('returns field-keyed errors when invalid', () => {
    const result = registerSchema.safeParse({ fullName: 'أ', phone: '123', email: 'bad', password: 'x' });
    const errors = getFieldErrors(result);
    expect(typeof errors).toBe('object');
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});
