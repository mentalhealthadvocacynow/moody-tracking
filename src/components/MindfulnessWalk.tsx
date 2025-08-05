"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Footprints, Trees, Bird, Cloud } from 'lucide-react';

const MindfulnessWalk = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');

  const prompts = [
    "Notice the sensation of your feet touching the ground",
    "Listen to the sounds around you - how many can you identify?",
    "Observe the colors in your environment",
    "Feel the air on your skin - is it warm or cool?",
    "Notice any scents in the air",
    "Pay attention to your breathing as you walk"
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWalking) {
      timer = setInterval(() => {
        setStep(prev => (prev + 1) % 6);
        setPrompt(prompts[step]);
      }, 10000); // Change prompt every 10 seconds
    }
    return () => clearInterval(timer);
  }, [isWalking, step]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-xl font-semibold">Mindfulness Walk</h3>
      
      <div className="relative w-full h-40 bg-green-50 rounded-lg overflow-hidden">
        <div className={`absolute bottom-4 left-1/2 transition-transform duration-1000 ${isWalking ? 'translate-x-16' : 'translate-x-0'}`}>
          <Footprints className="text-gray-700 w-12 h-12" />
        </div>
        <Trees className="absolute bottom-4 left-8 text-green-700 w-8 h-8" />
        <Bird className={`absolute top-8 left-1/4 transition-all duration-500 ${isWalking ? 'translate-x-12' : 'translate-x-0'}`} />
        <Cloud className="absolute top-4 right-8 text-gray-300 w-10 h-10" />
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg w-full text-center">
        {isWalking ? (
          <p className="italic">{prompt}</p>
        ) : (
          <p>Press start to begin your mindful walk</p>
        )}
      </div>
      
      <Button onClick={() => setIsWalking(!isWalking)}>
        {isWalking ? 'Pause Walk' : 'Start Walk'}
      </Button>
      
      <p className="text-sm text-muted-foreground">
        Walk slowly while focusing on your senses and surroundings
      </p>
    </div>
  );
};

export default MindfulnessWalk;