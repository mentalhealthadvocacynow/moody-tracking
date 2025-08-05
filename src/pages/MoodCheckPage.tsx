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

  // ... (rest of the component remains the same)
}