'use client';

import React from 'react';

interface TraceLogProps {
  traceLog: Array<{
    index: number;
    address: string;
    type: string;
    status: string;
  }>;
}

export default function TraceLog({ traceLog }: TraceLogProps) {
  return (
    <div className="trace-log">
      <div className="trace-log-title">🔍 Memory Access Trace (Last 50 accesses)</div>
      <div className="trace-output">
        {traceLog.map((entry, idx) => {
          const statusClass = entry.status.includes('L1 HIT') ? 'hit' : 'miss';

          return (
            <div key={idx} className="trace-entry">
              <span className="trace-index">[{entry.index.toString().padStart(5, '0')}]</span>{' '}
              <span className="trace-address">0x{entry.address}</span>{' '}
              <span className="trace-type">{entry.type.padEnd(5)}</span>{' '}
              <span className={statusClass}>{entry.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
