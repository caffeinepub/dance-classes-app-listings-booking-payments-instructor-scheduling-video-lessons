import { useState } from 'react';
import { useSubmitContactInquiry } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitInquiry = useSubmitContactInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');

    // Validate required fields
    if (!name.trim()) {
      setErrorMessage('Name is required');
      setShowError(true);
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Message is required');
      setShowError(true);
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
      });

      // Clear form and show success
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit inquiry. Please try again.');
      setShowError(true);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our classes or want to learn more? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {showSuccess && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Thank you for your message! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like to know..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitInquiry.isPending}
                >
                  {submitInquiry.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  You can also reach us directly through the following channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[oklch(0.65_0.19_35)] mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href="mailto:jayakumarsujatha@gmail.com"
                      className="text-muted-foreground hover:text-[oklch(0.65_0.19_35)] transition-colors break-all"
                    >
                      jayakumarsujatha@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[oklch(0.65_0.19_35)] mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">
                      Available for online and in-person classes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Our Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center gap-4">
                  <img
                    src="/assets/generated/sujatha-portrait-v2.dim_512x512.png"
                    alt="Sujatha Jagan"
                    className="w-32 h-32 rounded-full object-cover border-2 border-[oklch(0.65_0.19_35)]"
                  />
                  <div>
                    <div className="font-semibold text-lg">Sujatha Jagan</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Passionate dance instructor with years of experience in classical and contemporary styles.
                      Dedicated to helping students discover the joy of movement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
