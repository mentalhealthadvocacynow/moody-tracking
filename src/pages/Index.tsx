// Add this import at the top
import { useReminders } from '@/hooks/useReminders';

// Add this inside the component
useReminders(reminderTime);

// Update the reminder button to request permission
<Button 
  className="w-full"
  onClick={() => {
    if (Notification.permission === 'granted') {
      showSuccess('Reminder set!');
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showSuccess('Reminders enabled!');
        } else {
          showError('Please enable notifications for reminders');
        }
      });
    }
  }}
>
  Set Daily Reminder
</Button>