import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess } from '@/utils/toast';

type MoodEntry = {
  id: string;
  date: Date;
  mood: string;
  notes: string;
};

const moodOptions = [
  { value: 'happy', label: '😊 Happy', color: 'bg-green-500' },
  { value: 'neutral', label: '😐 Neutral', color: 'bg-yellow-500' },
  { value: 'sad', label: '😢 Sad', color: 'bg-blue-500' },
  { value: 'angry', label: '😠 Angry', color: 'bg-red-500' },
  { value: 'anxious', label: '😰 Anxious', color: 'bg-purple-500' },
];

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (!date || !selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date,
      mood: selectedMood,
      notes,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    
    setNotes('');
    setSelectedMood('');
    showSuccess('Mood entry saved!');
  };

  const getMoodData = () => {
    const moodCounts: Record<string, number> = {};
    
    moodOptions.forEach(mood => {
      moodCounts[mood.value] = entries.filter(e => e.mood === mood.value).length;
    });

    return moodOptions.map(mood => ({
      name: mood.label,
      count: moodCounts[mood.value],
      color: mood.color.replace('bg-', 'text-'),
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Mood Journal & Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Select your mood:</p>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? 'default' : 'outline'}
                    className={`${selectedMood === mood.value ? mood.color : ''}`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes (optional):</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveEntry} disabled={!date || !selectedMood}>
              Save Entry
            </Button>
          </CardFooter>
        </Card>

        {/* Mood History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMoodData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-gray-500">No entries yet</p>
              ) : (
                <div className="space-y-4">
                  {entries.slice(0, 5).map((entry) => {
                    const mood = moodOptions.find(m => m.value === entry.mood);
                    return (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className={`text-lg ${mood?.color}`}>{mood?.label}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="mt-2 text-gray-700">{entry.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;