'use client';

import React from 'react';
import { CacheConfig } from '@/lib/types';

interface ConfigSidebarProps {
  config: CacheConfig;
  onConfigChange: (config: CacheConfig) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ConfigSidebar({
  config,
  onConfigChange,
  onRunSimulation,
  onReset,
  isLoading
}: ConfigSidebarProps) {
  const handleChange = (field: keyof CacheConfig, value: number | string) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <aside className="sidebar">
      <div className="config-section">
        <h3>L1 Cache Configuration</h3>
        <div className="form-group">
          <label htmlFor="l1-size">Cache Size</label>
          <select
            id="l1-size"
            value={config.l1Size}
            onChange={(e) => handleChange('l1Size', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="16">16 KB</option>
            <option value="32">32 KB</option>
            <option value="64">64 KB</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="l1-assoc">Associativity</label>
          <select
            id="l1-assoc"
            value={config.l1Assoc}
            onChange={(e) => handleChange('l1Assoc', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="1">Direct Mapped (1-way)</option>
            <option value="2">2-way Set Associative</option>
            <option value="4">4-way Set Associative</option>
            <option value="8">8-way Set Associative</option>
          </select>
        </div>
      </div>

      <div className="config-section">
        <h3>L2 Cache Configuration</h3>
        <div className="form-group">
          <label htmlFor="l2-size">Cache Size</label>
          <select
            id="l2-size"
            value={config.l2Size}
            onChange={(e) => handleChange('l2Size', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="128">128 KB</option>
            <option value="256">256 KB</option>
            <option value="512">512 KB</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="l2-assoc">Associativity</label>
          <select
            id="l2-assoc"
            value={config.l2Assoc}
            onChange={(e) => handleChange('l2Assoc', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="4">4-way Set Associative</option>
            <option value="8">8-way Set Associative</option>
            <option value="16">16-way Set Associative</option>
          </select>
        </div>
      </div>

      <div className="config-section">
        <h3>Cache Policies</h3>
        <div className="form-group">
          <label htmlFor="replacement-policy">Replacement Policy</label>
          <select
            id="replacement-policy"
            value={config.replacementPolicy}
            onChange={(e) => handleChange('replacementPolicy', e.target.value)}
            disabled={isLoading}
          >
            <option value="LRU">LRU (Least Recently Used)</option>
            <option value="FIFO">FIFO (First In First Out)</option>
            <option value="RANDOM">Random</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="write-policy">Write Policy</label>
          <select
            id="write-policy"
            value={config.writePolicy}
            onChange={(e) => handleChange('writePolicy', e.target.value)}
            disabled={isLoading}
          >
            <option value="write-back">Write-Back</option>
            <option value="write-through">Write-Through</option>
          </select>
        </div>
      </div>

      <div className="config-section">
        <h3>Simulation Parameters</h3>
        <div className="form-group">
          <label htmlFor="block-size">Block Size (bytes)</label>
          <select
            id="block-size"
            value={config.blockSize}
            onChange={(e) => handleChange('blockSize', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="32">32</option>
            <option value="64">64</option>
            <option value="128">128</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="num-accesses">Memory Accesses</label>
          <select
            id="num-accesses"
            value={config.numAccesses}
            onChange={(e) => handleChange('numAccesses', parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="1000">1,000</option>
            <option value="10000">10,000</option>
            <option value="100000">100,000</option>
          </select>
        </div>
      </div>

      <div className="btn-group">
        <button 
          className="btn-primary" 
          onClick={onRunSimulation}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Running...' : '▶ Run Simulation'}
        </button>
        <button 
          className="btn-secondary" 
          onClick={onReset}
          disabled={isLoading}
        >
          ↻ Reset
        </button>
      </div>

      <div className="info-box">
        <h4>ℹ️ About</h4>
        <p>This simulator analyzes cache performance based on different configurations and policies.</p>
      </div>
    </aside>
  );
}
