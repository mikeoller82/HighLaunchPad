// Utility types and helpers

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// Form types
export type FormData = Record<string, any>
export type ValidationError = {
  field: string
  message: string
}

// API types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type ApiError = {
  code: string
  message: string
  details?: any
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorScheme = {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
}

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

// File types
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other'
export type FileUpload = {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

// Social media types
export type SocialPlatformType = 'facebook' | 'instagram' | 'linkedin' | 'twitter'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

// Workspace types
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'
export type Permission = 'read' | 'write' | 'delete' | 'admin'

export {};