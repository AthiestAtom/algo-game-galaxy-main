// Algorithm step for visualization
export interface AlgorithmStep {
  type: 'compare' | 'swap' | 'found' | 'not-found' | 'insert' | 'sorted' | 'select' | 'shift' | 'merge' | 'done';
  indices: number[];          // indices involved
  array: number[];            // current state of array
  description: string;        // human readable step
  comparisons: number;        // running comparison count
  pseudocodeLine: number;     // which line of pseudocode to highlight
}

// ============ SEARCHING ============

export function linearSearchSteps(arr: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      steps.push({ type: 'found', indices: [i], array: [...arr], description: `Found ${target} at index ${i}!`, comparisons, pseudocodeLine: 2 });
      return steps;
    }
    steps.push({ type: 'compare', indices: [i], array: [...arr], description: `Comparing arr[${i}]=${arr[i]} with ${target}`, comparisons, pseudocodeLine: 1 });
  }

  steps.push({ type: 'not-found', indices: [], array: [...arr], description: `${target} not found in list`, comparisons, pseudocodeLine: 4 });
  return steps;
}

export function binarySearchSteps(arr: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    if (arr[mid] === target) {
      steps.push({ type: 'found', indices: [mid, left, right], array: [...arr], description: `Found ${target} at index ${mid}!`, comparisons, pseudocodeLine: 3 });
      return steps;
    }

    if (arr[mid] < target) {
      steps.push({ type: 'compare', indices: [mid, left, right], array: [...arr], description: `arr[${mid}]=${arr[mid]} < ${target}, search right half`, comparisons, pseudocodeLine: 4 });
      left = mid + 1;
    } else {
      steps.push({ type: 'compare', indices: [mid, left, right], array: [...arr], description: `arr[${mid}]=${arr[mid]} > ${target}, search left half`, comparisons, pseudocodeLine: 5 });
      right = mid - 1;
    }
  }

  steps.push({ type: 'not-found', indices: [], array: [...arr], description: `${target} not found`, comparisons, pseudocodeLine: 7 });
  return steps;
}

// ============ SORTING ============

export function bubbleSortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  let comparisons = 0;

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      steps.push({ type: 'compare', indices: [j, j + 1], array: [...a], description: `Comparing ${a[j]} and ${a[j + 1]}`, comparisons, pseudocodeLine: 2 });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: 'swap', indices: [j, j + 1], array: [...a], description: `Swapped ${a[j + 1]} and ${a[j]}`, comparisons, pseudocodeLine: 3 });
      }
    }
  }
  steps.push({ type: 'done', indices: [], array: [...a], description: 'Sorting complete!', comparisons, pseudocodeLine: 5 });
  return steps;
}

export function selectionSortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  let comparisons = 0;

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ type: 'select', indices: [i], array: [...a], description: `Selecting minimum from index ${i}`, comparisons, pseudocodeLine: 1 });
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      steps.push({ type: 'compare', indices: [j, minIdx], array: [...a], description: `Comparing ${a[j]} with current min ${a[minIdx]}`, comparisons, pseudocodeLine: 3 });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ type: 'swap', indices: [i, minIdx], array: [...a], description: `Swapped ${a[minIdx]} and ${a[i]}`, comparisons, pseudocodeLine: 5 });
    }
  }
  steps.push({ type: 'done', indices: [], array: [...a], description: 'Sorting complete!', comparisons, pseudocodeLine: 6 });
  return steps;
}

export function insertionSortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  let comparisons = 0;

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ type: 'select', indices: [i], array: [...a], description: `Picking element ${key} at index ${i}`, comparisons, pseudocodeLine: 1 });
    while (j >= 0 && a[j] > key) {
      comparisons++;
      a[j + 1] = a[j];
      steps.push({ type: 'shift', indices: [j, j + 1], array: [...a], description: `Shifting ${a[j + 1]} right`, comparisons, pseudocodeLine: 3 });
      j--;
    }
    a[j + 1] = key;
    steps.push({ type: 'insert', indices: [j + 1], array: [...a], description: `Inserted ${key} at index ${j + 1}`, comparisons, pseudocodeLine: 4 });
  }
  steps.push({ type: 'done', indices: [], array: [...a], description: 'Sorting complete!', comparisons, pseudocodeLine: 5 });
  return steps;
}

// Pseudocode definitions
export const PSEUDOCODE = {
  linearSearch: [
    'function linearSearch(arr, target):',
    '  for i = 0 to arr.length:',
    '    if arr[i] == target: return i',
    '  return -1',
    'end',
  ],
  binarySearch: [
    'function binarySearch(arr, target):',
    '  left = 0, right = length - 1',
    '  while left <= right:',
    '    mid = (left + right) / 2',
    '    if arr[mid] == target: return mid',
    '    if arr[mid] < target: left = mid + 1',
    '    else: right = mid - 1',
    '  return -1',
  ],
  bubbleSort: [
    'function bubbleSort(arr):',
    '  for i = 0 to n-1:',
    '    for j = 0 to n-i-1:',
    '      if arr[j] > arr[j+1]: swap',
    '  return arr',
    'end',
  ],
  selectionSort: [
    'function selectionSort(arr):',
    '  for i = 0 to n-1:',
    '    minIdx = i',
    '    for j = i+1 to n:',
    '      if arr[j] < arr[minIdx]: minIdx = j',
    '    swap arr[i], arr[minIdx]',
    'end',
  ],
  insertionSort: [
    'function insertionSort(arr):',
    '  for i = 1 to n:',
    '    key = arr[i], j = i-1',
    '    while j >= 0 and arr[j] > key:',
    '      arr[j+1] = arr[j], j--',
    '    arr[j+1] = key',
    'end',
  ],
};

export const COMPLEXITY = {
  linearSearch: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' },
  binarySearch: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
  bubbleSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
  selectionSort: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
  insertionSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
};

export type AlgorithmName = keyof typeof PSEUDOCODE;
