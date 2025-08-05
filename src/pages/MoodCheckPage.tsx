"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

type MoodEntryDraft = {
  moodRating: number;
  inControl: string[];
  outOfControl: string[];
  currentThought: string;
};

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

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('moodCheckDraft');
      if (savedDraft) {
        const draft: MoodEntryDraft = JSON.parse(savedDraft);
        setMoodRating(draft.moodRating);
        setInControl(draft.inControl);
        setOutOfControl(draft.outOfControl);
        setCurrentThought(draft.currentThought);
      }
    } catch (error) {
      console.error('Failed to load draft', error);
    }
  }, []);

  // Save draft to localStorage whenever state changes
  useEffect(() => {
    const draft: MoodEntryDraft = {
      moodRating,
      inControl,
      outOfControl,
      currentThought
    };
    localStorage.setItem('moodCheckDraft', JSON.stringify(draft));
  }, [moodRating, inControl, outOfControl, currentThought]);

  const handleAddInControl = () => {
    if (currentThought.trim()) {
      const updated = [...inControl, currentThought];
      setInControl(updated);
      setCurrentThought('');
    }
  };

  const handleAddOutOfControl = () => {
    if (currentThought.trim()) {
      const updated = [...outOfControl, currentThought];
      setOutOfControl(updated);
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
      
      // Clear draft after saving to journal
      localStorage.removeItem('moodCheckDraft');
      setMoodRating(5);
      setInControl([]);
      setOutOfControl([]);
      setCurrentThought('');
      
      showSuccess('Mood check saved to journal!');
      navigate('/mood-journal');
    } catch (error) {
      showError('Failed to save to journal');
      console.error('Error saving to journal:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">How Am I Feeling Right Now?</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Your Current Mood</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <p className="text-center">Your mood: {moodRating}/10</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thoughts & Feelings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="What's on your mind?"
            />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleAddInControl}
                disabled={!currentThought.trim()}
              >
                Add to "I Can Control"
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddOutOfControl}
                disabled={!currentThought.trim()}
              >
                Add to "I Can't Control"
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Things I Can Control</h3>
              {inControl.length > 0 ? (
                <ul className="space-y-1">
                  {inControl.map((thought, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{thought}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setInControl(inControl.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No thoughts added yet</p>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Things I Can't Control</h3>
              {outOfControl.length > 0 ? (
                <ul className="space-y-1">
                  {outOfControl.map((thought, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{thought}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setOutOfControl(outOfControl.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No thoughts added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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