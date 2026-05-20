import { prisma } from '@/lib/prisma'
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings'

export const settingsRepository = {
  async get(): Promise<AppSettings> {
    const row = await prisma.settings.findUnique({ where: { id: 'default' } })
    if (!row) return DEFAULT_SETTINGS
    return {
      dailyGoal: row.dailyGoal,
      studyMode: row.studyMode as AppSettings['studyMode'],
      audioEnabled: row.audioEnabled,
      theme: row.theme as AppSettings['theme'],
      locale: row.locale,
    }
  },

  async upsert(settings: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get()
    const merged = { ...current, ...settings }
    await prisma.settings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        dailyGoal: merged.dailyGoal,
        studyMode: merged.studyMode,
        audioEnabled: merged.audioEnabled,
        theme: merged.theme,
        locale: merged.locale,
      },
      update: {
        dailyGoal: merged.dailyGoal,
        studyMode: merged.studyMode,
        audioEnabled: merged.audioEnabled,
        theme: merged.theme,
        locale: merged.locale,
      },
    })
    return merged
  },
}
