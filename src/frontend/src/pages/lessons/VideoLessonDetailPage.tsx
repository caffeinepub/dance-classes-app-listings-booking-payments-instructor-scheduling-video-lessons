import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllVideoLessons } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowLeft } from 'lucide-react';

export default function VideoLessonDetailPage() {
  const { lessonId } = useParams({ from: '/lessons/$lessonId' });
  const navigate = useNavigate();
  const { data: lessons = [] } = useGetAllVideoLessons();
  const lesson = lessons.find((l) => l.id.toString() === lessonId);

  if (!lesson) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => navigate({ to: '/lessons' })}>Back to Lessons</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/lessons' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Lessons
      </Button>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div>
                <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {lesson.style}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {lesson.videoUrl ? (
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video player</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{Number(lesson.duration)} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Instructor: {lesson.instructor}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
