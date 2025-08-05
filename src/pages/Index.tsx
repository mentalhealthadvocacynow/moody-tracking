import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { Plus, Trash2, Bell, Clock, Heart } from 'lucide-react';

type Activity = {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
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
  mood: number; // 1-5 scale
  notes: string;
};

const MentalHealthToolkit = () => {
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [currentToolkit, setCurrentToolkit] = useState<Toolkit | null>(null);
  const [newToolkitName, setNewToolkitName] = useState('');
  const [newToolkitDesc, setNewToolkitDesc] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [moodNotes, setMoodNotes] = useState('');
  const [reminderTime, setReminderTime] = useState('12:00');

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

  const deleteToolkit = (id: string) => {
    setToolkits(toolkits.filter(t => t.id !== id));
    if (currentToolkit?.id === id) setCurrentToolkit(null);
  };

  const addActivity = (toolkitId: string, activity: Omit<Activity, 'id' | 'completed'>) => {
    setToolkits(toolkits.map(t => {
      if (t.id === toolkitId) {
        return {
          ...t,
          activities: [
            ...t.activities,
            {
              ...activity,
              id: Date.now().toString(),
              completed: false
            }
          ]
        };
      }
      return t;
    }));
  };

  const logMood = () => {
    if (currentMood === null) {
      showError('Please select your mood');
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentMood,
      notes: moodNotes,
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setCurrentMood(null);
    setMoodNotes('');
    showSuccess('Mood logged!');
  };

  const getMoodData = () => {
    const last7Days = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return last7Days.map(date => {
      const entries = moodEntries.filter(e => 
        new Date(e.date).toLocaleDateString() === date
      );
      const avgMood = entries.length > 0 
        ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
        : null;
      
      return {
        date,
        mood: avgMood
      };
    });
  };

  const predefinedActivities = [
    {
      title: 'Deep Breathing',
      description: '5-5-5 breathing: Inhale for 5s, hold for 5s, exhale for 5s',
      duration: 5
    },
    {
      title: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for today',
      duration: 10
    },
    {
      title: 'Mindful Walk',
      description: 'Take a short walk while focusing on your surroundings',
      duration: 15
    }
  ];

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

              <div className="space-y-2">
                {toolkits.map(toolkit => (
                  <div 
                    key={toolkit.id} 
                    className={`p-3 rounded-lg border cursor-pointer ${currentToolkit?.id === toolkit.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                    onClick={() => setCurrentToolkit(toolkit)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{toolkit.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteToolkit(toolkit.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    {toolkit.description && (
                      <p className="text-sm text-muted-foreground mt-1">{toolkit.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentMood === num ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}
                    onClick={() => setCurrentMood(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Notes about your mood (optional)"
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
              />
              <Button onClick={logMood} disabled={currentMood === null}>
                Log Mood
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Current Toolkit */}
        <div className="space-y-4">
          {currentToolkit ? (
            <Card>
              <CardHeader>
                <CardTitle>{currentToolkit.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentToolkit.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Activities</h3>
                  {currentToolkit.activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activities yet</p>
                  ) : (
                    <div className="space-y-2">
                      {currentToolkit.activities.map(activity => (
                        <div key={activity.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> {activity.duration} min
                              </span>
                              <Button 
                                variant={activity.completed ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => {
                                  setToolkits(toolkits.map(t => {
                                    if (t.id === currentToolkit.id) {
                                      return {
                                        ...t,
                                        activities: t.activities.map(a => 
                                          a.id === activity.id 
                                            ? { ...a, completed: !a.completed } 
                                            : a
                                        )
                                      };
                                    }
                                    return t;
                                  }));
                                }}
                              >
                                {activity.completed ? 'Completed' : 'Mark Complete'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Add Activity</h3>
                  <Input placeholder="Activity title" id="activity-title" />
                  <Textarea placeholder="Description" id="activity-desc" />
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      placeholder="Duration (min)" 
                      id="activity-duration" 
                      className="w-24" 
                    />
                    <Button
                      onClick={() => {
                        const title = (document.getElementById('activity-title') as HTMLInputElement).value;
                        const description = (document.getElementById('activity-desc') as HTMLTextAreaElement).value;
                        const duration = parseInt((document.getElementById('activity-duration') as HTMLInputElement).value);

                        if (!title || !description || isNaN(duration)) {
                          showError('Please fill all fields');
                          return;
                        }

                        addActivity(currentToolkit.id, { title, description, duration });
                        (document.getElementById('activity-title') as HTMLInputElement).value = '';
                        (document.getElementById('activity-desc') as HTMLTextAreaElement).value = '';
                        (document.getElementById('activity-duration') as HTMLInputElement).value = '';
                        showSuccess('Activity added!');
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Quick Add</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedActivities.map((activity, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="justify-start"
                        onClick={() => addActivity(currentToolkit.id, activity)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {activity.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select or Create a Toolkit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose a toolkit from the left panel or create a new one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats & Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMoodData()}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="mood" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <Input 
                  type="time" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <Button className="w-full">
                Set Daily Reminder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {predefinedActivities.map((activity, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> {activity.duration} min
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!currentToolkit}
                      onClick={() => currentToolkit && addActivity(currentToolkit.id, activity)}
                    >
                      Add to Toolkit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthToolkit;