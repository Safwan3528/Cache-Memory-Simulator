'use client';

import React, { useEffect, useState } from 'react';

interface SimulationLoadingProps {
  totalAccesses: number;
  currentProgress?: number;
}

export default function SimulationLoading({ 
  totalAccesses,
  currentProgress = 0 
}: SimulationLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');

  useEffect(() => {
    const steps = [
      { progress: 20, text: 'Generating memory trace...' },
      { progress: 40, text: 'Accessing L1 cache...' },
      { progress: 60, text: 'Checking L2 cache...' },
      { progress: 80, text: 'Calculating metrics...' },
      { progress: 100, text: 'Finalizing results...' },
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setProgress(steps[currentStepIndex].progress);
        setCurrentStep(steps[currentStepIndex].text);
        currentStepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="simulation-loading">
      <div className="loading-content">
        {/* Animated Cache Icon */}
        <div className="cache-icon-animation">
          <div className="cache-layer layer-1">
            <div className="cache-block"></div>
            <div className="cache-block"></div>
            <div className="cache-block"></div>
          </div>
          <div className="cache-layer layer-2">
            <div className="cache-block"></div>
            <div className="cache-block"></div>
            <div className="cache-block"></div>
          </div>
        </div>

        <h3>Running Simulation</h3>
        <p className="loading-subtitle">Processing {totalAccesses.toLocaleString()} memory accesses</p>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="progress-text">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="current-step">
          <div className="step-indicator"></div>
          <span>{currentStep}</span>
        </div>

        {/* Animated Stats Preview */}
        <div className="stats-preview">
          <div className="stat-item">
            <span className="stat-icon">💾</span>
            <span className="stat-label">L1 Cache</span>
          </div>
          <div className="stat-arrow">→</div>
          <div className="stat-item">
            <span className="stat-icon">💿</span>
            <span className="stat-label">L2 Cache</span>
          </div>
          <div className="stat-arrow">→</div>
          <div className="stat-item">
            <span className="stat-icon">🗄️</span>
            <span className="stat-label">Memory</span>
          </div>
        </div>
      </div>
    </div>
  );
}
