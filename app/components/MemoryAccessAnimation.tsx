'use client';

import React, { useEffect, useState } from 'react';

interface MemoryAccessAnimationProps {
  isSimulating: boolean;
  currentAccess?: {
    address: string;
    l1Result: 'hit' | 'miss';
    l2Result?: 'hit' | 'miss';
  };
}

export default function MemoryAccessAnimation({
  isSimulating,
  currentAccess,
}: MemoryAccessAnimationProps) {
  const [animationStage, setAnimationStage] = useState<number>(0);

  useEffect(() => {
    if (isSimulating && currentAccess) {
      // Reset and start animation
      setAnimationStage(0);
      
      const stages = [
        { delay: 0, stage: 1 },     // CPU to L1
        { delay: 300, stage: 2 },   // L1 check
        { delay: 600, stage: currentAccess.l1Result === 'hit' ? 0 : 3 }, // L1 result
        { delay: 900, stage: currentAccess.l1Result === 'miss' ? 4 : 0 }, // L2 check
        { delay: 1200, stage: 0 },  // Complete
      ];

      stages.forEach(({ delay, stage }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });
    }
  }, [isSimulating, currentAccess]);

  return (
    <div className="memory-access-animation">
      <div className="animation-title">Memory Access Flow</div>
      
      <div className="flow-diagram">
        {/* CPU */}
        <div className={`flow-node cpu ${animationStage >= 1 ? 'active' : ''}`}>
          <div className="node-icon">🖥️</div>
          <div className="node-label">CPU</div>
        </div>

        {/* Arrow 1 */}
        <div className={`flow-arrow ${animationStage >= 1 ? 'active' : ''}`}>
          <div className="arrow-line"></div>
          <div className="arrow-head">→</div>
        </div>

        {/* L1 Cache */}
        <div className={`flow-node l1 ${animationStage >= 2 ? 'active' : ''} ${
          animationStage === 2 && currentAccess?.l1Result === 'hit' ? 'hit-glow' : ''
        } ${animationStage === 2 && currentAccess?.l1Result === 'miss' ? 'miss-glow' : ''}`}>
          <div className="node-icon">💾</div>
          <div className="node-label">L1 Cache</div>
          {animationStage === 2 && currentAccess && (
            <div className={`result-badge ${currentAccess.l1Result}`}>
              {currentAccess.l1Result === 'hit' ? '✓ HIT' : '✗ MISS'}
            </div>
          )}
        </div>

        {/* Arrow 2 */}
        {currentAccess?.l1Result === 'miss' && (
          <>
            <div className={`flow-arrow ${animationStage >= 3 ? 'active' : ''}`}>
              <div className="arrow-line"></div>
              <div className="arrow-head">→</div>
            </div>

            {/* L2 Cache */}
            <div className={`flow-node l2 ${animationStage >= 4 ? 'active' : ''} ${
              animationStage === 4 && currentAccess?.l2Result === 'hit' ? 'hit-glow' : ''
            } ${animationStage === 4 && currentAccess?.l2Result === 'miss' ? 'miss-glow' : ''}`}>
              <div className="node-icon">💿</div>
              <div className="node-label">L2 Cache</div>
              {animationStage === 4 && currentAccess.l2Result && (
                <div className={`result-badge ${currentAccess.l2Result}`}>
                  {currentAccess.l2Result === 'hit' ? '✓ HIT' : '✗ MISS'}
                </div>
              )}
            </div>

            {currentAccess?.l2Result === 'miss' && (
              <>
                <div className={`flow-arrow ${animationStage >= 4 ? 'active' : ''}`}>
                  <div className="arrow-line"></div>
                  <div className="arrow-head">→</div>
                </div>

                {/* Main Memory */}
                <div className={`flow-node memory ${animationStage >= 4 ? 'active' : ''}`}>
                  <div className="node-icon">🗄️</div>
                  <div className="node-label">Main Memory</div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {currentAccess && (
        <div className="access-info">
          <span className="info-label">Address:</span>
          <span className="info-value">0x{currentAccess.address}</span>
        </div>
      )}
    </div>
  );
}
