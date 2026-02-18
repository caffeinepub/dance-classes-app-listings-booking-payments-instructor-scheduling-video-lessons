import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AppFooter() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'laserart-studio';

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">LaserArt Studio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Specializing in laser cutting artworks that blend creativity with precision. 
              Serving Pune with unique solutions for gifting, home décor, and industrial applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/gallery"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/services"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Pune, Maharashtra</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:info@laserart.studio" 
                  className="hover:text-primary transition-colors"
                >
                  info@laserart.studio
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:+919876543210" 
                  className="hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} LaserArt Studio. Built with</span>
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            Precision Crafted. Uniquely Designed.
          </div>
        </div>
      </div>
    </footer>
  );
}
