import { useCreateCheckoutSession } from '../../hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import type { Booking, ShoppingItem } from '../../backend';
import { toast } from 'sonner';

interface PayForBookingButtonProps {
  booking: Booking;
  amount: number;
}

export default function PayForBookingButton({ booking, amount }: PayForBookingButtonProps) {
  const createCheckout = useCreateCheckoutSession();

  const handlePay = async () => {
    try {
      const items: ShoppingItem[] = [
        {
          productName: `Dance Class Session #${booking.sessionId.toString()}`,
          productDescription: `Booking #${booking.id.toString()}`,
          priceInCents: BigInt(amount * 100),
          currency: 'usd',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckout.mutateAsync(items);
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error: any) {
      toast.error('Failed to create payment session: ' + error.message);
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={createCheckout.isPending}
      className="bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
    >
      {createCheckout.isPending ? 'Processing...' : `Pay $${amount}`}
    </Button>
  );
}
