import { memo } from 'react';

interface NodeBlockProps {
  value: number;
  index: number;
  state: 'default' | 'active' | 'comparing' | 'found' | 'sorted' | 'swapping';
  isLast?: boolean;
}

const stateStyles: Record<NodeBlockProps['state'], string> = {
  default: 'border-border bg-card',
  active: 'neon-border bg-muted',
  comparing: 'neon-border-magenta bg-muted',
  found: 'neon-border-green bg-muted',
  sorted: 'border-neon-green/50 bg-neon-green/10',
  swapping: 'neon-border-magenta bg-neon-magenta/10',
};

const stateTextStyles: Record<NodeBlockProps['state'], string> = {
  default: 'text-foreground',
  active: 'neon-text-cyan',
  comparing: 'neon-text-magenta',
  found: 'neon-text-green',
  sorted: 'neon-text-green',
  swapping: 'neon-text-magenta',
};

const NodeBlock = memo(({ value, index, state, isLast = false }: NodeBlockProps) => {
  return (
    <div className="flex items-center animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
      {/* Node */}
      <div className={`relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 transition-all duration-300 ${stateStyles[state]}`}>
        <span className={`text-lg font-bold font-display transition-all duration-300 ${stateTextStyles[state]}`}>
          {value}
        </span>
        <span className="text-[10px] text-muted-foreground absolute -bottom-5">
          [{index}]
        </span>
      </div>

      {/* Arrow */}
      {!isLast && (
        <div className="flex items-center mx-1">
          <div className="w-6 sm:w-8 h-0.5 bg-primary/50" />
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-primary/50" />
        </div>
      )}
    </div>
  );
});

NodeBlock.displayName = 'NodeBlock';
export default NodeBlock;
