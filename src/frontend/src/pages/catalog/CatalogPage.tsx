import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllDanceClasses } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, DollarSign } from 'lucide-react';
import { CLASS_LEVELS } from '../../constants/classLevels';
import { DANCE_STYLES } from '../../constants/danceStyles';

export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useGetAllDanceClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = styleFilter === 'all' || cls.style === styleFilter;
      const matchesLevel = levelFilter === 'all' || cls.level === levelFilter;
      return matchesSearch && matchesStyle && matchesLevel;
    });
  }, [classes, searchQuery, styleFilter, levelFilter]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/generated/dance-hero.dim_1600x600.png"
            alt="Dance"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Rhythm
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join our vibrant community and explore dance classes for every style and skill level.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {DANCE_STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {CLASS_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No classes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card
                key={cls.id.toString()}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate({ to: '/class/$classId', params: { classId: cls.id.toString() } })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="group-hover:text-[oklch(0.65_0.19_35)] transition-colors">
                      {cls.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{cls.style}</Badge>
                    <Badge variant="outline">{cls.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {cls.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Number(cls.duration)} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${Number(cls.price)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
