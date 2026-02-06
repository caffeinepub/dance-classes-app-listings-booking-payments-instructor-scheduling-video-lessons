import { useGetSession, useGetDanceClass } from './useQueries';
import type { Booking, Session, DanceClass } from '../backend';

export interface BookingDetails {
  booking: Booking;
  session: Session | null;
  danceClass: DanceClass | null;
  isLoading: boolean;
  isError: boolean;
}

export function useBookingDetails(booking: Booking): BookingDetails {
  const sessionQuery = useGetSession(booking.sessionId);
  const classQuery = useGetDanceClass(sessionQuery.data?.classId);

  return {
    booking,
    session: sessionQuery.data ?? null,
    danceClass: classQuery.data ?? null,
    isLoading: sessionQuery.isLoading || classQuery.isLoading,
    isError: sessionQuery.isError || classQuery.isError,
  };
}
