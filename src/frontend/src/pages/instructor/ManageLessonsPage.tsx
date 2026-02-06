import { useState } from 'react';
import { useGetAllVideoLessons } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video } from 'lucide-react';
import LessonEditorDialog from '../../components/lessons/LessonEditorDialog';

export default function ManageLessonsPage() {
  const { data: lessons = [], isLoading } = useGetAllVideoLessons();
  const [showLessonDialog, setShowLessonDialog] = useState(false);

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Video Lessons</h1>
          <p className="text-muted-foreground">Create and manage your video lesson library</p>
        </div>
        <Button onClick={() => setShowLessonDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No video lessons yet</h3>
            <p className="text-muted-foreground mb-6">Create your first video lesson to get started!</p>
            <Button onClick={() => setShowLessonDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id.toString()}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.style}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{Number(lesson.duration)} min</span>
                  <span>{lesson.instructor}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showLessonDialog && (
        <LessonEditorDialog
          open={showLessonDialog}
          onClose={() => setShowLessonDialog(false)}
        />
      )}
    </div>
  );
}
