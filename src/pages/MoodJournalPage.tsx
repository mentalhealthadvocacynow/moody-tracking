"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

type MoodEntry = {
  id: string;
  date: Date;
  mood: number;
  notes: string;
};

export default function MoodJournalPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodJournalEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convert string dates back to Date objects
        const withDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(withDates);
      } catch (e) {
        console.error("Failed to parse saved entries", e);
      }
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('moodJournalEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const handleSubmit = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date,
      mood,
      notes
    };

    setEntries([...entries, newEntry]);
    setNotes('');
    showSuccess('Mood entry saved!');
  };

  const getMoodData = () => {
    const last7Days = entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const today = new Date();
        const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
        return entryDate >= sevenDaysAgo;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return last7Days.map(entry => ({
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.mood
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mood Journal</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block mb-2">Select Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="rounded-md border"
              />
            </div>

            <div>
              <label className="block mb-2">How are you feeling?</label>
              <div className="flex items-center space-x-4">
                <Frown className="text-red-500" />
                <Slider 
                  value={[mood]} 
                  onValueChange={(val) => setMood(val[0])}
                  min={1}
                  max={10}
                  step={1}
                />
                <Smile className="text-green-500" />
              </div>
              <p className="text-center mt-2">Rating: {mood}/10</p>
            </div>

            <div>
              <label className="block mb-2">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's influencing your mood today?"
                rows={4}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={!date || !mood}
            >
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {/* Mood History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMoodData()}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="mood" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No mood entries yet. Add your first entry to see trends.
                </p>
              )}
            </CardContent>
          </Card>

          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
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
                        <p className="mt-2 text-sm">{entry.notes}</p>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}