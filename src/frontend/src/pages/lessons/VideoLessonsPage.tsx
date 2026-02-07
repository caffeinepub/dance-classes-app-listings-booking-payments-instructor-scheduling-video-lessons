import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllVideoLessons } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, Video } from 'lucide-react';
import { DANCE_STYLE_OPTIONS } from '../../constants/danceStyles';
import StyleFilteredResultsSummary from '../../components/search/StyleFilteredResultsSummary';

export default function VideoLessonsPage() {
  const navigate = useNavigate();
  const { data: lessons = [], isLoading } = useGetAllVideoLessons();
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<string>('all');

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = styleFilter === 'all' || lesson.style === styleFilter;
      return matchesSearch && matchesStyle;
    });
  }, [lessons, searchQuery, styleFilter]);

  const selectedStyleLabel = useMemo(() => {
    if (styleFilter === 'all') return 'All Styles';
    const option = DANCE_STYLE_OPTIONS.find(opt => opt.value === styleFilter);
    return option?.label || styleFilter;
  }, [styleFilter]);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Video Lessons</h1>
        <p className="text-muted-foreground">Learn at your own pace with our on-demand video library</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
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
              {DANCE_STYLE_OPTIONS.map((styleOption) => (
                <SelectItem key={styleOption.value} value={styleOption.value}>
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">{styleOption.label}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {styleOption.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isLoading && (
          <StyleFilteredResultsSummary
            selectedStyle={styleFilter}
            selectedStyleLabel={selectedStyleLabel}
            resultCount={filteredLessons.length}
            itemType="lessons"
            onClearFilter={() => setStyleFilter('all')}
          />
        )}
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
                <div className="h-40 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No video lessons found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card
              key={lesson.id.toString()}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate({ to: '/lessons/$lessonId', params: { lessonId: lesson.id.toString() } })}
            >
              <CardHeader>
                <CardTitle className="group-hover:text-[oklch(0.65_0.19_35)] transition-colors">
                  {lesson.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{lesson.style}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Number(lesson.duration)} min</span>
                  </div>
                  <span>by {lesson.instructor}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-[oklch(0.65_0.19_35)] to-[oklch(0.55_0.15_25)] hover:opacity-90">
                  Watch Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
