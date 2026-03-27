export const Colors = {
  // Brand
  primary: '#0ea5e9',       // Sky blue - اللون الرئيسي
  primaryDark: '#0284c7',
  primaryLight: '#38bdf8',

  // Semantic
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutrals
  white: '#ffffff',
  black: '#000000',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  divider: '#f1f5f9',

  // Text
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',

  // Status
  statusPending: '#f59e0b',
  statusActive: '#22c55e',
  statusInactive: '#94a3b8',
  statusRejected: '#ef4444',
  statusCancelled: '#6b7280',

  // Portal-specific
  individual: '#0ea5e9',   // أزرق للأفراد
  business: '#8b5cf6',     // بنفسجي للأعمال
  owner: '#f97316',        // برتقالي للمالك

  // Dark mode
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
  },
} as const;
