import { ReactNode } from 'react';
import { useGetCallerUserRole } from '../../hooks/useCallerRole';
import { UserRole } from '../../backend';
import AccessDeniedScreen from './AccessDeniedScreen';

interface RoleGateProps {
  children: ReactNode;
  requiredRole: 'instructor' | 'admin';
}

export default function RoleGate({ children, requiredRole }: RoleGateProps) {
  const { data: userRole, isLoading } = useGetCallerUserRole();

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Admin has access to everything
  if (userRole === UserRole.admin) {
    return <>{children}</>;
  }

  // For instructor role requirement, only admin can access (since there's no separate instructor role in the enum)
  // For admin role requirement, only admin can access
  const hasAccess = false; // Non-admins don't have access to protected routes

  if (!hasAccess) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
