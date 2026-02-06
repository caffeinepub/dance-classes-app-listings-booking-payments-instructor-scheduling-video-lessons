import { useGetAllContactInquiries } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminInquiriesPage() {
  const { data: inquiries = [], isLoading, isError } = useGetAllContactInquiries();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load contact inquiries. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Sort inquiries by timestamp (newest first)
  const sortedInquiries = [...inquiries].sort((a, b) => {
    const timeA = Number(a.timestamp);
    const timeB = Number(b.timestamp);
    return timeB - timeA;
  });

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact Inquiries</h1>
          <p className="text-lg text-muted-foreground">
            Review and manage messages from visitors and students.
          </p>
        </div>

        {sortedInquiries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
              <p className="text-muted-foreground">
                Contact form submissions will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedInquiries.map((inquiry, index) => {
              const date = new Date(Number(inquiry.timestamp) / 1000000);
              const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[oklch(0.65_0.19_35)]" />
                        <CardTitle className="text-xl">{inquiry.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formattedDate} at {formattedTime}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="space-y-1 mt-2">
                      {inquiry.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="hover:text-[oklch(0.65_0.19_35)] transition-colors"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Message
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {inquiry.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
