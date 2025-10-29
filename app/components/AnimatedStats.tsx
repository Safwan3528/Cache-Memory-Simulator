'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedStatsProps {
  value: number | string;
  duration?: number;
}

export default function AnimatedStats({ value, duration = 1000 }: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    if (typeof value === 'number') {
      const startValue = 0;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [value, duration]);

  return (
    <span className="animated-value">
      {typeof value === 'number' 
        ? Math.round(displayValue * 100) / 100 
        : value}
    </span>
  );
}
