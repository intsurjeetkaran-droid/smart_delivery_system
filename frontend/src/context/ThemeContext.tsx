/**
 * Theme Context Provider
 * 
 * Provides global dark/light theme functionality across the application.
 * Persists theme preference to localStorage and applies to document root.
 * 
 * @module ThemeContext
 * @requires React
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * Theme type definition
 * @typedef {'light' | 'dark'} ThemeType
 */
type ThemeType = 'light' | 'dark'

/**
 * Theme context interface
 * @interface ThemeContextType
 */
interface ThemeContextType {
  /** Current theme mode */
  theme: ThemeType
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void
}

/**
 * Create theme context with undefined default value
 * @type {React.Context<ThemeContextType | undefined>}
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * ThemeProvider Component
 * 
 * Wraps the application to provide theme context.
 * Initializes theme from localStorage or system preference.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme provider wrapper
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Logger: Initialize theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as ThemeType | null
    
    if (storedTheme) {
      console.log(`[ThemeContext] Loaded stored theme: ${storedTheme}`)
      return storedTheme
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const defaultTheme = prefersDark ? 'dark' : 'light'
    console.log(`[ThemeContext] System preference detected: ${defaultTheme}`)
    return defaultTheme
  })

  /**
   * Apply theme to document root
   * Updates the 'data-theme' attribute and Tailwind dark class
   */
  useEffect(() => {
    console.log(`[ThemeContext] Applying theme: ${theme}`)
    
    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme)
    
    // Update Tailwind dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Persist to localStorage
    localStorage.setItem('theme', theme)
    console.log(`[ThemeContext] Theme persisted to localStorage: ${theme}`)
  }, [theme])

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      console.log(`[ThemeContext] Theme toggled: ${prev} → ${newTheme}`)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to use theme context
 * 
 * Must be used within a ThemeProvider component
 * 
 * @function
 * @returns {ThemeContextType} Theme context value
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme()
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    console.error('[ThemeContext] useTheme must be used within ThemeProvider')
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
