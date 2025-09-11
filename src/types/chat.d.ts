export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    responseTime?: number
    model?: string
  }
}

export interface ChatState {
  messages: ChatMessage[]
  isThinking: boolean
  inputValue: string
  conversationCount: number
}

export interface ChatActions {
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  setIsThinking: (isThinking: boolean) => void
  setInputValue: (value: string) => void
  incrementConversationCount: () => void
}

export interface ChatHookReturn extends ChatState, ChatActions {
  hasMessages: () => boolean
  sendMessage: (content: string) => Promise<void>
}