'use client';

import React, { useEffect, useState } from 'react';

interface CacheVisualizationProps {
  cacheLevel: 'L1' | 'L2';
  numSets: number;
  associativity: number;
  recentAccesses: Array<{
    setIndex: number;
    blockIndex: number;
    isHit: boolean;
  }>;
}

export default function CacheVisualization({
  cacheLevel,
  numSets,
  associativity,
  recentAccesses,
}: CacheVisualizationProps) {
  const [activeSet, setActiveSet] = useState<number>(-1);
  const [activeBlock, setActiveBlock] = useState<number>(-1);
  const [isHit, setIsHit] = useState<boolean>(false);

  useEffect(() => {
    if (recentAccesses.length > 0) {
      const latest = recentAccesses[recentAccesses.length - 1];
      setActiveSet(latest.setIndex);
      setActiveBlock(latest.blockIndex);
      setIsHit(latest.isHit);

      const timer = setTimeout(() => {
        setActiveSet(-1);
        setActiveBlock(-1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [recentAccesses]);

  // Limit visualization to first 8 sets for display purposes
  const displaySets = Math.min(numSets, 8);
  const displayAssoc = Math.min(associativity, 8);

  return (
    <div className="cache-visualization">
      <div className="cache-viz-header">
        <h4>{cacheLevel} Cache Structure</h4>
        <div className="cache-info">
          <span className="badge">{numSets} Sets</span>
          <span className="badge">{associativity}-way</span>
        </div>
      </div>

      <div className="cache-grid">
        {Array.from({ length: displaySets }).map((_, setIdx) => (
          <div
            key={setIdx}
            className={`cache-set ${activeSet === setIdx ? 'active' : ''}`}
          >
            <div className="set-label">Set {setIdx}</div>
            <div className="blocks-row">
              {Array.from({ length: displayAssoc }).map((_, blockIdx) => (
                <div
                  key={blockIdx}
                  className={`cache-block ${
                    activeSet === setIdx && activeBlock === blockIdx
                      ? isHit
                        ? 'hit-animation'
                        : 'miss-animation'
                      : ''
                  }`}
                >
                  <div className="block-content">
                    <span className="block-label">B{blockIdx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {displaySets < numSets && (
        <div className="more-indicator">
          ... and {numSets - displaySets} more sets
        </div>
      )}
    </div>
  );
}
