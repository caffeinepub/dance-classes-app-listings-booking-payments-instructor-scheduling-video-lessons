import { useState } from 'react';
import { useCreateDanceClass } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DanceClass } from '../../backend';
import { toast } from 'sonner';
import { CLASS_LEVELS } from '../../constants/classLevels';
import { DANCE_STYLES } from '../../constants/danceStyles';

interface ClassEditorDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ClassEditorDialog({ open, onClose }: ClassEditorDialogProps) {
  const createClass = useCreateDanceClass();
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('60');
  const [price, setPrice] = useState('25');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!level) {
      toast.error('Please select a level');
      return;
    }

    if (!style) {
      toast.error('Please select a style');
      return;
    }

    try {
      const newClass: DanceClass = {
        id: BigInt(0),
        title,
        style,
        level,
        description,
        instructor,
        duration: BigInt(duration),
        price: BigInt(price),
      };

      await createClass.mutateAsync(newClass);
      toast.success('Class created successfully!');
      onClose();
      setTitle('');
      setStyle('');
      setLevel('');
      setDescription('');
      setInstructor('');
      setDuration('60');
      setPrice('25');
    } catch (error: any) {
      toast.error('Failed to create class: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Add a new dance class to your catalog</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Beginner Bharatnatyam"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style *</Label>
              <Select value={style} onValueChange={setStyle} required>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {DANCE_STYLES.map((styleOption) => (
                    <SelectItem key={styleOption} value={styleOption}>
                      {styleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_LEVELS.map((levelOption) => (
                    <SelectItem key={levelOption} value={levelOption}>
                      {levelOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the class..."
              rows={3}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
            disabled={createClass.isPending}
          >
            {createClass.isPending ? 'Creating...' : 'Create Class'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
