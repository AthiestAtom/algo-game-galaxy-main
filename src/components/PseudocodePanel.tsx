import { PSEUDOCODE, COMPLEXITY, AlgorithmName } from '@/lib/algorithms';

interface PseudocodePanelProps {
  algorithm: AlgorithmName | null;
  highlightLine: number;
  comparisons: number;
  description: string;
}

const PseudocodePanel = ({ algorithm, highlightLine, comparisons, description }: PseudocodePanelProps) => {
  if (!algorithm) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">Select an algorithm to see pseudocode</p>
      </div>
    );
  }

  const lines = PSEUDOCODE[algorithm];
  const complexity = COMPLEXITY[algorithm];

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 h-full">
      <h3 className="font-display text-sm neon-text-cyan uppercase tracking-wider">{algorithm.replace(/([A-Z])/g, ' $1').trim()}</h3>
      
      {/* Pseudocode */}
      <div className="font-mono text-xs space-y-0.5 bg-muted rounded p-3">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`px-2 py-0.5 rounded transition-all duration-200 ${
              highlightLine === i ? 'bg-primary/20 neon-text-cyan' : 'text-muted-foreground'
            }`}
          >
            <span className="text-muted-foreground/50 mr-2 select-none">{i + 1}</span>
            {line}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Comparisons:</span>
          <span className="neon-text-magenta font-bold">{comparisons}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Best:</span>
          <span className="neon-text-green">{complexity.best}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Average:</span>
          <span className="neon-text-cyan">{complexity.avg}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Worst:</span>
          <span className="text-destructive">{complexity.worst}</span>
        </div>
      </div>

      {/* Current Step */}
      {description && (
        <div className="bg-muted rounded p-2 text-xs text-foreground border border-border">
          <span className="text-muted-foreground">▸ </span>{description}
        </div>
      )}
    </div>
  );
};

export default PseudocodePanel;
