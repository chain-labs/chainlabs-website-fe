export interface UseChatOptions {
  initialMessages?: ChatMessage[]
  onMessageSent?: (message: ChatMessage) => void
  onMessageReceived?: (message: ChatMessage) => void
  onError?: (error: Error) => void
}

export interface UseUIOptions {
  initialTheme?: 'light' | 'dark'
  persistPreferences?: boolean
}

export interface UseOutsideClickOptions {
  enabled?: boolean
  ignoreKeys?: string[]
}

export interface UseMobileReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: Record<string, () => void>
  enabled?: boolean
}