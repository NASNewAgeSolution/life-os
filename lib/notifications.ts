import type { Task } from '@/types'
import { getTimeUntilTask } from '@/lib/utils'

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    console.log('Service Worker registered:', registration.scope)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false

  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function scheduleTaskReminder(task: Task, sw: ServiceWorker | null) {
  if (!task.scheduled_time || !sw) return

  const minutesUntil = getTimeUntilTask(task.scheduled_time)

  // Schedule 5 minutes before
  const reminderDelay = (minutesUntil - 5) * 60 * 1000

  if (reminderDelay <= 0) return // Task is less than 5 min away or passed

  sw.postMessage({
    type: 'SCHEDULE_NOTIFICATION',
    taskId: task.id,
    taskTitle: task.title,
    section: task.section,
    scheduledTime: task.scheduled_time,
    delay: reminderDelay,
  })
}

export function scheduleAllTaskReminders(tasks: Task[]) {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.ready.then((registration) => {
    const sw = registration.active
    if (!sw) return

    const today = new Date().toISOString().split('T')[0]
    const todayTasks = tasks.filter(
      (t) => t.scheduled_date === today && t.status !== 'completed' && t.scheduled_time
    )

    todayTasks.forEach((task) => scheduleTaskReminder(task, sw))
  })
}

export function notifyMilestoneAchieved(title: string, section: string) {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.ready.then((registration) => {
    const sw = registration.active
    if (!sw) return

    sw.postMessage({
      type: 'MILESTONE_ACHIEVED',
      title,
      section,
    })
  })
}

export function showLocalNotification(title: string, body: string, url?: string) {
  if (Notification.permission !== 'granted') return

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        data: { url: url || '/dashboard' },
      })
    })
  } else {
    new Notification(title, { body })
  }
}
