// Theme configuration for Blew Dashboard
// Dark theme inspired by premium crypto UIs (Dune Analytics, Zerion, MetaMask Portfolio)

export type Theme = 'dark' | 'light'

export const colors = {
  dark: {
    // Background: Dark premium gradient background
    bg: {
      primary: '#0f0f1e',      // Deep dark navy
      secondary: '#1a1a2e',    // Slightly lighter
      tertiary: '#252542',     // Card background
      hover: '#2d2d4a',        // Hover state
    },
    // Foreground: Text colors
    text: {
      primary: '#ffffff',      // White text
      secondary: '#b0b0d1',    // Muted text
      tertiary: '#7a7a9e',     // Very muted
    },
    // Accent: Brand colors
    accent: {
      primary: '#00f0ff',      // Cyan (Swift Wind theme)
      secondary: '#7c3aed',    // Purple
      success: '#10b981',      // Green
      warning: '#f59e0b',      // Amber
      danger: '#ef4444',       // Red
    },
    // Border: Subtle borders
    border: {
      light: '#3d3d5c',        // Subtle border
      medium: '#4a4a6e',       // Medium border
    },
  },
  
  light: {
    // Background: Light premium background
    bg: {
      primary: '#f8fafc',      // Very light blue-gray
      secondary: '#f1f5f9',    // Slightly darker
      tertiary: '#e2e8f0',     // Card background
      hover: '#d1d5db',        // Hover state
    },
    // Foreground: Text colors
    text: {
      primary: '#0f172a',      // Dark text
      secondary: '#64748b',    // Medium gray
      tertiary: '#94a3b8',     // Light gray
    },
    // Accent: Brand colors
    accent: {
      primary: '#0891b2',      // Cyan
      secondary: '#7c3aed',    // Purple
      success: '#059669',      // Green
      warning: '#d97706',      // Amber
      danger: '#dc2626',       // Red
    },
    // Border: Visible borders
    border: {
      light: '#e2e8f0',        // Light border
      medium: '#cbd5e1',       // Medium border
    },
  },
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}

export const getThemeConfig = (theme: Theme) => ({
  ...colors[theme],
  shadows,
})

export const tagline = '🌬️ Payments at the speed of wind'
export const brandName = 'Blew'
