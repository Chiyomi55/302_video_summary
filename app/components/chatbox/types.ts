export interface Message {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatContextType {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  resetMessages: () => void
}
