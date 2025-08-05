"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

type MoodEntry = {
  id: string;
  date: string;
  mood: number;
  notes: string;
  thoughts?: {
    inControl: string[];
    outOfControl: string[];
  };
};

export default function MoodJournalPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('moodJournalEntries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      showError('Failed to load journal entries');
      console.error(error);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mood Journal</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Mood History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(entry => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mood: {entry.mood}/10
                      </p>
                    </div>
                    <div className="text-2xl">
                      {entry.mood >= 7 ? '😊' : entry.mood >= 4 ? '😐' : '😞'}
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-2 text-sm">
                      <p>{entry.notes}</p>
                      {entry.thoughts && (
                        <div className="mt-2 space-y-2">
                          {entry.thoughts.inControl.length > 0 && (
                            <div>
                              <p className="font-medium">Things I Can Control:</p>
                              <ul className="list-disc pl-5">
                                {entry.thoughts.inControl.map((thought, i) => (
                                  <li key={i}>{thought}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {entry.thoughts.outOfControl.length > 0 && (
                            <div>
                              <p className="font-medium">Things I Can't Control:</p>
                              <ul className="list-disc pl-5">
                                {entry.thoughts.outOfControl.map((thought, i) => (
                                  <li key={i}>{thought}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Entries Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your mood journal entries will appear here after you complete mood checks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}