import { useState, useCallback, useRef, useEffect } from 'react';
import { LinkedList } from '@/lib/linked-list';
import {
  linearSearchSteps, binarySearchSteps,
  bubbleSortSteps, selectionSortSteps, insertionSortSteps,
  AlgorithmStep, AlgorithmName,
} from '@/lib/algorithms';
import NodeBlock from '@/components/NodeBlock';
import ControlPanel from '@/components/ControlPanel';
import PseudocodePanel from '@/components/PseudocodePanel';
import ChallengeModePanel, { Challenge } from '@/components/ChallengeModePanel';
import { toast } from 'sonner';
import { Star, Trophy } from 'lucide-react';

// Generate random list
const randomList = (size = 8) => {
  const values: number[] = [];
  while (values.length < size) {
    const v = Math.floor(Math.random() * 99) + 1;
    if (!values.includes(v)) values.push(v);
  }
  return values;
};

const Index = () => {
  // Core state
  const [list, setList] = useState<LinkedList>(() => LinkedList.fromArray(randomList()));
  const [displayArray, setDisplayArray] = useState<{ value: number; id: string }[]>(() => LinkedList.fromArray(randomList()).toArray());

  // Algorithm state
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmName | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(250);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Challenge state
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<number, { stars: number; comparisons: number; time: number }>>({});

  // Initialize display array from list
  useEffect(() => {
    setDisplayArray(list.toArray());
  }, [list]);

  // Current step data
  const currentStep: AlgorithmStep | null = steps[currentStepIndex] ?? null;

  // Get node state for rendering
  const getNodeState = (index: number): 'default' | 'active' | 'comparing' | 'found' | 'sorted' | 'swapping' => {
    if (!currentStep) return 'default';
    if (currentStep.type === 'done') return 'sorted';
    if (currentStep.type === 'found' && currentStep.indices[0] === index) return 'found';
    if (currentStep.type === 'swap' && currentStep.indices.includes(index)) return 'swapping';
    if (currentStep.type === 'compare' && currentStep.indices.includes(index)) return 'comparing';
    if ((currentStep.type === 'select' || currentStep.type === 'insert' || currentStep.type === 'shift') && currentStep.indices.includes(index)) return 'active';
    return 'default';
  };

  // Display array based on current step
  const renderArray = currentStep ? currentStep.array : displayArray.map(n => n.value);

  // Advance one step
  const advanceStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        setIsPlaying(false);
        if (playRef.current) clearInterval(playRef.current);

        // Check challenge completion
        if (steps.length > 0) {
          const lastStep = steps[steps.length - 1];
          if (lastStep.type === 'done' || lastStep.type === 'found') {
            // Update list with sorted array
            const newList = LinkedList.fromArray(lastStep.array);
            setList(newList);
          }
        }
        return prev;
      }

      // Update display when stepping through
      const step = steps[next];
      if (step && (step.type === 'done' || step.type === 'found')) {
        const newList = LinkedList.fromArray(step.array);
        setList(newList);
      }

      return next;
    });
  }, [steps]);

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(advanceStep, speed);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, speed, advanceStep]);

  // Complete challenge check
  useEffect(() => {
    if (!activeChallenge || currentStepIndex < 0) return;
    const step = steps[currentStepIndex];
    if (!step) return;

    if (step.type === 'done' || step.type === 'found') {
      const elapsed = Date.now() - challengeStartTime;
      const comps = step.comparisons;
      let stars = 1;
      if (comps <= activeChallenge.stars3) stars = 3;
      else if (comps <= activeChallenge.stars2) stars = 2;

      const prev = completedChallenges[activeChallenge.id];
      if (!prev || stars > prev.stars) {
        setCompletedChallenges(p => ({ ...p, [activeChallenge.id]: { stars, comparisons: comps, time: elapsed } }));
      }

      toast(
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-yellow" />
          <span className="font-display">Challenge Complete!</span>
          <div className="flex gap-0.5 ml-2">
            {[1, 2, 3].map(s => (
              <Star key={s} className={`w-4 h-4 ${stars >= s ? 'text-neon-yellow fill-current' : 'text-muted-foreground'}`} />
            ))}
          </div>
        </div>
      );
      setActiveChallenge(null);
    }
  }, [currentStepIndex, steps, activeChallenge, challengeStartTime, completedChallenges]);

  // --- Handlers ---
  const resetAlgorithm = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setActiveAlgorithm(null);
    setIsPlaying(false);
    if (playRef.current) clearInterval(playRef.current);
  };

  const handleInsertEnd = (value: number) => {
    resetAlgorithm();
    const newList = list.clone();
    newList.insertAtEnd(value);
    setList(newList);
    toast(`Inserted ${value} at end`);
  };

  const handleInsertBeginning = (value: number) => {
    resetAlgorithm();
    const newList = list.clone();
    newList.insertAtBeginning(value);
    setList(newList);
    toast(`Inserted ${value} at beginning`);
  };

  const handleDeleteByValue = (value: number) => {
    resetAlgorithm();
    const newList = list.clone();
    if (newList.deleteByValue(value)) {
      setList(newList);
      toast(`Deleted ${value}`);
    } else {
      toast.error(`${value} not found`);
    }
  };

  const handleShuffle = () => {
    resetAlgorithm();
    const arr = list.toArray().map(n => n.value);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setList(LinkedList.fromArray(arr));
  };

  const handleReverse = () => {
    resetAlgorithm();
    const newList = list.clone();
    newList.reverse();
    setList(newList);
    toast('List reversed');
  };

  const handleReset = () => {
    resetAlgorithm();
    setList(LinkedList.fromArray(randomList()));
    setActiveChallenge(null);
  };

  const handleRunSearch = (type: 'linear' | 'binary', target: number) => {
    resetAlgorithm();
    const arr = list.toArray().map(n => n.value);
    let genSteps: AlgorithmStep[];
    let algoName: AlgorithmName;

    if (type === 'binary') {
      // Sort first for binary search
      const sorted = [...arr].sort((a, b) => a - b);
      setList(LinkedList.fromArray(sorted));
      genSteps = binarySearchSteps(sorted, target);
      algoName = 'binarySearch';
    } else {
      genSteps = linearSearchSteps(arr, target);
      algoName = 'linearSearch';
    }

    setSteps(genSteps);
    setCurrentStepIndex(0);
    setActiveAlgorithm(algoName);
    setIsPlaying(true);
    toast(`Running ${type} search for ${target}`);
  };

  const handleRunSort = (type: 'bubble' | 'selection' | 'insertion') => {
    resetAlgorithm();
    const arr = list.toArray().map(n => n.value);
    let genSteps: AlgorithmStep[];
    let algoName: AlgorithmName;

    switch (type) {
      case 'bubble': genSteps = bubbleSortSteps(arr); algoName = 'bubbleSort'; break;
      case 'selection': genSteps = selectionSortSteps(arr); algoName = 'selectionSort'; break;
      case 'insertion': genSteps = insertionSortSteps(arr); algoName = 'insertionSort'; break;
    }

    setSteps(genSteps);
    setCurrentStepIndex(0);
    setActiveAlgorithm(algoName);
    setIsPlaying(true);
    toast(`Running ${type} sort`);
  };

  const handleStep = () => advanceStep();

  const handleTogglePlay = () => setIsPlaying(p => !p);

  const handleStartChallenge = (challenge: Challenge) => {
    resetAlgorithm();
    setList(LinkedList.fromArray(challenge.targetArray));
    setActiveChallenge(challenge);
    setChallengeStartTime(Date.now());
    toast(`Challenge started: ${challenge.title}`);
  };

  const isRunning = steps.length > 0 && currentStepIndex < steps.length - 1;
  const totalStars = Object.values(completedChallenges).reduce((sum, c) => sum + c.stars, 0);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-display font-bold neon-text-cyan tracking-wider">
              ALGORITHM ARENA
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">Visual Algorithm Playground</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {activeChallenge && (
              <span className="neon-text-magenta font-display animate-pulse-glow">
                ⚡ {activeChallenge.title}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-neon-yellow" />
              <span className="text-neon-yellow font-bold">{totalStars}/15</span>
            </div>
            <span className="text-muted-foreground">{list.length} nodes</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Visualization Area */}
        <div className="mb-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 min-h-[160px]">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">Linked List</span>
            {currentStep && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Step {currentStepIndex + 1}/{steps.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-y-8 overflow-x-auto pb-6">
            {renderArray.length === 0 ? (
              <p className="text-muted-foreground text-sm">Empty list — add some nodes!</p>
            ) : (
              renderArray.map((value, index) => (
                <NodeBlock
                  key={`${index}-${value}`}
                  value={value}
                  index={index}
                  state={getNodeState(index)}
                  isLast={index === renderArray.length - 1}
                />
              ))
            )}
          </div>
          {/* Progress bar */}
          {steps.length > 0 && (
            <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ControlPanel
              onInsertEnd={handleInsertEnd}
              onInsertBeginning={handleInsertBeginning}
              onDeleteByValue={handleDeleteByValue}
              onShuffle={handleShuffle}
              onReverse={handleReverse}
              onReset={handleReset}
              onRunSearch={handleRunSearch}
              onRunSort={handleRunSort}
              onStep={handleStep}
              onTogglePlay={handleTogglePlay}
              onSpeedChange={setSpeed}
              isPlaying={isPlaying}
              isRunning={isRunning}
              speed={speed}
              listLength={list.length}
            />
          </div>
          <div className="lg:col-span-1">
            <PseudocodePanel
              algorithm={activeAlgorithm}
              highlightLine={currentStep?.pseudocodeLine ?? -1}
              comparisons={currentStep?.comparisons ?? 0}
              description={currentStep?.description ?? ''}
            />
          </div>
          <div className="lg:col-span-1">
            <ChallengeModePanel
              onStartChallenge={handleStartChallenge}
              completedChallenges={completedChallenges}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
