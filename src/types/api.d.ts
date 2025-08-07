export interface APIResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
  success: boolean
}

export interface ChatAPIRequest {
  message: string
  context?: Record<string, any>
  model?: string
  temperature?: number
}

export interface ChatAPIResponse extends APIResponse {
  data: {
    message: string
    id: string
    timestamp: string
    metadata?: {
      tokens: number
      model: string
      responseTime: number
    }
  }
}

export interface UserAPIRequest {
  profile: Partial<UserProfile>
}

export interface UserAPIResponse extends APIResponse {
  data: UserProfile
}