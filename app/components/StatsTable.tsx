'use client';

import React from 'react';
import { SimulationResults } from '@/lib/types';

interface StatsTableProps {
  results: SimulationResults;
}

export default function StatsTable({ results }: StatsTableProps) {
  const rows = [
    {
      metric: 'Total Accesses',
      l1: results.l1.accesses,
      l2: results.l2.accesses,
      overall: results.l1.accesses,
    },
    {
      metric: 'Hits',
      l1: results.l1.hits,
      l2: results.l2.hits,
      overall: '-',
    },
    {
      metric: 'Misses',
      l1: results.l1.misses,
      l2: results.l2.misses,
      overall: '-',
    },
    {
      metric: 'Hit Rate (%)',
      l1: results.l1.hitRate + '%',
      l2: results.l2.hitRate + '%',
      overall: results.overall.hitRate + '%',
    },
    {
      metric: 'Miss Rate (%)',
      l1: results.l1.missRate + '%',
      l2: results.l2.missRate + '%',
      overall: '-',
    },
  ];

  return (
    <div className="chart-container">
      <div className="chart-title">📈 Detailed Statistics</div>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
            <th>Overall</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <strong>{row.metric}</strong>
              </td>
              <td>{row.l1}</td>
              <td>{row.l2}</td>
              <td>{row.overall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
