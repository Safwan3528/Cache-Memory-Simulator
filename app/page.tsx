'use client';

import { useState, useRef } from 'react';
import ConfigSidebar from './components/ConfigSidebar';
import ResultsDisplay from './components/ResultsDisplay';
import SimulationLoading from './components/SimulationLoading';
import { CacheConfig, SimulationResults } from '@/lib/types';
import { CacheSimulator } from '@/lib/cache-simulator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [config, setConfig] = useState<CacheConfig>({
    l1Size: 32,
    l1Assoc: 4,
    l2Size: 256,
    l2Assoc: 8,
    replacementPolicy: 'LRU',
    writePolicy: 'write-back',
    blockSize: 64,
    numAccesses: 10000,
  });

  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [traceLog, setTraceLog] = useState<any[]>([]);
  const simulatorRef = useRef<CacheSimulator | null>(null);

  const handleRunSimulation = () => {
    setIsLoading(true);
    setShowWelcome(false);
    setResults(null);

    // Run simulation after a short delay to show loading animation
    setTimeout(() => {
      const simulator = new CacheSimulator(config);
      simulatorRef.current = simulator;
      const simulationResults = simulator.simulate(config.numAccesses);

      setResults(simulationResults);
      setTraceLog(simulator.traceLog);
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setConfig({
      l1Size: 32,
      l1Assoc: 4,
      l2Size: 256,
      l2Assoc: 8,
      replacementPolicy: 'LRU',
      writePolicy: 'write-back',
      blockSize: 64,
      numAccesses: 10000,
    });
    setResults(null);
    setShowWelcome(true);
    setTraceLog([]);
    if (simulatorRef.current) {
      simulatorRef.current.reset();
    }
  };

  const handleExportPDF = async () => {
    const resultsElement = document.getElementById('results');
    if (!resultsElement) return;

    try {
      const canvas = await html2canvas(resultsElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `Cache_Simulator_Report_${config.l1Size}KB_${config.replacementPolicy}_${Date.now()}.pdf`;
      pdf.save(filename);

      alert('✅ PDF report generated successfully!\n\nFilename: ' + filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🖥️ Cache Memory Simulator</h1>
        <p>Design and Analysis of L1/L2 Cache Hierarchy</p>
        <p className="subtitle">Computer Architecture and Organization Project</p>
      </header>

      <div className="main-content">
        <ConfigSidebar
          config={config}
          onConfigChange={setConfig}
          onRunSimulation={handleRunSimulation}
          onReset={handleReset}
          isLoading={isLoading}
        />

        <main className="results-area">
          {isLoading && (
            <SimulationLoading totalAccesses={config.numAccesses} />
          )}

          {!isLoading && showWelcome && (
            <div className="welcome">
              <h2>Welcome to Cache Simulator</h2>
              <p>Configure your cache parameters and click &quot;Run Simulation&quot; to begin analysis.</p>
              <div className="welcome-icon">🖥️</div>
            </div>
          )}

          {!isLoading && results && (
            <>
              <ResultsDisplay results={results} config={config} traceLog={traceLog} />
              <button className="export-btn" onClick={handleExportPDF}>
                <span>📄</span> Export to PDF
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
