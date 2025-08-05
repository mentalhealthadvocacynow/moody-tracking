"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Moon, BookOpen, Activity } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: "5-5-5 Breathing",
    description: "Calm your nervous system with this simple breathing exercise",
    duration: "5 min",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Gratitude Journal",
    description: "Write down things you're grateful for",
    duration: "10 min",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Mindfulness Walk",
    description: "Take a walk while focusing on your senses",
    duration: "15 min",
    icon: <Moon className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Self-Compassion Break",
    description: "Practice being kind to yourself",
    duration: "5 min",
    icon: <Heart className="w-6 h-6" />
  }
];

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Mental Health Activities</h1>
      <p className="text-muted-foreground">Choose an activity to improve your wellbeing</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button className="w-full">
                Try This Activity
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}