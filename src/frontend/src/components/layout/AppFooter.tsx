import { Heart, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2026. Built with</span>
              <Heart className="h-4 w-4 fill-[oklch(0.65_0.19_35)] text-[oklch(0.65_0.19_35)]" />
              <span>using</span>
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-[oklch(0.65_0.19_35)] transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>Empowering dancers worldwide</span>
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                to="/biodata"
                className="font-medium text-foreground hover:text-[oklch(0.65_0.19_35)] transition-colors"
              >
                Biodata
              </Link>
              <Link
                to="/contact"
                className="font-medium text-foreground hover:text-[oklch(0.65_0.19_35)] transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/testimonials"
                className="font-medium text-foreground hover:text-[oklch(0.65_0.19_35)] transition-colors"
              >
                Testimonials
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img 
              src="/assets/generated/sujatha-portrait-v2.dim_512x512.png" 
              alt="Sujatha Jagan - Dance Instructor"
              className="w-24 h-24 rounded-full object-cover border-2 border-[oklch(0.65_0.19_35)]"
            />
            <div className="flex flex-col gap-3 max-w-md">
              <div className="font-medium text-foreground text-base">Sujatha Jagan</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Passionate dance instructor with years of experience in classical and contemporary styles. 
                Dedicated to helping students discover the joy of movement and express themselves through dance.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:jayakumarsujatha@gmail.com" 
                  className="hover:text-[oklch(0.65_0.19_35)] transition-colors"
                >
                  jayakumarsujatha@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
