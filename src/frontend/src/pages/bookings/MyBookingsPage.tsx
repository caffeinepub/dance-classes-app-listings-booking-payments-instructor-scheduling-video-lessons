import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserBookings } from '../../hooks/useQueries';
import { useBookingDetails } from '../../hooks/useBookingDetails';
import { useBookingReminderSettings } from '../../hooks/useBookingReminderSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Link as LinkIcon, Bell, Download } from 'lucide-react';
import PayForBookingButton from '../../components/payments/PayForBookingButton';
import { downloadICS } from '../../utils/ics';
import { toast } from 'sonner';
import type { Booking } from '../../backend';
import type { ReactElement } from 'react';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: bookings = [], isLoading } = useGetUserBookings();

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
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id.toString()}
              booking={booking}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  getStatusBadge: (status: any) => ReactElement;
}

function BookingCard({ booking, getStatusBadge }: BookingCardProps) {
  const bookingId = booking.id.toString();
  const bookingDate = new Date(Number(booking.timestamp) / 1000000);
  const isCanceled = booking.status.__kind__ === 'canceled';
  
  // Use the hook at the component level (not in a callback)
  const { session, danceClass, isLoading: detailsLoading } = useBookingDetails(booking);
  const { settings, updateSettings } = useBookingReminderSettings(bookingId);

  const handleAddToCalendar = () => {
    if (!session || !danceClass) {
      toast.error('Unable to create calendar event', {
        description: 'Session or class details are missing',
      });
      return;
    }

    try {
      const startTime = new Date(Number(session.startTime) / 1000000);
      const endTime = new Date(startTime.getTime() + Number(danceClass.duration) * 60000);

      const location = session.location || undefined;
      const url = session.onlineLink || undefined;

      downloadICS(
        {
          title: danceClass.title,
          startTime,
          endTime,
          location,
          url,
          description: `${danceClass.description}\n\nInstructor: ${danceClass.instructor}`,
        },
        `${danceClass.title.replace(/\s+/g, '-').toLowerCase()}.ics`
      );

      toast.success('Calendar event downloaded', {
        description: 'Open the file to add it to your calendar',
      });
    } catch (error) {
      console.error('Failed to generate calendar event:', error);
      toast.error('Failed to create calendar event');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            {detailsLoading ? (
              <>
                <div className="h-6 bg-muted rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
              </>
            ) : danceClass ? (
              <>
                <CardTitle>{danceClass.title}</CardTitle>
                <CardDescription>
                  {danceClass.style} • {danceClass.level} • {danceClass.instructor}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle>Booking #{bookingId}</CardTitle>
                <CardDescription className="text-destructive">
                  Session not found
                </CardDescription>
              </>
            )}
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Details */}
        {session && danceClass ? (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(Number(session.startTime) / 1000000).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{danceClass.duration} minutes</span>
              </div>
            </div>
            {session.location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{session.location}</span>
              </div>
            )}
            {session.onlineLink && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={session.onlineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Join online session
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Booked on {bookingDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}

        {/* Reminder Settings */}
        {!isCanceled && session && danceClass && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor={`reminder-${bookingId}`} className="text-sm font-medium">
                  Reminder
                </Label>
              </div>
              <Switch
                id={`reminder-${bookingId}`}
                checked={settings.enabled}
                onCheckedChange={(enabled) => updateSettings({ enabled })}
              />
            </div>
            {settings.enabled && (
              <div className="ml-6">
                <Label htmlFor={`lead-time-${bookingId}`} className="text-sm text-muted-foreground">
                  Remind me
                </Label>
                <Select
                  value={settings.leadTimeMinutes.toString()}
                  onValueChange={(value) => updateSettings({ leadTimeMinutes: parseInt(value) })}
                >
                  <SelectTrigger id={`lead-time-${bookingId}`} className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="120">2 hours before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {booking.status.__kind__ === 'pendingPayment' && (
            <>
              <PayForBookingButton
                booking={booking}
                amount={Number(booking.status.pendingPayment.amount)}
              />
              <p className="text-sm text-muted-foreground">
                Complete payment to confirm your booking
              </p>
            </>
          )}
          {!isCanceled && session && danceClass && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCalendar}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Add to calendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
