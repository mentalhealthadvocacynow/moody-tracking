import { useEffect } from 'react';
import { showSuccess, showError } from '@/utils/toast';

export const useReminders = (reminderTime: string) => {
  useEffect(() => {
    if (!('Notification' in window)) {
      showError('Notifications not supported in your browser');
      return;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showSuccess('Reminders enabled!');
        }
      });
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminder = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    if (now > reminder) {
      reminder.setDate(reminder.getDate() + 1);
    }

    const timeout = reminder.getTime() - now.getTime();
    const timer = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Mental Health Reminder', {
          body: 'Time to check in with your mental health toolkit!',
          icon: '/favicon.ico'
        });
      }
      // Reschedule for next day
      const nextDay = new Date(reminder);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextTimeout = nextDay.getTime() - Date.now();
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Mental Health Reminder', {
            body: 'Time to check in with your mental health toolkit!',
            icon: '/favicon.ico'
          });
        }
      }, nextTimeout);
    }, timeout);

    return () => clearTimeout(timer);
  }, [reminderTime]);
};