import { Heart } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Empowering dancers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
