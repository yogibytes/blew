export type Theme = 'light' | 'dark'

export const brandName = 'Blew'
export const tagline = 'Accept Crypto Payments'

export function getThemeConfig(theme: Theme) {
  return {
    theme,
    bg: {
      primary: theme === 'dark' ? '#0f172a' : '#ffffff',
      secondary: theme === 'dark' ? '#1e293b' : '#f8fafc',
      tertiary: theme === 'dark' ? '#334155' : '#f1f5f9',
    },
    text: {
      primary: theme === 'dark' ? '#f1f5f9' : '#0f172a',
      secondary: theme === 'dark' ? '#cbd5e1' : '#475569',
      tertiary: theme === 'dark' ? '#94a3b8' : '#64748b',
    },
    accent: {
      primary: theme === 'dark' ? '#3b82f6' : '#2563eb',
      secondary: theme === 'dark' ? '#06b6d4' : '#0891b2',
      success: theme === 'dark' ? '#10b981' : '#059669',
      danger: theme === 'dark' ? '#ef4444' : '#dc2626',
      warning: theme === 'dark' ? '#f59e0b' : '#d97706',
    },
    border: {
      light: theme === 'dark' ? '#334155' : '#e2e8f0',
      medium: theme === 'dark' ? '#475569' : '#cbd5e1',
    },
  }
}
