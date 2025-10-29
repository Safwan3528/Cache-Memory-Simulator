// Cache Memory Simulator - TypeScript Implementation
// Computer Architecture and Organization Project

import { CacheConfig, CacheBlock, CacheStats, SimulationResults, MemoryAccess, TraceEntry } from './types';

export class CacheBlockClass implements CacheBlock {
  valid: boolean = false;
  tag: number | null = null;
  dirty: boolean = false;
  data: any = null;
  lastAccessed: number = 0;
  insertionTime: number = 0;
}

export class CacheSet {
  blocks: CacheBlockClass[];

  constructor(associativity: number) {
    this.blocks = [];
    for (let i = 0; i < associativity; i++) {
      this.blocks.push(new CacheBlockClass());
    }
  }

  findBlock(tag: number): number {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].valid && this.blocks[i].tag === tag) {
        return i;
      }
    }
    return -1;
  }

  findEmptyBlock(): number {
    for (let i = 0; i < this.blocks.length; i++) {
      if (!this.blocks[i].valid) {
        return i;
      }
    }
    return -1;
  }

  findVictim(policy: string, currentTime: number): number {
    if (policy === 'LRU') {
      let minTime = Infinity;
      let victimIndex = 0;
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].lastAccessed < minTime) {
          minTime = this.blocks[i].lastAccessed;
          victimIndex = i;
        }
      }
      return victimIndex;
    } else if (policy === 'FIFO') {
      let minTime = Infinity;
      let victimIndex = 0;
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].insertionTime < minTime) {
          minTime = this.blocks[i].insertionTime;
          victimIndex = i;
        }
      }
      return victimIndex;
    } else {
      // Random
      return Math.floor(Math.random() * this.blocks.length);
    }
  }
}

export class Cache {
  size: number;
  associativity: number;
  blockSize: number;
  policy: string;
  numBlocks: number;
  numSets: number;
  sets: CacheSet[];
  hits: number = 0;
  misses: number = 0;
  accesses: number = 0;
  currentTime: number = 0;

  constructor(size: number, associativity: number, blockSize: number, policy: string) {
    this.size = size * 1024; // Convert KB to bytes
    this.associativity = associativity;
    this.blockSize = blockSize;
    this.policy = policy;
    
    this.numBlocks = this.size / this.blockSize;
    this.numSets = this.numBlocks / this.associativity;
    
    this.sets = [];
    for (let i = 0; i < this.numSets; i++) {
      this.sets.push(new CacheSet(this.associativity));
    }
  }

  access(address: number, isWrite: boolean = false): boolean {
    this.accesses++;
    this.currentTime++;
    
    const blockAddress = Math.floor(address / this.blockSize);
    const setIndex = blockAddress % this.numSets;
    const tag = Math.floor(blockAddress / this.numSets);
    
    const set = this.sets[setIndex];
    const blockIndex = set.findBlock(tag);
    
    if (blockIndex !== -1) {
      // Hit
      this.hits++;
      set.blocks[blockIndex].lastAccessed = this.currentTime;
      if (isWrite) {
        set.blocks[blockIndex].dirty = true;
      }
      return true;
    } else {
      // Miss
      this.misses++;
      
      // Find empty block or victim
      let targetIndex = set.findEmptyBlock();
      if (targetIndex === -1) {
        targetIndex = set.findVictim(this.policy, this.currentTime);
      }
      
      // Insert new block
      const block = set.blocks[targetIndex];
      block.valid = true;
      block.tag = tag;
      block.dirty = isWrite;
      block.lastAccessed = this.currentTime;
      block.insertionTime = this.currentTime;
      
      return false;
    }
  }

  getMissRate(): number {
    return this.accesses > 0 ? parseFloat(((this.misses / this.accesses) * 100).toFixed(2)) : 0;
  }

  getHitRate(): number {
    return this.accesses > 0 ? parseFloat(((this.hits / this.accesses) * 100).toFixed(2)) : 0;
  }

  reset(): void {
    for (let set of this.sets) {
      for (let block of set.blocks) {
        block.valid = false;
        block.tag = null;
        block.dirty = false;
        block.lastAccessed = 0;
        block.insertionTime = 0;
      }
    }
    this.hits = 0;
    this.misses = 0;
    this.accesses = 0;
    this.currentTime = 0;
  }
}

export class CacheSimulator {
  config: CacheConfig;
  l1Cache: Cache;
  l2Cache: Cache;
  traceLog: TraceEntry[];

  constructor(config: CacheConfig) {
    this.config = config;
    this.l1Cache = new Cache(
      config.l1Size,
      config.l1Assoc,
      config.blockSize,
      config.replacementPolicy
    );
    this.l2Cache = new Cache(
      config.l2Size,
      config.l2Assoc,
      config.blockSize,
      config.replacementPolicy
    );
    this.traceLog = [];
  }

  generateMemoryTrace(numAccesses: number): MemoryAccess[] {
    const trace: MemoryAccess[] = [];
    const maxAddress = 1024 * 1024 * 16; // 16 MB address space
    
    // Generate realistic memory access patterns
    let currentAddress = 0;
    
    for (let i = 0; i < numAccesses; i++) {
      const pattern = Math.random();
      
      if (pattern < 0.7) {
        // Sequential access (70% - spatial locality)
        currentAddress += this.config.blockSize;
        if (currentAddress >= maxAddress) {
          currentAddress = Math.floor(Math.random() * 1000) * this.config.blockSize;
        }
      } else if (pattern < 0.85) {
        // Local random access (15% - temporal locality)
        const offset = (Math.floor(Math.random() * 16) - 8) * this.config.blockSize;
        currentAddress = Math.max(0, currentAddress + offset);
      } else {
        // Random access (15%)
        currentAddress = Math.floor(Math.random() * (maxAddress / this.config.blockSize)) * this.config.blockSize;
      }
      
      const isWrite = Math.random() < 0.3; // 30% writes
      trace.push({ address: currentAddress, isWrite: isWrite });
    }
    
    return trace;
  }

  simulate(numAccesses: number): SimulationResults {
    const trace = this.generateMemoryTrace(numAccesses);
    this.traceLog = [];
    
    let l1Hits = 0, l2Hits = 0, memoryAccesses = 0;
    
    for (let i = 0; i < trace.length; i++) {
      const access = trace[i];
      const l1Hit = this.l1Cache.access(access.address, access.isWrite);
      
      let status = '';
      if (l1Hit) {
        l1Hits++;
        status = 'L1 HIT';
      } else {
        const l2Hit = this.l2Cache.access(access.address, access.isWrite);
        if (l2Hit) {
          l2Hits++;
          status = 'L1 MISS, L2 HIT';
        } else {
          memoryAccesses++;
          status = 'L1 MISS, L2 MISS';
        }
      }
      
      // Keep last 50 accesses for display
      if (this.traceLog.length >= 50) {
        this.traceLog.shift();
      }
      this.traceLog.push({
        index: i,
        address: access.address.toString(16).toUpperCase().padStart(8, '0'),
        type: access.isWrite ? 'WRITE' : 'READ',
        status: status
      });
    }
    
    return this.calculateMetrics();
  }

  calculateMetrics(): SimulationResults {
    const l1MissRate = this.l1Cache.getMissRate();
    const l2MissRate = this.l2Cache.getMissRate();
    const l1HitRate = this.l1Cache.getHitRate();
    
    // Calculate AMAT (Average Memory Access Time)
    // AMAT = Hit Time L1 + Miss Rate L1 × (Hit Time L2 + Miss Rate L2 × Miss Penalty)
    const hitTimeL1 = 1;
    const hitTimeL2 = 8;
    const memoryPenalty = 100;
    
    const amat = hitTimeL1 + 
                 (l1MissRate / 100) * (hitTimeL2 + (l2MissRate / 100) * memoryPenalty);
    
    const overallHitRate = l1HitRate + ((100 - l1HitRate) / 100) * this.l2Cache.getHitRate();
    
    return {
      l1: {
        hits: this.l1Cache.hits,
        misses: this.l1Cache.misses,
        accesses: this.l1Cache.accesses,
        hitRate: l1HitRate,
        missRate: l1MissRate
      },
      l2: {
        hits: this.l2Cache.hits,
        misses: this.l2Cache.misses,
        accesses: this.l2Cache.accesses,
        hitRate: this.l2Cache.getHitRate(),
        missRate: l2MissRate
      },
      overall: {
        hitRate: overallHitRate.toFixed(2),
        amat: amat.toFixed(2)
      }
    };
  }

  reset(): void {
    this.l1Cache.reset();
    this.l2Cache.reset();
    this.traceLog = [];
  }
}
