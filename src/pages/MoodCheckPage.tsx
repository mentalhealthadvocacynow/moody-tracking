"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

type MoodEntry = {
  id: string;
  date: Date;
  mood: number;
  notes: string;
  thoughts?: {
    inControl: string[];
    outOfControl: string[];
  };
};

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

  const saveToJournal = () => {
    try {
      const entries: MoodEntry[] = JSON.parse(localStorage.getItem('moodJournalEntries') || '[]');
      
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: moodRating,
        notes: `In Control: ${inControl.join(', ')}\nOut of Control: ${outOfControl.join(', ')}`,
        thoughts: {
          inControl,
          outOfControl
        }
      };

      const updatedEntries = [...entries, newEntry];
      localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries));
      showSuccess('Mood check saved to journal!');
      navigate('/mood-journal');
    } catch (error) {
      showError('Failed to save to journal');
      console.error('Error saving to journal:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ... (rest of the existing JSX remains the same until the buttons section) ... */}

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={saveToJournal}
          disabled={inControl.length === 0 && outOfControl.length === 0}
        >
          Save to Journal
        </Button>
        <Button onClick={() => navigate('/')}>
          I'm Done
        </Button>
      </div>
    </div>
  );
}