export function toDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function isSameDay(a: Date | string, b: Date | string): boolean {
  return toDateKey(new Date(a)) === toDateKey(new Date(b))
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
