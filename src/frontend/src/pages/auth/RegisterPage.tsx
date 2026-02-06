import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, CheckCircle, ArrowRight } from 'lucide-react';
import RegistrationForm from '../../components/auth/RegistrationForm';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const showRegistrationForm = isAuthenticated && !profileLoading && isFetched && userProfile === null && !registrationComplete;
  const isAlreadyRegistered = isAuthenticated && userProfile !== null;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to sign in. Please try again.');
      if (error.message === 'User is already authenticated') {
        window.location.reload();
      }
    }
  };

  const handleRegistrationSuccess = () => {
    setRegistrationComplete(true);
  };

  if (isLoggingIn || (isAuthenticated && profileLoading)) {
    return (
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAlreadyRegistered || registrationComplete) {
    return (
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">
              {registrationComplete ? 'Registration Complete!' : "You're Already Registered!"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {registrationComplete 
                ? "Your account is all set up. Start exploring dance classes and book your first session!"
                : `Welcome back, ${userProfile?.name}! Your account is all set up.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate({ to: '/' })}
                className="flex-1 bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
              >
                Browse Classes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate({ to: '/my-bookings' })}
                variant="outline"
                className="flex-1"
              >
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showRegistrationForm) {
    return (
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)]">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl">Register for DanceHub</CardTitle>
          <CardDescription className="text-base mt-2">
            Join our community and start your dance journey today!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="font-semibold mb-2">What is Internet Identity?</h3>
              <p className="text-sm text-muted-foreground">
                Internet Identity is a secure, privacy-focused authentication system. 
                It allows you to sign in without passwords using your device's biometric 
                authentication (fingerprint, face recognition) or security key.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Registration Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click "Sign In with Internet Identity" below</li>
                <li>Create or use your existing Internet Identity</li>
                <li>Complete your profile with your name and email</li>
                <li>Start booking dance classes!</li>
              </ol>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
            size="lg"
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In with Internet Identity'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By registering, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
