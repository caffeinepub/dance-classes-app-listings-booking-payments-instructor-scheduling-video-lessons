import { useState } from 'react';
import { useGetCallerUserRole } from '../../hooks/useCallerRole';
import { useAssignCallerUserRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';
import { toast } from 'sonner';

export default function AdminRoleManagementPage() {
  const { data: currentRole } = useGetCallerUserRole();
  const assignRole = useAssignCallerUserRole();
  const [principalId, setPrincipalId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const principal = Principal.fromText(principalId);
      await assignRole.mutateAsync({ user: principal, role: selectedRole });
      toast.success('Role assigned successfully!');
      setPrincipalId('');
    } catch (error: any) {
      toast.error('Failed to assign role: ' + error.message);
    }
  };

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Role Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Current Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentRole || 'Loading...'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Role to User</CardTitle>
            <CardDescription>
              Grant or modify roles for other users by their Principal ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignRole} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal ID</Label>
                <Input
                  id="principal"
                  value={principalId}
                  onChange={(e) => setPrincipalId(e.target.value)}
                  placeholder="Enter user's Principal ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.user}>User</SelectItem>
                    <SelectItem value={UserRole.admin}>Admin</SelectItem>
                    <SelectItem value={UserRole.guest}>Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
                disabled={assignRole.isPending}
              >
                {assignRole.isPending ? 'Assigning...' : 'Assign Role'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
