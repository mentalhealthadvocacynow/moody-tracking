"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const prompts = [
  "What are three things you're grateful for today?",
  "Describe a recent challenge and how you handled it",
  "What's something that made you smile recently?",
  "Write about a personal strength you've used this week",
  "What's one thing you'd like to let go of?",
  "Describe your ideal day for mental wellbeing",
  "What self-care activity would you like to try?",
  "Write a letter to your future self",
  "What emotions are you feeling right now?",
  "List five things that make you feel calm"
];

const JournalPromptGenerator = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [usedPrompts, setUsedPrompts] = useState<number[]>([]);

  const getRandomPrompt = () => {
    if (usedPrompts.length === prompts.length) {
      setUsedPrompts([]);
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * prompts.length);
    } while (usedPrompts.includes(randomIndex));

    setUsedPrompts([...usedPrompts, randomIndex]);
    setCurrentPrompt(prompts[randomIndex]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Journal Prompt Generator</h3>
      
      {currentPrompt ? (
        <div className="p-4 bg-accent/50 rounded-lg">
          <p className="text-lg italic">"{currentPrompt}"</p>
        </div>
      ) : (
        <p className="text-muted-foreground">Click the button for a prompt</p>
      )}
      
      <Button onClick={getRandomPrompt} className="w-full">
        Get New Prompt
      </Button>
      
      <p className="text-sm text-muted-foreground">
        Prompts will not repeat until you've seen them all
      </p>
    </div>
  );
};

export default JournalPromptGenerator;