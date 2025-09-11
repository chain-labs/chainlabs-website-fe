export interface UIState {
  isFocused: boolean
  isRecording: boolean
  showPersonalized: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  animations: boolean
}

export interface UIActions {
  setIsFocused: (focused: boolean) => void
  setIsRecording: (recording: boolean) => void
  toggleRecording: () => void
  setShowPersonalized: (show: boolean) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setAnimations: (enabled: boolean) => void
}

export interface UIHookReturn extends UIState, UIActions {
  shouldShowPersonalized: () => boolean
}