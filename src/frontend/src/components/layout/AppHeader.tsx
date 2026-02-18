import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, Scissors } from 'lucide-react';
import { useState } from 'react';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Scissors className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-foreground">
                LaserArt Studio
              </span>
              <span className="text-xs text-muted-foreground">Pune</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/gallery">Gallery</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/services">Services</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden md:inline-flex">
            <Link to="/contact">Get a Quote</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </Button>
            <Button asChild className="mt-2">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Get a Quote
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
