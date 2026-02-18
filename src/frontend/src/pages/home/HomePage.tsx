import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Home, Cog, Sparkles, Award, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1920x800.png"
            alt="Laser cutting artworks showcase"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Creativity Meets
              <span className="block text-primary">Precision</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Specializing in laser cutting artworks that blend innovative design with advanced technology. 
              From customized gifts to elegant décor and industrial components, we bring contemporary designs to Pune.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/gallery">Explore Our Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We transform concepts into distinctive laser-cut creations that stand out
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Originality</CardTitle>
                <CardDescription>
                  Thoughtfully crafted designs using innovative ideas that bring your vision to life
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Durability</CardTitle>
                <CardDescription>
                  High-quality materials and advanced laser technology ensure long-lasting products
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flawless Finishing</CardTitle>
                <CardDescription>
                  Finely detailed products with precision cutting and perfect edges every time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Specializations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unique solutions for every need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Gift className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customized Gifts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Personalized wooden plaques, decorative frames, and unique gift items perfect for special occasions
                </p>
                <Button variant="link" asChild className="p-0">
                  <Link to="/gallery">View Gallery →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Home className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Home Décor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Elegant decorative pieces, geometric wall art, and ornamental designs that enhance any space
                </p>
                <Button variant="link" asChild className="p-0">
                  <Link to="/gallery">View Gallery →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cog className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Industrial Components</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Accurate mechanical parts, technical applications, and precision components for commercial use
                </p>
                <Button variant="link" asChild className="p-0">
                  <Link to="/gallery">View Gallery →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Bring Your Ideas to Life?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's create something unique together. Contact us for a consultation and quote.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
