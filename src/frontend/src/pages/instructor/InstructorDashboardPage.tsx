import { useState } from 'react';
import { useGetAllDanceClasses } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Video } from 'lucide-react';
import SessionEditorDialog from '../../components/sessions/SessionEditorDialog';
import ClassEditorDialog from '../../components/classes/ClassEditorDialog';

export default function InstructorDashboardPage() {
  const { data: classes = [], isLoading } = useGetAllDanceClasses();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showClassDialog, setShowClassDialog] = useState(false);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Manage your classes and sessions</p>
      </div>

      <Tabs defaultValue="classes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Dance Classes</h2>
            <Button onClick={() => setShowClassDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
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
          ) : classes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No classes yet</h3>
                <p className="text-muted-foreground mb-6">Create your first dance class to get started!</p>
                <Button onClick={() => setShowClassDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card key={cls.id.toString()}>
                  <CardHeader>
                    <CardTitle>{cls.title}</CardTitle>
                    <CardDescription>{cls.style} • {cls.level}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {cls.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{Number(cls.duration)} min</span>
                      <span className="font-semibold">${Number(cls.price)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Class Sessions</h2>
            <Button onClick={() => setShowSessionDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Session Management</h3>
              <p className="text-muted-foreground mb-6">
                Schedule sessions for your classes and manage bookings
              </p>
              <Button onClick={() => setShowSessionDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showSessionDialog && (
        <SessionEditorDialog
          open={showSessionDialog}
          onClose={() => setShowSessionDialog(false)}
          classes={classes}
        />
      )}

      {showClassDialog && (
        <ClassEditorDialog
          open={showClassDialog}
          onClose={() => setShowClassDialog(false)}
        />
      )}
    </div>
  );
}
