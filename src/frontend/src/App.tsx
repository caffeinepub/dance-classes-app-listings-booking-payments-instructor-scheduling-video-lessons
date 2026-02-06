import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import CatalogPage from './pages/catalog/CatalogPage';
import ClassDetailPage from './pages/catalog/ClassDetailPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import VideoLessonsPage from './pages/lessons/VideoLessonsPage';
import VideoLessonDetailPage from './pages/lessons/VideoLessonDetailPage';
import ManageLessonsPage from './pages/instructor/ManageLessonsPage';
import AdminRoleManagementPage from './pages/admin/AdminRoleManagementPage';
import PaymentSetupPage from './pages/admin/PaymentSetupPage';
import PaymentSuccessPage from './pages/payments/PaymentSuccessPage';
import PaymentFailurePage from './pages/payments/PaymentFailurePage';
import RoleGate from './components/auth/RoleGate';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
      {showProfileSetup && <ProfileSetupDialog />}
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
  classDetailRoute,
  myBookingsRoute,
  instructorDashboardRoute,
  videoLessonsRoute,
  videoLessonDetailRoute,
  manageLessonsRoute,
  adminRoleManagementRoute,
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
