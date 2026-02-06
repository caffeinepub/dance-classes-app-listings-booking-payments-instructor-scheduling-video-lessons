import { useEffect, useRef } from 'react';
import { useBookingDetails } from '../../hooks/useBookingDetails';
import { useBookingReminderSettings } from '../../hooks/useBookingReminderSettings';
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

interface BookingReminderCheckerProps {
  booking: Booking;
}

export default function BookingReminderChecker({ booking }: BookingReminderCheckerProps) {
  const { session, danceClass } = useBookingDetails(booking);
  const bookingId = booking.id.toString();
  const { settings } = useBookingReminderSettings(bookingId);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkReminder = () => {
      // Skip if no session/class data or booking is canceled
      if (!session || !danceClass || booking.status.__kind__ === 'canceled') {
        return;
      }

      // Skip if reminders not enabled for this booking
      if (!settings || !settings.enabled) {
        return;
      }

      // Check if we already showed this reminder
      const sessionStartTime = Number(session.startTime);
      if (wasReminderShown(bookingId, sessionStartTime)) {
        return;
      }

      // Calculate time until session
      const now = Date.now();
      const sessionStartMs = sessionStartTime / 1000000; // Convert nanoseconds to milliseconds
      const timeUntilSession = sessionStartMs - now;
      const leadTimeMs = settings.leadTimeMinutes * 60 * 1000;

      // Show reminder if within lead time and session hasn't started yet
      if (timeUntilSession > 0 && timeUntilSession <= leadTimeMs) {
        const startDate = new Date(sessionStartMs);
        const formattedTime = startDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

        toast.info(`Upcoming Class: ${danceClass.title}`, {
          description: `Your class starts at ${formattedTime}`,
          duration: 10000,
        });

        markReminderShown(bookingId, sessionStartTime);
      }
    };

    // Check immediately
    checkReminder();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkReminder, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [booking, session, danceClass, bookingId, settings]);

  return null;
}
