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

// New: App-level shape from personalized API (camelCase, narrowed unions)
export interface PersonalizedContent {
  headline: string
  goal: {
    description: string
    category: string
    priority: string
  }
  missions: {
    id: string
    title: string
    points: number
    status: 'pending' | 'completed'
  }[]
  recommendedCaseStudies: {
    id: string
    title: string
    summary: string
  }[]
}

export interface UsePersonalizedReturn {
  data: PersonalizedContent | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<PersonalizedContent | null>
}