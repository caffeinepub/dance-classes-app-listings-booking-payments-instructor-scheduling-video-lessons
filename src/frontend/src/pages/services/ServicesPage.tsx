import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Home, Cog, Check } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive laser cutting solutions tailored to your needs
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Gifting Solutions */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="order-2 md:order-1">
              <CardHeader className="pb-4">
                <Gift className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Gifting Solutions</CardTitle>
                <CardDescription className="text-base">
                  Personalized gifts that leave a lasting impression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Create memorable moments with our custom laser-cut gifts. Perfect for weddings, anniversaries, 
                  corporate events, and special occasions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Personalized wooden plaques and nameplates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom engraved photo frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unique decorative gift boxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Corporate awards and trophies</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link to="/gallery">View Gift Examples</Link>
                </Button>
              </CardContent>
            </div>
            <div className="order-1 md:order-2 h-64 md:h-auto">
              <img
                src="/assets/generated/gift-showcase.dim_800x600.png"
                alt="Customized gift examples"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Card>

        {/* Home Décor */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="h-64 md:h-auto">
              <img
                src="/assets/generated/decor-showcase.dim_800x600.png"
                alt="Home décor examples"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <CardHeader className="pb-4">
                <Home className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Home Décor</CardTitle>
                <CardDescription className="text-base">
                  Elegant pieces that transform your living spaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Enhance your interior design with our contemporary laser-cut decorative pieces. 
                  From wall art to functional décor, we create pieces that complement any aesthetic.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Geometric wall art and panels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Decorative room dividers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Ornamental shelving and brackets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom lighting fixtures and lampshades</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link to="/gallery">View Décor Examples</Link>
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Industrial Applications */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="order-2 md:order-1">
              <CardHeader className="pb-4">
                <Cog className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Industrial Applications</CardTitle>
                <CardDescription className="text-base">
                  Precision components for commercial and technical needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our industrial laser cutting services deliver the accuracy and consistency required for 
                  manufacturing, prototyping, and commercial applications.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Precision mechanical parts and components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Prototyping and small-batch production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom gaskets and seals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Technical signage and labels</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link to="/gallery">View Industrial Examples</Link>
                </Button>
              </CardContent>
            </div>
            <div className="order-1 md:order-2 h-64 md:h-auto">
              <img
                src="/assets/generated/industrial-showcase.dim_800x600.png"
                alt="Industrial component examples"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <Card className="bg-muted/50">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need a custom gift, decorative piece, or industrial component, 
              we're here to bring your vision to life with precision and creativity.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
