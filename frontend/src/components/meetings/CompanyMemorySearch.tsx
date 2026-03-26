'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Meeting, ActionItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Search,
  FileText,
  CheckSquare,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface SearchResult {
  meetings: Meeting[];
  actionItems: ActionItem[];
  query: string;
  totalMeetings: number;
  totalActionItems: number;
}

export function CompanyMemorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get('/meetings/search', {
        params: { q: query.trim(), limit: 10 },
      });
      setResults(res.data.data);
    } catch {
      setResults({
        meetings: [],
        actionItems: [],
        query,
        totalMeetings: 0,
        totalActionItems: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const suggestedQueries = [
    'Q4 planning',
    'decisions about hiring',
    'action items for engineering',
    'budget discussions',
    'product roadmap',
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Company Memory Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all meetings, transcripts, and action items..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={performSearch} disabled={loading || query.trim().length < 2}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Suggested Queries */}
        {!hasSearched && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setQuery(q);
                    performSearch();
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Found {results.totalMeetings} meetings</span>
              <span>•</span>
              <span>{results.totalActionItems} action items</span>
            </div>

            {/* Meetings */}
            {results.meetings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Meetings
                </h4>
                {results.meetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/meetings/${meeting._id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{meeting.title}</p>
                        {meeting.summary && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {meeting.summary.substring(0, 150)}...
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(meeting.createdAt), { addSuffix: true })}
                          </Badge>
                          {meeting.quality && (
                            <Badge className="text-xs bg-primary/10 text-primary">
                              Quality: {meeting.quality.overallScore}
                            </Badge>
                          )}
                          {meeting.decisions && meeting.decisions.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {meeting.decisions.length} decisions
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Items */}
            {results.actionItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Action Items
                </h4>
                {results.actionItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      if (typeof item.meeting !== 'string') {
                        router.push(`/meetings/${item.meeting._id}`);
                      } else {
                        router.push(`/meetings/${item.meeting}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : item.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {item.priority}
                          </Badge>
                          {item.assignee && (
                            <Badge variant="outline" className="text-xs">
                              {item.assignee}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {results.meetings.length === 0 && results.actionItems.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No results found for &ldquo;{results.query}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
