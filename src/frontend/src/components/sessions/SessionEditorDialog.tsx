import { useState } from 'react';
import { useCreateSession } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DanceClass, Session } from '../../backend';
import { toast } from 'sonner';

interface SessionEditorDialogProps {
  open: boolean;
  onClose: () => void;
  classes: DanceClass[];
}

export default function SessionEditorDialog({ open, onClose, classes }: SessionEditorDialogProps) {
  const createSession = useCreateSession();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [location, setLocation] = useState('');
  const [onlineLink, setOnlineLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error('Please select a class');
      return;
    }

    try {
      const selectedClass = classes.find((c) => c.id.toString() === selectedClassId);
      if (!selectedClass) {
        toast.error('Selected class not found');
        return;
      }

      const dateTime = new Date(`${date}T${time}`);
      const startTime = BigInt(dateTime.getTime() * 1000000);

      const newSession: Session = {
        id: BigInt(0),
        classId: selectedClass.id,
        instructor: selectedClass.instructor,
        startTime,
        duration: selectedClass.duration,
        capacity: BigInt(capacity),
        location,
        onlineLink,
      };

      await createSession.mutateAsync(newSession);
      toast.success('Session created successfully!');
      onClose();
    } catch (error: any) {
      toast.error('Failed to create session: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
          <DialogDescription>Create a new class session for students to book</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class *</Label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id.toString()} value={cls.id.toString()}>
                    {cls.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Studio address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onlineLink">Online Link</Label>
            <Input
              id="onlineLink"
              value={onlineLink}
              onChange={(e) => setOnlineLink(e.target.value)}
              placeholder="Zoom/Meet link"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
            disabled={createSession.isPending}
          >
            {createSession.isPending ? 'Creating...' : 'Create Session'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
