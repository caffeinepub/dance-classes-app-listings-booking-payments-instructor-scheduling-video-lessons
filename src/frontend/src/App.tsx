import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { useGetUserBookings } from './hooks/useQueries';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import BookingReminderChecker from './components/bookings/BookingReminderChecker';
import CatalogPage from './pages/catalog/CatalogPage';
import ClassDetailPage from './pages/catalog/ClassDetailPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import VideoLessonsPage from './pages/lessons/VideoLessonsPage';
import VideoLessonDetailPage from './pages/lessons/VideoLessonDetailPage';
import ManageLessonsPage from './pages/instructor/ManageLessonsPage';
import AdminRoleManagementPage from './pages/admin/AdminRoleManagementPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import PaymentSetupPage from './pages/admin/PaymentSetupPage';
import PaymentSuccessPage from './pages/payments/PaymentSuccessPage';
import PaymentFailurePage from './pages/payments/PaymentFailurePage';
import RegisterPage from './pages/auth/RegisterPage';
import ContactPage from './pages/contact/ContactPage';
import TestimonialsPage from './pages/testimonials/TestimonialsPage';
import BiodataPage from './pages/biodata/BiodataPage';
import RoleGate from './components/auth/RoleGate';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: bookings = [] } = useGetUserBookings();
  const isAuthenticated = !!identity;
  
  // Don't show profile setup on the register page (it handles it internally)
  const isRegisterPage = location.pathname === '/register';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null && !isRegisterPage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
      {showProfileSetup && <ProfileSetupDialog />}
      {isAuthenticated && bookings.map((booking) => (
        <BookingReminderChecker key={booking.id.toString()} booking={booking} />
      ))}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const biodataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/biodata',
  component: BiodataPage,
});

const classDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/class/$classId',
  component: ClassDetailPage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bookings',
  component: MyBookingsPage,
});

const instructorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/instructor/dashboard',
  component: () => (
    <RoleGate requiredRole="instructor">
      <InstructorDashboardPage />
    </RoleGate>
  ),
});

const videoLessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons',
  component: VideoLessonsPage,
});

const videoLessonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons/$lessonId',
  component: VideoLessonDetailPage,
});

const manageLessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/instructor/lessons',
  component: () => (
    <RoleGate requiredRole="instructor">
      <ManageLessonsPage />
    </RoleGate>
  ),
});

const adminRoleManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: () => (
    <RoleGate requiredRole="admin">
      <AdminRoleManagementPage />
    </RoleGate>
  ),
});

const adminRegistrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/registrations',
  component: () => (
    <RoleGate requiredRole="admin">
      <AdminRegistrationsPage />
    </RoleGate>
  ),
});

const adminInquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/inquiries',
  component: () => (
    <RoleGate requiredRole="admin">
      <AdminInquiriesPage />
    </RoleGate>
  ),
});

const paymentSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/payment-setup',
  component: () => (
    <RoleGate requiredRole="admin">
      <PaymentSetupPage />
    </RoleGate>
  ),
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  contactRoute,
  testimonialsRoute,
  biodataRoute,
  classDetailRoute,
  myBookingsRoute,
  instructorDashboardRoute,
  videoLessonsRoute,
  videoLessonDetailRoute,
  manageLessonsRoute,
  adminRoleManagementRoute,
  adminRegistrationsRoute,
  adminInquiriesRoute,
  paymentSetupRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
