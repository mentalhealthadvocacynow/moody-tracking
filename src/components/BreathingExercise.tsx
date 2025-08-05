"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (isRunning) {
      switch (phase) {
        case 'inhale':
          setPhase('hold');
          setCount(5);
          break;
        case 'hold':
          setPhase('exhale');
          setCount(5);
          break;
        case 'exhale':
          setPhase('rest');
          setCount(5);
          break;
        case 'rest':
          setPhase('inhale');
          setCount(5);
          break;
      }
    }

    return () => clearTimeout(timer);
  }, [count, isRunning, phase]);

  const getPhaseDescription = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Breathe out slowly';
      case 'rest': return 'Rest before next breath';
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale': return 'scale-110';
      case 'hold': return 'scale-110';
      case 'exhale': return 'scale-100';
      case 'rest': return 'scale-100';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-xl font-semibold">5-5-5 Breathing Exercise</h3>
      
      <div className={`w-40 h-40 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-1000 ${getCircleSize()}`}>
        <div className="text-4xl font-bold">{count}</div>
      </div>
      
      <p className="text-lg">{getPhaseDescription()}</p>
      
      <div className="flex space-x-4">
        <Button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" onClick={() => {
          setIsRunning(false);
          setPhase('inhale');
          setCount(5);
        }}>
          Reset
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Inhale for 5s → Hold for 5s → Exhale for 5s → Repeat
      </p>
    </div>
  );
};

export default BreathingExercise;