import { useGetAllUsers } from '../../hooks/useQueries';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminRegistrationsContent() {
  const { data: users = [], isLoading, error } = useGetAllUsers();

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading registrations...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load registrations. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'instructor':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)]">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">User Registrations</CardTitle>
              <CardDescription>
                View and manage all registered users ({users.length} total)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No registrations yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Users will appear here once they complete registration.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="font-mono text-xs">Principal ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(([principal, profile]) => (
                    <TableRow key={principal.toString()}>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell>
                        {profile.email || (
                          <span className="text-muted-foreground italic">Not provided</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(profile.role)}>
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-xs truncate" title={principal.toString()}>
                        {principal.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminRegistrationsPage() {
  return (
    <RoleGate requiredRole="admin">
      <AdminRegistrationsContent />
    </RoleGate>
  );
}
