import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { Plus, Trash2, Bell, Clock, Heart } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';
import JournalPromptGenerator from '@/components/JournalPromptGenerator';
import { useReminders } from '@/hooks/useReminders';

type Activity = {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
};

type Toolkit = {
  id: string;
  name: string;
  description: string;
  activities: Activity[];
  lastUsed?: Date;
};

type MoodEntry = {
  id: string;
  date: Date;
  mood: number;
  notes: string;
};

export default function MentalHealthToolkit() {
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [currentToolkit, setCurrentToolkit] = useState<Toolkit | null>(null);
  const [newToolkitName, setNewToolkitName] = useState('');
  const [newToolkitDesc, setNewToolkitDesc] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [moodNotes, setMoodNotes] = useState('');
  const [reminderTime, setReminderTime] = useState('12:00');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);

  useReminders(reminderTime);

  // Load data from localStorage
  useEffect(() => {
    const savedToolkits = localStorage.getItem('mentalHealthToolkits');
    const savedMoods = localStorage.getItem('moodEntries');
    const savedReminder = localStorage.getItem('reminderTime');

    if (savedToolkits) setToolkits(JSON.parse(savedToolkits));
    if (savedMoods) setMoodEntries(JSON.parse(savedMoods));
    if (savedReminder) setReminderTime(savedReminder);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mentalHealthToolkits', JSON.stringify(toolkits));
  }, [toolkits]);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('reminderTime', reminderTime);
  }, [reminderTime]);

  const createToolkit = () => {
    if (!newToolkitName.trim()) {
      showError('Please enter a toolkit name');
      return;
    }

    const newToolkit: Toolkit = {
      id: Date.now().toString(),
      name: newToolkitName,
      description: newToolkitDesc,
      activities: [],
    };

    setToolkits([...toolkits, newToolkit]);
    setNewToolkitName('');
    setNewToolkitDesc('');
    showSuccess('Toolkit created!');
  };

  // ... (rest of your component functions remain the same)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Mental Health Toolkit</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Toolkits */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Toolkits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="New toolkit name"
                  value={newToolkitName}
                  onChange={(e) => setNewToolkitName(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newToolkitDesc}
                  onChange={(e) => setNewToolkitDesc(e.target.value)}
                />
                <Button onClick={createToolkit} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Create Toolkit
                </Button>
              </div>

              {/* ... (rest of your JSX remains the same) ... */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}