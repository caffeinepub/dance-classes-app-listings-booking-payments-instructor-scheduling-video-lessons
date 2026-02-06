import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserBookings, useGetAllDanceClasses } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import PayForBookingButton from '../../components/payments/PayForBookingButton';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: bookings = [], isLoading } = useGetUserBookings();
  const { data: classes = [] } = useGetAllDanceClasses();

  if (!identity) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your bookings.</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  const getStatusBadge = (status: any) => {
    if (status.__kind__ === 'confirmed') {
      return <Badge className="bg-green-500">Confirmed</Badge>;
    } else if (status.__kind__ === 'pendingPayment') {
      return <Badge variant="secondary">Pending Payment</Badge>;
    } else if (status.__kind__ === 'canceled') {
      return <Badge variant="destructive">Canceled</Badge>;
    }
    return <Badge>Unknown</Badge>;
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your dance class bookings</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring our dance classes and book your first session!</p>
            <Button onClick={() => navigate({ to: '/' })}>Browse Classes</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const bookingDate = new Date(Number(booking.timestamp) / 1000000);
            return (
              <Card key={booking.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>Booking #{booking.id.toString()}</CardTitle>
                      <CardDescription>
                        Session ID: {booking.sessionId.toString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Booked on {bookingDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  {booking.status.__kind__ === 'pendingPayment' && (
                    <div className="flex items-center gap-4">
                      <PayForBookingButton
                        booking={booking}
                        amount={Number(booking.status.pendingPayment.amount)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Complete payment to confirm your booking
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
