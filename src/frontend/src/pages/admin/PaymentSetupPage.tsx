import { useState, useEffect } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSetupPage() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allowedCountries = countries.split(',').map((c) => c.trim()).filter(Boolean);
      await setConfig.mutateAsync({
        secretKey,
        allowedCountries,
      });
      toast.success('Stripe configuration saved successfully!');
      setSecretKey('');
    } catch (error: any) {
      toast.error('Failed to save configuration: ' + error.message);
    }
  };

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

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment Setup</h1>
        <p className="text-muted-foreground">Configure Stripe payment processing</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConfigured ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <Badge className="bg-green-500">Configured</Badge>
              </div>
            ) : (
              <Badge variant="secondary">Not Configured</Badge>
            )}
          </CardContent>
        </Card>

        {!isConfigured && (
          <Card>
            <CardHeader>
              <CardTitle>Configure Stripe</CardTitle>
              <CardDescription>
                Enter your Stripe secret key and allowed countries to enable payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Stripe Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your secret key from the Stripe dashboard
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countries">Allowed Countries</Label>
                  <Input
                    id="countries"
                    value={countries}
                    onChange={(e) => setCountries(e.target.value)}
                    placeholder="US,CA,GB"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated country codes (e.g., US,CA,GB)
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90"
                  disabled={setConfig.isPending}
                >
                  {setConfig.isPending ? 'Saving...' : 'Save Configuration'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
