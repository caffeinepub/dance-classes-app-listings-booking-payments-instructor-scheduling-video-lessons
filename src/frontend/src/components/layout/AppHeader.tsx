import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useIsCallerAdmin } from '../../hooks/useCallerRole';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar, Video, Settings, UserPlus, Users, MessageSquare, Quote, FileText } from 'lucide-react';
import { useState } from 'react';

export default function AppHeader() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isInstructor = userProfile?.role === 'instructor' || userProfile?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/dance-logo.dim_512x512.png" alt="Dance Classes" className="h-10 w-10" />
            <span className="font-bold text-xl bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] bg-clip-text text-transparent">
              DanceHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link to="/">Classes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/lessons">Video Lessons</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/biodata">Biodata</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/testimonials">Testimonials</Link>
            </Button>
            {!isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/my-bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  My Bookings
                </Link>
              </Button>
            )}
            {isInstructor && (
              <Button variant="ghost" asChild>
                <Link to="/instructor/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin/registrations">
                  <Users className="h-4 w-4 mr-2" />
                  Registrations
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin/inquiries">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Inquiries
                </Link>
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{userProfile.name}</span>
            </div>
          )}
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={!isAuthenticated ? 'bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90' : ''}
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Classes</Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/lessons" onClick={() => setMobileMenuOpen(false)}>
                <Video className="h-4 w-4 mr-2" />
                Video Lessons
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/biodata" onClick={() => setMobileMenuOpen(false)}>
                <FileText className="h-4 w-4 mr-2" />
                Biodata
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/testimonials" onClick={() => setMobileMenuOpen(false)}>
                <Quote className="h-4 w-4 mr-2" />
                Testimonials
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  My Bookings
                </Link>
              </Button>
            )}
            {isInstructor && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/instructor/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/admin/registrations" onClick={() => setMobileMenuOpen(false)}>
                  <Users className="h-4 w-4 mr-2" />
                  Registrations
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/admin/inquiries" onClick={() => setMobileMenuOpen(false)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Inquiries
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
