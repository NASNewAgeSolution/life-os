import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getDailyQuote(quotes: string[]): string {
  const dayOfYear = differenceInCalendarDays(new Date(), new Date(new Date().getFullYear(), 0, 0))
  return quotes[dayOfYear % quotes.length]
}

export function calculateScore(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function isTaskOverdue(task: { scheduled_date: string; status: string }): boolean {
  if (task.status === 'completed') return false
  const taskDate = startOfDay(new Date(task.scheduled_date))
  const today = startOfDay(new Date())
  return isBefore(taskDate, today)
}

export function isTaskToday(task: { scheduled_date: string }): boolean {
  return isToday(new Date(task.scheduled_date))
}

export function getTimeUntilTask(scheduledTime: string): number {
  const now = new Date()
  const [hours, minutes] = scheduledTime.split(':').map(Number)
  const taskTime = new Date()
  taskTime.setHours(hours, minutes, 0, 0)
  return (taskTime.getTime() - now.getTime()) / 1000 / 60 // minutes
}

export function compoundGrowth(days: number, rate = 0.01): number {
  return Math.pow(1 + rate, days)
}

export function formatCompoundGrowth(days: number): string {
  const growth = compoundGrowth(days)
  if (growth >= 100) return `${Math.round(growth)}x`
  if (growth >= 10) return `${growth.toFixed(1)}x`
  return `${growth.toFixed(2)}x`
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🏆'
  if (streak >= 66) return '💎'
  if (streak >= 30) return '🔥'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '✨'
  if (streak >= 3) return '🌱'
  return '🌿'
}

export function generateCalendarData(completions: string[], year: number, month: number): boolean[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1)
    const dateStr = format(date, 'yyyy-MM-dd')
    return completions.includes(dateStr)
  })
}
