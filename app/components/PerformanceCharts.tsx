'use client';

import React from 'react';
import { SimulationResults } from '@/lib/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PerformanceChartsProps {
  results: SimulationResults;
}

export default function PerformanceCharts({ results }: PerformanceChartsProps) {
  // Hit Rate Comparison Chart Data
  const hitRateData = {
    labels: ['L1 Cache', 'L2 Cache', 'Overall'],
    datasets: [
      {
        label: 'Hit Rate (%)',
        data: [
          results.l1.hitRate,
          results.l2.hitRate,
          parseFloat(results.overall.hitRate),
        ],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(240, 147, 251, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(240, 147, 251, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const hitRateOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: any) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Hit Rate (%)',
        },
      },
    },
  };

  // Miss Rate Analysis Chart Data (Doughnut)
  const missRateData = {
    labels: ['L1 Hits', 'L1 Misses', 'L2 Hits', 'L2 Misses'],
    datasets: [
      {
        data: [results.l1.hits, results.l1.misses, results.l2.hits, results.l2.misses],
        backgroundColor: [
          'rgba(17, 153, 142, 0.8)',
          'rgba(255, 68, 68, 0.8)',
          'rgba(56, 239, 125, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(17, 153, 142, 1)',
          'rgba(255, 68, 68, 1)',
          'rgba(56, 239, 125, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const missRateOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return label + ': ' + value.toLocaleString() + ' (' + percentage + '%)';
          },
        },
      },
    },
  };

  // Performance Breakdown Chart Data (Grouped Bar)
  const performanceData = {
    labels: ['L1 Cache', 'L2 Cache'],
    datasets: [
      {
        label: 'Hits',
        data: [results.l1.hits, results.l2.hits],
        backgroundColor: 'rgba(17, 153, 142, 0.8)',
        borderColor: 'rgba(17, 153, 142, 1)',
        borderWidth: 2,
      },
      {
        label: 'Misses',
        data: [results.l1.misses, results.l2.misses],
        backgroundColor: 'rgba(255, 68, 68, 0.8)',
        borderColor: 'rgba(255, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return label + ': ' + value.toLocaleString();
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
        title: {
          display: true,
          text: 'Number of Accesses',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Cache Level',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-title">📊 Cache Performance Analytics</div>

      <div className="charts-grid">
        <div className="chart-wrapper">
          <h4>Hit Rate Comparison</h4>
          <Bar data={hitRateData} options={hitRateOptions} />
        </div>
        <div className="chart-wrapper">
          <h4>Miss Rate Analysis</h4>
          <Doughnut data={missRateData} options={missRateOptions} />
        </div>
      </div>

      <div className="single-chart-wrapper">
        <h4>Performance Breakdown (Hits vs Misses)</h4>
        <Bar data={performanceData} options={performanceOptions} />
      </div>
    </div>
  );
}
