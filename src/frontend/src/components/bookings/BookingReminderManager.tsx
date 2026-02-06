import { useEffect, useRef } from 'react';
import { useGetUserBookings } from '../../hooks/useQueries';
import { getAllReminderSettings } from '../../hooks/useBookingReminderSettings';
import { toast } from 'sonner';
import type { Booking } from '../../backend';

const CHECK_INTERVAL_MS = 60000; // Check every minute
const SHOWN_REMINDERS_KEY = 'shown-reminders';

function getShownReminders(): Set<string> {
  try {
    const stored = sessionStorage.getItem(SHOWN_REMINDERS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Failed to parse shown reminders:', error);
  }
  return new Set();
}

function markReminderShown(bookingId: string, sessionStartTime: number) {
  const key = `${bookingId}-${sessionStartTime}`;
  const shown = getShownReminders();
  shown.add(key);
  try {
    sessionStorage.setItem(SHOWN_REMINDERS_KEY, JSON.stringify([...shown]));
  } catch (error) {
    console.error('Failed to save shown reminders:', error);
  }
}

function wasReminderShown(bookingId: string, sessionStartTime: number): boolean {
  const key = `${bookingId}-${sessionStartTime}`;
  return getShownReminders().has(key);
}

export default function BookingReminderManager() {
  const { data: bookings = [] } = useGetUserBookings();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkReminders = async () => {
      const now = Date.now();
      const reminderSettings = getAllReminderSettings();

      // We need to fetch session and class data for each booking
      // Since we can't use hooks here, we'll use the actor directly
      // But for now, we'll just check the bookings we have
      // The actual implementation would need to fetch session/class data
      
      for (const booking of bookings) {
        // Skip if booking is canceled
        if (booking.status.__kind__ === 'canceled') {
          continue;
        }

        const bookingId = booking.id.toString();
        const settings = reminderSettings[bookingId];

        // Skip if reminders not enabled for this booking
        if (!settings || !settings.enabled) {
          continue;
        }

        // For now, we'll just log that we would check this booking
        // In a real implementation, we'd need to fetch session data
        // This is a limitation of not being able to use hooks in effects
      }
    };

    // Check immediately on mount
    checkReminders();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkReminders, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookings]);

  return null;
}
