import type { StudyMode } from './vocabulary'

export interface AppSettings {
  dailyGoal: number
  studyMode: StudyMode
  audioEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  locale: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  dailyGoal: 20,
  studyMode: 'flip',
  audioEnabled: true,
  theme: 'system',
  locale: 'en',
}
