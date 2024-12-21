export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser <boltAction type="file" filePath="src/lib/notifications.ts"> does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    return null;
  }

  if (Notification.permission === 'granted') {
    return new Notification(title, options);
  }

  return null;
}