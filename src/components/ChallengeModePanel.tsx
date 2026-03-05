import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Clock, Zap } from 'lucide-react';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  targetArray: number[];
  goal: string;
  type: 'search' | 'sort';
  targetValue?: number;
  maxComparisons: number;
  stars3: number; // comparisons for 3 stars
  stars2: number; // comparisons for 2 stars
}

export const CHALLENGES: Challenge[] = [
  {
    id: 1, title: 'The Hunt Begins', type: 'search',
    description: 'Find value 23 using Linear Search with minimum comparisons.',
    targetArray: [8, 15, 3, 23, 42, 16, 7], targetValue: 23,
    goal: 'Find 23', maxComparisons: 7, stars3: 4, stars2: 5,
  },
  {
    id: 2, title: 'Binary Precision', type: 'search',
    description: 'Sort the list first, then find 16 with Binary Search.',
    targetArray: [42, 8, 16, 3, 23, 7, 15], targetValue: 16,
    goal: 'Find 16 (sort first!)', maxComparisons: 3, stars3: 3, stars2: 4,
  },
  {
    id: 3, title: 'Bubble Trouble', type: 'sort',
    description: 'Sort this nearly-sorted list using Bubble Sort.',
    targetArray: [1, 3, 2, 5, 4, 7, 6],
    goal: 'Sort the list', maxComparisons: 21, stars3: 15, stars2: 18,
  },
  {
    id: 4, title: 'Selection Day', type: 'sort',
    description: 'Sort using Selection Sort. Can you predict the comparisons?',
    targetArray: [29, 10, 14, 37, 13],
    goal: 'Sort the list', maxComparisons: 10, stars3: 10, stars2: 12,
  },
  {
    id: 5, title: 'Insert Order', type: 'sort',
    description: 'Sort this reversed list with Insertion Sort.',
    targetArray: [50, 40, 30, 20, 10],
    goal: 'Sort the list', maxComparisons: 10, stars3: 10, stars2: 12,
  },
];

interface ChallengeModePanelProps {
  onStartChallenge: (challenge: Challenge) => void;
  completedChallenges: Record<number, { stars: number; comparisons: number; time: number }>;
}

const ChallengeModePanel = ({ onStartChallenge, completedChallenges }: ChallengeModePanelProps) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-neon-yellow" />
        <h3 className="font-display text-sm neon-text-cyan uppercase tracking-wider">Challenge Mode</h3>
      </div>

      <div className="space-y-2">
        {CHALLENGES.map(ch => {
          const result = completedChallenges[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChallenge(ch)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                selectedChallenge?.id === ch.id 
                  ? 'neon-border bg-muted' 
                  : 'border-border hover:border-primary/30 bg-muted/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Lv.{ch.id} — {ch.title}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(s => (
                    <Star key={s} className={`w-3 h-3 ${result && result.stars >= s ? 'text-neon-yellow fill-neon-yellow' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              </div>
              {result && (
                <div className="flex gap-3 mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{result.comparisons} ops</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{(result.time / 1000).toFixed(1)}s</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedChallenge && (
        <div className="bg-muted rounded-lg p-3 space-y-2 text-xs">
          <p className="text-foreground">{selectedChallenge.description}</p>
          <p className="text-muted-foreground">Goal: <span className="neon-text-green">{selectedChallenge.goal}</span></p>
          <p className="text-muted-foreground">Max comparisons for ★★★: <span className="text-neon-yellow">{selectedChallenge.stars3}</span></p>
          <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/80 text-primary-foreground" onClick={() => onStartChallenge(selectedChallenge)}>
            Start Challenge
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeModePanel;
