import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useBookSession } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import type { SessionId } from '../../backend';
import { toast } from 'sonner';

interface BookingButtonProps {
  sessionId: SessionId;
  price: number;
}

export default function BookingButton({ sessionId, price }: BookingButtonProps) {
  const { identity, login } = useInternetIdentity();
  const bookSession = useBookSession();

  const handleBook = async () => {
    if (!identity) {
      toast.info('Please log in to book a class');
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
      }
      return;
    }

    try {
      await bookSession.mutateAsync(sessionId);
      toast.success('Session booked! Please complete payment to confirm.');
    } catch (error: any) {
      toast.error('Failed to book session: ' + error.message);
    }
  };

  return (
    <Button
      onClick={handleBook}
      disabled={bookSession.isPending}
      className="bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
    >
      {bookSession.isPending ? 'Booking...' : `Book - $${price}`}
    </Button>
  );
}
