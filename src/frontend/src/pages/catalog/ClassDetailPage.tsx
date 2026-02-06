import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllDanceClasses, useGetSessionsForClass } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, MapPin, Users, ArrowLeft, Video } from 'lucide-react';
import BookingButton from '../../components/bookings/BookingButton';

export default function ClassDetailPage() {
  const { classId } = useParams({ from: '/class/$classId' });
  const navigate = useNavigate();
  const { data: classes = [] } = useGetAllDanceClasses();
  const danceClass = classes.find((c) => c.id.toString() === classId);
  const { data: sessions = [], isLoading: sessionsLoading } = useGetSessionsForClass(
    danceClass ? danceClass.id : BigInt(0)
  );

  if (!danceClass) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Class not found</h1>
          <Button onClick={() => navigate({ to: '/' })}>Back to Classes</Button>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions
    .filter((s) => Number(s.startTime) > Date.now() * 1000000)
    .sort((a, b) => Number(a.startTime) - Number(b.startTime));

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Classes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{danceClass.title}</CardTitle>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {danceClass.style}
                    </Badge>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {danceClass.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base">{danceClass.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{Number(danceClass.duration)} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-5 w-5" />
                  <span>${Number(danceClass.price)} per session</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>Instructor: {danceClass.instructor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Book your spot in an upcoming class</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-24 bg-muted rounded"></div>
                  ))}
                </div>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming sessions scheduled yet. Check back soon!
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => {
                    const sessionDate = new Date(Number(session.startTime) / 1000000);
                    return (
                      <div
                        key={session.id.toString()}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {sessionDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="text-muted-foreground">
                                {sessionDate.toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {session.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{session.location}</span>
                              </div>
                            )}
                            {session.onlineLink && (
                              <div className="flex items-center gap-1">
                                <Video className="h-4 w-4" />
                                <span>Online</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{Number(session.capacity)} spots</span>
                            </div>
                          </div>
                        </div>
                        <BookingButton sessionId={session.id} price={Number(danceClass.price)} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] text-white border-0">
            <CardHeader>
              <CardTitle>Ready to Dance?</CardTitle>
              <CardDescription className="text-white/80">
                Book a session and start your dance journey today!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Price per session</span>
                  <span className="text-2xl font-bold">${Number(danceClass.price)}</span>
                </div>
                <p className="text-sm text-white/80">
                  Select a session above to book your spot. Payment is required to confirm your booking.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
