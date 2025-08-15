// Firebase type extensions

import { User } from 'firebase/auth'
import { DocumentData, Timestamp } from 'firebase/firestore'

// Extend Firebase types
declare module 'firebase/auth' {
  interface User {
    // Add any custom properties if needed
  }
}

// Common Firestore document types
export interface FirestoreDocument {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserProfile extends FirestoreDocument {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  subscription?: DocumentData
}

export interface WorkspaceDocument extends FirestoreDocument {
  name: string
  description?: string
  ownerId: string
  members: string[]
  settings: Record<string, any>
  activeAgents: Record<string, boolean>
}

export interface SocialAccountDocument extends FirestoreDocument {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter'
  username: string
  displayName: string
  profilePicture?: string
  tokens: {
    accessToken: string
    refreshToken?: string
    expiresAt?: number
    tokenType: string
  }
  metadata: Record<string, any>
  connectedAt: Timestamp
  lastSynced: Timestamp
  needsReconnection?: boolean
}

export {};