import { ChatState, ChatActions } from './chat'
import { UserState, UserActions } from './user'
import { UIState, UIActions } from './ui'

export interface GlobalState extends ChatState, UserState, UIState {
  // Computed/Derived State
  hasMessages: () => boolean
  userMessageCount: () => number
  aiMessageCount: () => number
  shouldShowPersonalized: () => boolean
}

export interface GlobalActions extends ChatActions, UserActions, UIActions {}

export interface GlobalStore extends GlobalState, GlobalActions {}

export interface PersistableState {
  messages: ChatMessage[]
  userProfile: UserProfile | null
  conversationCount: number
  hasCompletedOnboarding: boolean
  theme: 'light' | 'dark'
  animations: boolean
  sidebarOpen: boolean
}