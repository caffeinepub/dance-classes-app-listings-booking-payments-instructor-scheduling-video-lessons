import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type Category = 'gifts' | 'decor' | 'industrial';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
}

const products: Product[] = [
  {
    id: '1',
    title: 'Personalized Wooden Plaques',
    description: 'Custom engraved wooden plaques perfect for awards, nameplates, and commemorative gifts',
    image: '/assets/generated/gift-showcase.dim_800x600.png',
    category: 'gifts',
  },
  {
    id: '2',
    title: 'Decorative Photo Frames',
    description: 'Intricate laser-cut frames with unique patterns and designs for your cherished memories',
    image: '/assets/generated/gift-showcase.dim_800x600.png',
    category: 'gifts',
  },
  {
    id: '3',
    title: 'Geometric Wall Art',
    description: 'Modern geometric designs that add contemporary elegance to any interior space',
    image: '/assets/generated/decor-showcase.dim_800x600.png',
    category: 'decor',
  },
  {
    id: '4',
    title: 'Ornamental Panels',
    description: 'Decorative panels with intricate patterns perfect for room dividers and accent walls',
    image: '/assets/generated/decor-showcase.dim_800x600.png',
    category: 'decor',
  },
  {
    id: '5',
    title: 'Precision Mechanical Parts',
    description: 'High-accuracy components for machinery and industrial applications',
    image: '/assets/generated/industrial-showcase.dim_800x600.png',
    category: 'industrial',
  },
  {
    id: '6',
    title: 'Technical Components',
    description: 'Custom-designed parts for prototyping and commercial manufacturing',
    image: '/assets/generated/industrial-showcase.dim_800x600.png',
    category: 'industrial',
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our portfolio of laser-cut creations across different categories
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveCategory(value as Category | 'all')}>
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="gifts">Gifts</TabsTrigger>
          <TabsTrigger value="decor">Décor</TabsTrigger>
          <TabsTrigger value="industrial">Industrial</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{product.title}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
