"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import JournalPromptGenerator from '@/components/JournalPromptGenerator';

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

export default function GratitudeJournalPage() {
  const [journalEntry, setJournalEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<string>(prompts[0]);
  const navigate = useNavigate();

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  const saveEntry = () => {
    if (!journalEntry.trim()) {
      showError('Please write something before saving');
      return;
    }

    try {
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        prompt: currentPrompt,
        content: journalEntry
      };
      localStorage.setItem('journalEntries', JSON.stringify([...entries, newEntry]));
      showSuccess('Journal entry saved!');
      setJournalEntry('');
      getRandomPrompt();
    } catch (error) {
      showError('Failed to save journal entry');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gratitude Journal</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6" />
            <CardTitle>Today's Journal Prompt</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-accent/10 rounded-lg">
            <p className="text-lg italic">"{currentPrompt}"</p>
          </div>
          <Button 
            variant="outline" 
            onClick={getRandomPrompt}
            className="w-full"
          >
            Get New Prompt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Button 
        onClick={saveEntry}
        className="w-full"
        disabled={!journalEntry.trim()}
      >
        Save Entry
      </Button>
    </div>
  );
}