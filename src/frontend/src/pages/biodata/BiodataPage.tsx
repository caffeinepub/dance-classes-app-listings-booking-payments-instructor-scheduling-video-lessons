export default function BiodataPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] bg-clip-text text-transparent">
            Biodata
          </h1>

          <div className="space-y-8">
            {/* Professional Summary Section */}
            <section className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border/50">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Professional Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Accomplished Bharatanatyam artist with 25 years of rigorous training and performance excellence. 
                An experienced and passionate educator, skilled in conducting classical and contemporary dance classes 
                across India and abroad. Expertise spans Bharatanatyam, Bollywood, Semi-Classical, and Indian Folk styles, 
                blending traditional discipline with modern creative expression to inspire learners of all ages.
              </p>
            </section>

            {/* Core Competencies Section */}
            <section className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border/50">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Core Competencies
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.65_0.19_35)] font-bold mt-1">•</span>
                  <div>
                    <span className="font-medium text-foreground">Classical Mastery:</span>
                    <span className="text-muted-foreground"> Deep knowledge of Bharatanatyam theory, technique, and performance.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.65_0.19_35)] font-bold mt-1">•</span>
                  <div>
                    <span className="font-medium text-foreground">Versatile Instruction:</span>
                    <span className="text-muted-foreground"> Proficient in teaching Bollywood, Semi-Classical, and Indian Folk dance forms.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.65_0.19_35)] font-bold mt-1">•</span>
                  <div>
                    <span className="font-medium text-foreground">Global Teaching Experience:</span>
                    <span className="text-muted-foreground"> Successfully led workshops and regular classes both in India and international locations.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.65_0.19_35)] font-bold mt-1">•</span>
                  <div>
                    <span className="font-medium text-foreground">Choreography:</span>
                    <span className="text-muted-foreground"> Skilled in composing original choreographies for stage productions, events, and cultural programs.</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
