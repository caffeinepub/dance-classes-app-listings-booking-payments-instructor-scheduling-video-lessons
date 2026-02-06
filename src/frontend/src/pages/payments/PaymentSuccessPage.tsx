import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
  }, [queryClient]);

  return (
    <div className="container py-24 flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-500/10 p-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your booking has been confirmed. We look forward to seeing you in class!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => navigate({ to: '/my-bookings' })}
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
          >
            View My Bookings
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
            Browse More Classes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
