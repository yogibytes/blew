// Theme color constants for the Blew Payment Widget

export const colors = {
  light: {
    bg: '#ffffff',
    bgSecondary: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#1a1f3a',
    accent: '#fbbf24',
    success: '#10b981',
    error: '#ef4444',
  },
  dark: {
    bg: '#0f172a',
    bgSecondary: '#1a1f3a',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    primary: '#60a5fa',
    accent: '#fbbf24',
    success: '#10b981',
    error: '#f87171',
  },
}

export const themeVariants = {
  primary: {
    light: colors.light.primary,
    dark: colors.dark.primary,
  },
  accent: {
    light: colors.light.accent,
    dark: colors.dark.accent,
  },
  success: {
    light: colors.light.success,
    dark: colors.dark.success,
  },
  error: {
    light: colors.light.error,
    dark: colors.dark.error,
  },
}
