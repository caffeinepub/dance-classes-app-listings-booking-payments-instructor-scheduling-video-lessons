import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Zap, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LaserArt Studio</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Transforming concepts into distinctive laser-cut creations that stand out
          </p>
        </div>

        {/* Company Story */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At LaserArt Studio, we specialize in laser cutting artworks that blend creativity with precision. 
                Our designs are thoughtfully crafted using innovative ideas and advanced laser technology to deliver 
                high-quality, finely detailed products.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From customized gifts and elegant decorative pieces to accurate industrial components, we bring 
                new and contemporary designs to the Pune market. With a strong focus on originality, durability, 
                and flawless finishing, we transform your vision into reality.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src="/assets/generated/laser-process.dim_1200x800.png"
                alt="Advanced laser cutting process"
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Advanced Laser Cutting</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We utilize state-of-the-art laser cutting technology that ensures precision down to the finest detail. 
                Our equipment allows us to work with various materials including wood, acrylic, metal, and more.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The precision of laser cutting enables us to create intricate patterns and designs that would be 
                impossible with traditional cutting methods, ensuring every piece meets our high standards.
              </p>
            </div>
          </div>
        </section>

        {/* Workshop Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Workshop</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4">Where Magic Happens</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our workshop in Pune is equipped with cutting-edge laser cutting machines and a dedicated team 
                of skilled craftspeople who bring designs to life with meticulous attention to detail.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every project, whether it's a personalized gift or an industrial component, receives the same 
                level of care and precision that has become our hallmark.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/assets/generated/workshop-photo.dim_1200x800.png"
                alt="LaserArt Studio workshop with laser cutting equipment"
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Originality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We pride ourselves on creating unique, innovative designs that reflect your personal style 
                  and vision. No two pieces are exactly alike.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Durability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Using premium materials and advanced techniques, we ensure every product is built to last, 
                  maintaining its beauty and functionality for years to come.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Flawless Finishing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our commitment to perfection means every edge is smooth, every detail is crisp, and every 
                  piece meets our exacting standards before it reaches you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Serving Pune</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As a proud Pune-based business, we're dedicated to bringing contemporary, high-quality 
                  laser-cut designs to our local community and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission Statement */}
        <section>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed opacity-90">
                To transform concepts into distinctive laser-cut creations that stand out, combining innovative 
                design with precision craftsmanship to deliver products that exceed expectations in quality, 
                originality, and durability.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
