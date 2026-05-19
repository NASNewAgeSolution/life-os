// Life OS Service Worker
const CACHE_NAME = 'life-os-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Handle push notifications from server
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/dashboard', section: data.section },
    actions: [
      { action: 'open', title: 'Open Dashboard' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: data.tag || 'life-os-notification',
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const url = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // If app is already open, focus it
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Otherwise open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

// Background sync for task reminders
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATION') {
    const { taskId, taskTitle, section, scheduledTime, delay } = event.data

    setTimeout(() => {
      self.registration.showNotification(`⏰ Task in 5 minutes`, {
        body: `${taskTitle} is coming up soon`,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [300, 100, 300, 100, 300],
        data: { url: `/dashboard/${section}`, section },
        tag: `task-reminder-${taskId}`,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'View Task' },
          { action: 'snooze', title: 'Snooze 5min' },
        ],
      })
    }, delay)
  }

  if (event.data?.type === 'MILESTONE_ACHIEVED') {
    const { title, section } = event.data
    self.registration.showNotification(`🎉 Milestone Achieved!`, {
      body: `You reached: ${title}`,
      icon: '/icon-192.png',
      vibrate: [200, 50, 200, 50, 200, 50, 400],
      data: { url: `/dashboard/${section}`, section },
      tag: 'milestone',
    })
  }
})
