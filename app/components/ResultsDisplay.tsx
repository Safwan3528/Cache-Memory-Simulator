'use client';

import React from 'react';
import { SimulationResults, CacheConfig } from '@/lib/types';
import PerformanceCharts from './PerformanceCharts';
import StatsTable from './StatsTable';
import TraceLog from './TraceLog';
import CacheVisualization from './CacheVisualization';
import AnimatedStats from './AnimatedStats';
import MemoryAccessAnimation from './MemoryAccessAnimation';

interface ResultsDisplayProps {
  results: SimulationResults;
  config: CacheConfig;
  traceLog: Array<{ index: number; address: string; type: string; status: string }>;
}

export default function ResultsDisplay({ results, config, traceLog }: ResultsDisplayProps) {
  // Get recent access for animation
  const recentAccess = traceLog.length > 0 ? traceLog[traceLog.length - 1] : null;
  return (
    <div id="results">
      <h2 className="results-title">Simulation Results</h2>

      <div className="info-box config-summary">
        <h4>Configuration Summary</h4>
        <div className="config-details-grid">
          <div><strong>L1 Cache:</strong> {config.l1Size}KB, {config.l1Assoc}-way</div>
          <div><strong>L2 Cache:</strong> {config.l2Size}KB, {config.l2Assoc}-way</div>
          <div><strong>Block Size:</strong> {config.blockSize} bytes</div>
          <div><strong>Memory Accesses:</strong> {config.numAccesses.toLocaleString()}</div>
          <div><strong>Replacement Policy:</strong> {config.replacementPolicy}</div>
          <div><strong>Write Policy:</strong> {config.writePolicy}</div>
        </div>
      </div>

      <div className="results-grid">
        <div className="stat-card stat-card-1 animate-slide-up">
          <h4>L1 Cache Miss Rate</h4>
          <div className="value">
            <AnimatedStats value={results.l1.missRate} />%
          </div>
        </div>
        <div className="stat-card stat-card-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h4>L2 Cache Miss Rate</h4>
          <div className="value">
            <AnimatedStats value={results.l2.missRate} />%
          </div>
        </div>
        <div className="stat-card stat-card-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h4>Overall Hit Rate</h4>
          <div className="value">
            <AnimatedStats value={parseFloat(results.overall.hitRate)} />%
          </div>
        </div>
        <div className="stat-card stat-card-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h4>Avg Memory Access Time</h4>
          <div className="value">
            <AnimatedStats value={parseFloat(results.overall.amat)} /> cycles
          </div>
        </div>
      </div>

      {/* Memory Access Flow Animation */}
      <MemoryAccessAnimation
        isSimulating={false}
        currentAccess={
          recentAccess
            ? {
                address: recentAccess.address,
                l1Result: recentAccess.status.includes('L1 HIT') ? 'hit' : 'miss',
                l2Result: recentAccess.status.includes('L2 HIT')
                  ? 'hit'
                  : recentAccess.status.includes('L2 MISS')
                  ? 'miss'
                  : undefined,
              }
            : undefined
        }
      />

      {/* Cache Structure Visualization */}
      <div className="chart-container">
        <div className="chart-title">🏗️ Cache Architecture Visualization</div>
        <div className="cache-viz-grid">
          <CacheVisualization
            cacheLevel="L1"
            numSets={Math.floor((config.l1Size * 1024) / config.blockSize / config.l1Assoc)}
            associativity={config.l1Assoc}
            recentAccesses={[]}
          />
          <CacheVisualization
            cacheLevel="L2"
            numSets={Math.floor((config.l2Size * 1024) / config.blockSize / config.l2Assoc)}
            associativity={config.l2Assoc}
            recentAccesses={[]}
          />
        </div>
      </div>

      <PerformanceCharts results={results} />
      
      <StatsTable results={results} />
      
      <TraceLog traceLog={traceLog} />
    </div>
  );
}
