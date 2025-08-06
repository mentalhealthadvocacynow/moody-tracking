"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

type MoodEntry = {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleepQuality: number;
  notes: string;
  activities: string[];
};

export default function MoodJournalPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [newEntry, setNewEntry] = useState<Omit<MoodEntry, 'id'>>({
    date: new Date().toISOString(),
    mood: 5,
    energy: 5,
    stress: 5,
    sleepQuality: 5,
    notes: '',
    activities: []
  });

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

  const saveEntry = () => {
    try {
      const entryToSave: MoodEntry = {
        ...newEntry,
        id: Date.now().toString(),
        date: selectedDate.toISOString()
      };

      const updatedEntries = [...entries.filter(e => 
        new Date(e.date).toDateString() !== selectedDate.toDateString()
      ), entryToSave];

      localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      showSuccess('Mood entry saved successfully!');
    } catch (error) {
      showError('Failed to save entry');
      console.error(error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    
    switch (timeRange) {
      case 'day':
        return entryDate.toDateString() === selectedDate.toDateString();
      case 'week':
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return entryDate >= weekStart && entryDate <= weekEnd;
      case 'month':
        return (
          entryDate.getMonth() === selectedDate.getMonth() &&
          entryDate.getFullYear() === selectedDate.getFullYear()
        );
      case 'year':
        return entryDate.getFullYear() === selectedDate.getFullYear();
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mood Journal</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Entry Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Mood Entry</CardTitle>
            <CardDescription>
              Track how you're feeling today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Date
              </label>
              <DatePicker
                date={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Mood (1-10)
              </label>
              <Slider
                value={[newEntry.mood]}
                onValueChange={(val) => setNewEntry({...newEntry, mood: val[0]})}
                min={1}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>😞 Very Low</span>
                <span>😊 Very High</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Energy Level (1-10)
              </label>
              <Slider
                value={[newEntry.energy]}
                onValueChange={(val) => setNewEntry({...newEntry, energy: val[0]})}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Stress Level (1-10)
              </label>
              <Slider
                value={[newEntry.stress]}
                onValueChange={(val) => setNewEntry({...newEntry, stress: val[0]})}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Sleep Quality (1-10)
              </label>
              <Slider
                value={[newEntry.sleepQuality]}
                onValueChange={(val) => setNewEntry({...newEntry, sleepQuality: val[0]})}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Notes
              </label>
              <Textarea
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                placeholder="Any additional thoughts or observations..."
              />
            </div>

            <Button onClick={saveEntry} className="w-full">
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {/* Entries List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Mood History</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('day')}
                >
                  Day
                </Button>
                <Button
                  variant={timeRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </Button>
                <Button
                  variant={timeRange === 'year' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('year')}
                >
                  Year
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEntries.length > 0 ? (
              <div className="space-y-4">
                {filteredEntries
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
                          <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Mood</p>
                              <p>{entry.mood}/10</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Energy</p>
                              <p>{entry.energy}/10</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Stress</p>
                              <p>{entry.stress}/10</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sleep</p>
                              <p>{entry.sleepQuality}/10</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl">
                          {entry.mood >= 7 ? '😊' : entry.mood >= 4 ? '😐' : '😞'}
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="mt-3 p-3 bg-muted/50 rounded">
                          <p>{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No entries found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by creating a new mood entry
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}