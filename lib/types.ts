// TypeScript types for Cache Simulator

export interface CacheConfig {
  l1Size: number;
  l1Assoc: number;
  l2Size: number;
  l2Assoc: number;
  replacementPolicy: 'LRU' | 'FIFO' | 'RANDOM';
  writePolicy: 'write-back' | 'write-through';
  blockSize: number;
  numAccesses: number;
}

export interface CacheBlock {
  valid: boolean;
  tag: number | null;
  dirty: boolean;
  data: any;
  lastAccessed: number;
  insertionTime: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  accesses: number;
  hitRate: number;
  missRate: number;
}

export interface SimulationResults {
  l1: CacheStats;
  l2: CacheStats;
  overall: {
    hitRate: string;
    amat: string;
  };
}

export interface MemoryAccess {
  address: number;
  isWrite: boolean;
}

export interface TraceEntry {
  index: number;
  address: string;
  type: 'READ' | 'WRITE';
  status: string;
}
