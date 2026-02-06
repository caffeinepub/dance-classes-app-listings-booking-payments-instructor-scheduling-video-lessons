import { useState } from 'react';
import { useUploadVideoLesson } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { VideoLesson } from '../../backend';
import { toast } from 'sonner';

interface LessonEditorDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LessonEditorDialog({ open, onClose }: LessonEditorDialogProps) {
  const uploadLesson = useUploadVideoLesson();
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('30');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLesson: VideoLesson = {
        id: BigInt(0),
        title,
        style,
        instructor,
        duration: BigInt(duration),
        videoUrl,
      };

      await uploadLesson.mutateAsync(newLesson);
      toast.success('Video lesson created successfully!');
      onClose();
      setTitle('');
      setStyle('');
      setInstructor('');
      setDuration('30');
      setVideoUrl('');
    } catch (error: any) {
      toast.error('Failed to create lesson: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Video Lesson</DialogTitle>
          <DialogDescription>Create a new video lesson for your library</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Salsa Basic Steps"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Style *</Label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Salsa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor *</Label>
            <Input
              id="instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Instructor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL *</Label>
            <Input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/embed/..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Use an embeddable video URL (YouTube, Vimeo, etc.)
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
            disabled={uploadLesson.isPending}
          >
            {uploadLesson.isPending ? 'Creating...' : 'Create Lesson'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
