"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HandHeart, Sparkles } from 'lucide-react';

const SelfCompassionBreak = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const steps = [
    {
      title: "Acknowledge",
      prompt: "Recognize this is a difficult moment",
      instruction: "Place your hand on your heart and say: 'This is hard right now'"
    },
    {
      title: "Common Humanity",
      prompt: "Remember you're not alone",
      instruction: "Say: 'Others feel this way too. I'm not alone in this'"
    },
    {
      title: "Kindness",
      prompt: "Offer yourself kindness",
      instruction: "Say: 'May I be kind to myself in this moment'"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsActive(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-xl font-semibold">Self-Compassion Break</h3>
      
      {!isActive ? (
        <div className="text-center space-y-4">
          <Heart className="mx-auto w-12 h-12 text-pink-500" />
          <p>Take a moment to offer yourself kindness and understanding</p>
          <Button onClick={() => setIsActive(true)}>Begin Practice</Button>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div className="p-4 bg-pink-50 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              {currentStep === 0 && <HandHeart className="w-5 h-5" />}
              {currentStep === 1 && <Sparkles className="w-5 h-5" />}
              {currentStep === 2 && <Heart className="w-5 h-5" />}
              {steps[currentStep].title}
            </h4>
            <p className="mt-2 italic">{steps[currentStep].prompt}</p>
            <p className="mt-3 text-sm bg-white p-3 rounded">{steps[currentStep].instruction}</p>
          </div>
          
          <Button onClick={nextStep} className="w-full">
            {currentStep < steps.length - 1 ? 'Next Step' : 'Finish'}
          </Button>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        Based on Dr. Kristin Neff's self-compassion research
      </p>
    </div>
  );
};

export default SelfCompassionBreak;