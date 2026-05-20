/**
 * Future-ready sync contracts for Supabase / cloud backup.
 * Implement adapters without changing domain logic.
 */

export interface SyncUser {
  id: string
  email?: string
}

export interface SyncPayload {
  vocabulary: unknown[]
  statistics: unknown
  settings: unknown
  lastSyncedAt: string
}

export interface SyncAdapter {
  connect(): Promise<void>
  pull(userId: string): Promise<SyncPayload | null>
  push(userId: string, payload: SyncPayload): Promise<void>
}

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<SyncUser>
  signOut(): Promise<void>
  getCurrentUser(): Promise<SyncUser | null>
}
