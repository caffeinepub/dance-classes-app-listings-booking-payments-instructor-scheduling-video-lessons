import { useState, useMemo } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  style: string;
  categories: string[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Sujatha's teaching style is incredible! She breaks down complex movements into easy steps and makes every class enjoyable. My confidence has grown so much since I started learning Bharatnatyam with her.",
    name: "Priya Sharma",
    role: "Student",
    style: "Bharatnatyam",
    categories: ["Classical", "Beginner-Friendly"]
  },
  {
    id: 2,
    quote: "I've always wanted to learn Bollywood dance, and DanceHub made it possible. The online classes are convenient, and the instructor's energy is contagious. Highly recommend!",
    name: "Rahul Mehta",
    role: "Student",
    style: "Bollywood Fusion",
    categories: ["Bollywood", "Online Classes"]
  },
  {
    id: 3,
    quote: "The video lessons are a game-changer! I can practice at my own pace and revisit techniques whenever I need. The quality of instruction is top-notch.",
    name: "Anjali Patel",
    role: "Student",
    style: "Classical Fusion",
    categories: ["Video Lessons", "Self-Paced"]
  },
  {
    id: 4,
    quote: "As someone new to dance, I was nervous at first. But the welcoming environment and patient teaching made all the difference. I've found a new passion!",
    name: "Vikram Singh",
    role: "Beginner Student",
    style: "Indo Western",
    categories: ["Beginner-Friendly", "Contemporary"]
  },
  {
    id: 5,
    quote: "The semi-classical classes have helped me blend traditional and contemporary styles beautifully. Sujatha's expertise shines through in every session.",
    name: "Meera Reddy",
    role: "Intermediate Student",
    style: "Semi-classical",
    categories: ["Classical", "Contemporary"]
  },
  {
    id: 6,
    quote: "DanceHub has transformed my dance journey. The structured curriculum and personalized feedback have helped me progress faster than I ever imagined.",
    name: "Arjun Kumar",
    role: "Advanced Student",
    style: "Bharatnatyam",
    categories: ["Classical", "Advanced"]
  }
];

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories from testimonials
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    testimonials.forEach(testimonial => {
      testimonial.categories.forEach(category => categorySet.add(category));
    });
    return ['All', ...Array.from(categorySet).sort()];
  }, []);

  // Filter testimonials based on selected category
  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === 'All') {
      return testimonials;
    }
    return testimonials.filter(testimonial =>
      testimonial.categories.includes(selectedCategory)
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] bg-clip-text text-transparent">
            What Our Students Say
          </h1>
          <p className="text-lg text-muted-foreground">
            Hear from dancers who have transformed their passion into skill with DanceHub
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div
            role="group"
            aria-label="Filter testimonials by category"
            className="flex flex-wrap gap-2 justify-center"
          >
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.19_35)] focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] text-white shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-border/50 hover:border-[oklch(0.65_0.19_35)]/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <Quote className="h-8 w-8 text-[oklch(0.65_0.19_35)] opacity-50" />
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{testimonial.role}</span>
                      <span>•</span>
                      <span className="text-[oklch(0.65_0.19_35)]">{testimonial.style}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No testimonials found for this category.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-[oklch(0.65_0.19_35)]/10 to-[oklch(0.55_0.15_25)]/10 rounded-2xl p-8 md:p-12 border border-[oklch(0.65_0.19_35)]/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Dance Journey?</h2>
            <p className="text-muted-foreground mb-6">
              Join our community of passionate dancers and discover your potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Browse Classes
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[oklch(0.65_0.19_35)] text-[oklch(0.65_0.19_35)] font-medium hover:bg-[oklch(0.65_0.19_35)]/10 transition-colors"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
