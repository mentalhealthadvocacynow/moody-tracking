"use client";
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Moon, BookOpen, Activity, CalendarDays, Footprints } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';
import JournalPromptGenerator from '@/components/JournalPromptGenerator';
import MindfulnessWalk from '@/components/MindfulnessWalk';
import SelfCompassionBreak from '@/components/SelfCompassionBreak';

const activities = [
  {
    id: 1,
    title: "5-5-5 Breathing",
    description: "Calm your nervous system with this simple breathing exercise",
    duration: "5 min",
    icon: <Activity className="w-6 h-6" />,
    component: <BreathingExercise />
  },
  {
    id: 2,
    title: "Journal Prompts",
    description: "Reflective writing to process thoughts and feelings",
    duration: "10 min",
    icon: <BookOpen className="w-6 h-6" />,
    component: <JournalPromptGenerator />
  },
  {
    id: 3,
    title: "Mindfulness Walk",
    description: "Take a walk while focusing on your senses",
    duration: "15 min",
    icon: <Footprints className="w-6 h-6" />,
    component: <MindfulnessWalk />
  },
  {
    id: 4,
    title: "Self-Compassion Break",
    description: "Practice being kind to yourself",
    duration: "5 min",
    icon: <Heart className="w-6 h-6" />,
    component: <SelfCompassionBreak />
  },
  {
    id: 5,
    title: "Mood Journal",
    description: "Track your daily moods and identify patterns",
    duration: "5 min",
    icon: <CalendarDays className="w-6 h-6" />,
    onClick: () => navigate('/mood-journal')
  }
];

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Mental Health Activities</h1>
      <p className="text-muted-foreground">Choose an activity to improve your wellbeing</p>
      
      {selectedActivity ? (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedActivity(null)}
            className="flex items-center gap-2"
          >
            ← Back to Activities
          </Button>
          {activities.find(a => a.id === selectedActivity)?.component}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  {activity.icon}
                </div>
                <div>
                  <CardTitle>{activity.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{activity.duration}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{activity.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => activity.onClick ? activity.onClick() : setSelectedActivity(activity.id)}
                >
                  Try This Activity
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}