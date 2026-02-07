import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface StyleFilteredResultsSummaryProps {
  selectedStyle: string;
  selectedStyleLabel: string;
  resultCount: number;
  itemType: 'classes' | 'lessons';
  onClearFilter: () => void;
}

export default function StyleFilteredResultsSummary({
  selectedStyle,
  selectedStyleLabel,
  resultCount,
  itemType,
  onClearFilter,
}: StyleFilteredResultsSummaryProps) {
  const isFiltered = selectedStyle !== 'all';

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-medium">
          {isFiltered ? (
            <>
              Showing <span className="font-bold text-[oklch(0.65_0.19_35)]">{resultCount}</span> {itemType} for{' '}
              <span className="font-bold">{selectedStyleLabel}</span>
            </>
          ) : (
            <>
              Showing <span className="font-bold text-[oklch(0.65_0.19_35)]">{resultCount}</span> {itemType}
            </>
          )}
        </p>
        {isFiltered && (
          <Badge variant="secondary" className="gap-1">
            {selectedStyleLabel}
          </Badge>
        )}
      </div>
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="h-8 gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear filter
        </Button>
      )}
    </div>
  );
}
