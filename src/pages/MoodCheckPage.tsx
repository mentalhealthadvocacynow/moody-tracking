"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MoodCheckPage() {
  const navigate = useNavigate();
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">How Are You Feeling?</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Mood Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-2">Rate your current mood</label>
            <div className="flex items-center space-x-4">
              <Frown className="text-red-500" />
              <Slider 
                value={[moodRating]} 
                onValueChange={(val) => setMoodRating(val[0])}
                min={1}
                max={10}
                step={1}
              />
              <Smile className="text-green-500" />
            </div>
            <p className="text-center mt-2">Rating: {moodRating}/10</p>
          </div>

          <div className="space-y-4">
            <label className="block mb-2">What's on your mind?</label>
            <Textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="Write down what you're thinking or feeling..."
            />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleAddInControl}
                disabled={!currentThought.trim()}
              >
                Things I Can Control
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddOutOfControl}
                disabled={!currentThought.trim()}
              >
                Things I Can't Control
              </Button>
            </div>
          </div>

          {(inControl.length > 0 || outOfControl.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inControl.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Things I Can Control</h3>
                  <ul className="space-y-1">
                    {inControl.map((thought, index) => (
                      <li key={index} className="text-sm">• {thought}</li>
                    ))}
                  </ul>
                </div>
              )}
              {outOfControl.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Things I Can't Control</h3>
                  <ul className="space-y-1">
                    {outOfControl.map((thought, index) => (
                      <li key={index} className="text-sm">• {thought}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/mood-journal')}
        >
          Save to Journal
        </Button>
        <Button>
          I'm Done
        </Button>
      </div>
    </div>
  );
}