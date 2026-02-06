import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, AlertCircle } from 'lucide-react';
import type { UserProfile } from '../../backend';
import { toast } from 'sonner';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const saveProfile = useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.refetchQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Registration complete! Welcome to DanceHub.');
      onSuccess();
    },
    onError: (error) => {
      toast.error('Failed to create profile: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Name is required');
      return;
    }

    saveProfile.mutate({
      name: trimmedName,
      email: email.trim(),
      role: 'student',
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)]">
          <UserPlus className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
        <CardDescription className="text-base mt-2">
          Please provide your details to finish setting up your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError('');
              }}
              placeholder="Enter your full name"
              required
              disabled={saveProfile.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={saveProfile.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
            disabled={saveProfile.isPending}
            size="lg"
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Complete Registration'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By registering, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
