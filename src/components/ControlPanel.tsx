import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Play, Pause, SkipForward, RotateCcw, Plus, Trash2, Shuffle, Search, ArrowDownUp, Zap } from 'lucide-react';

interface ControlPanelProps {
  onInsertEnd: (value: number) => void;
  onInsertBeginning: (value: number) => void;
  onDeleteByValue: (value: number) => void;
  onShuffle: () => void;
  onReverse: () => void;
  onReset: () => void;
  onRunSearch: (type: 'linear' | 'binary', target: number) => void;
  onRunSort: (type: 'bubble' | 'selection' | 'insertion') => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  isRunning: boolean;
  speed: number;
  listLength: number;
}

const ControlPanel = ({
  onInsertEnd, onInsertBeginning, onDeleteByValue,
  onShuffle, onReverse, onReset,
  onRunSearch, onRunSort,
  onStep, onTogglePlay, onSpeedChange,
  isPlaying, isRunning, speed, listLength,
}: ControlPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const getNum = (val: string) => {
    const n = parseInt(val);
    return isNaN(n) ? null : n;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h3 className="font-display text-sm neon-text-cyan uppercase tracking-wider">Controls</h3>

      {/* List Operations */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">List Operations</p>
        <div className="flex gap-2">
          <Input
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-20 h-8 text-xs bg-muted border-border"
            type="number"
          />
          <Button size="sm" variant="outline" className="h-8 text-xs border-primary/50 hover:bg-primary/10" onClick={() => { const n = getNum(inputValue); if (n !== null) { onInsertEnd(n); setInputValue(''); } }} disabled={isRunning || listLength >= 50}>
            <Plus className="w-3 h-3 mr-1" /> End
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs border-primary/50 hover:bg-primary/10" onClick={() => { const n = getNum(inputValue); if (n !== null) { onInsertBeginning(n); setInputValue(''); } }} disabled={isRunning || listLength >= 50}>
            <Plus className="w-3 h-3 mr-1" /> Start
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs border-destructive/50 hover:bg-destructive/10 text-destructive" onClick={() => { const n = getNum(inputValue); if (n !== null) { onDeleteByValue(n); setInputValue(''); } }} disabled={isRunning}>
            <Trash2 className="w-3 h-3 mr-1" /> Del
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onShuffle} disabled={isRunning}>
            <Shuffle className="w-3 h-3 mr-1" /> Shuffle
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onReverse} disabled={isRunning}>
            <RotateCcw className="w-3 h-3 mr-1" /> Reverse
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onReset} disabled={isRunning}>
            <Zap className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Search</p>
        <div className="flex gap-2">
          <Input
            placeholder="Target"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-20 h-8 text-xs bg-muted border-border"
            type="number"
          />
          <Button size="sm" variant="outline" className="h-8 text-xs border-neon-green/50 hover:bg-neon-green/10 text-neon-green" onClick={() => { const n = getNum(searchValue); if (n !== null) { onRunSearch('linear', n); } else { toast.error('Enter a target value to search for'); } }} disabled={isRunning}>
            <Search className="w-3 h-3 mr-1" /> Linear
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs border-neon-green/50 hover:bg-neon-green/10 text-neon-green" onClick={() => { const n = getNum(searchValue); if (n !== null) { onRunSearch('binary', n); } else { toast.error('Enter a target value to search for'); } }} disabled={isRunning}>
            <Search className="w-3 h-3 mr-1" /> Binary
          </Button>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Sort</p>
        <div className="flex gap-2 flex-wrap">
          {(['bubble', 'selection', 'insertion'] as const).map(type => (
            <Button key={type} size="sm" variant="outline" className="h-8 text-xs border-secondary/50 hover:bg-secondary/10 text-secondary" onClick={() => onRunSort(type)} disabled={isRunning}>
              <ArrowDownUp className="w-3 h-3 mr-1" /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Playback */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Playback</p>
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={onTogglePlay} disabled={!isRunning}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={onStep} disabled={!isRunning || isPlaying}>
            <SkipForward className="w-4 h-4" />
          </Button>
          <div className="flex gap-1 ml-2">
            {[500, 250, 100].map((s, i) => (
              <Button key={s} size="sm" variant={speed === s ? 'default' : 'outline'} className="h-8 text-xs px-2" onClick={() => onSpeedChange(s)}>
                {['Slow', 'Med', 'Fast'][i]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
