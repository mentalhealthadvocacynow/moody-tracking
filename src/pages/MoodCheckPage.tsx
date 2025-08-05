"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';

export default function MoodCheckPage() {
  const [moodRating, setMoodRating] = useState(5);
  const [inControl, setInControl] = useState<string[]>([]);
  const [outOfControl, setOutOfControl] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState('');

  const handleAddInControl = () => {
    if (currentThought.trim()) {
      setInControl([...inControl, currentThought]);
      setCurrentThought('');
    }
  };

  const handleAddOutOfControl = () => {
    if (currentThought.trim()) {
      setOutOfControl([...outOfControl, currentThought]);
      setCurrentThought('');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">How Are You Feeling?</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Mood</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Frown className="w-8 h-8 text-red-500" />
            <Slider 
              value={[moodRating]} 
              onValueChange={(val) => setMoodRating(val[0])}
              min={1}
              max={10}
              step={1}
              className="w-full mx-4"
            />
            <Smile className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">
              {moodRating <= 3 ? "Feeling Low" : 
               moodRating <= 7 ? "Neutral" : "Feeling Good"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's On Your Mind?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write what you're thinking or feeling..."
            value={currentThought}
            onChange={(e) => setCurrentThought(e.target.value)}
          />
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleAddInControl}
              disabled={!currentThought.trim()}
            >
              In My Control
            </Button>
            <Button 
              variant="outline" 
              onClick={handleAddOutOfControl}
              disabled={!currentThought.trim()}
            >
              Out of My Control
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>In My Control</CardTitle>
          </CardHeader>
          <CardContent>
            {inControl.length > 0 ? (
              <ul className="space-y-2">
                {inControl.map((item, index) => (
                  <li key={index} className="p-2 bg-accent rounded">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing added yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Out of My Control</CardTitle>
          </CardHeader>
          <CardContent>
            {outOfControl.length > 0 ? (
              <ul className="space-y-2">
                {outOfControl.map((item, index) => (
                  <li key={index} className="p-2 bg-accent rounded">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing added yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}