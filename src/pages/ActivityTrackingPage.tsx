"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Clock } from 'lucide-react';

export default function ActivityTrackingPage() {
  const [beforeMood, setBeforeMood] = useState(5);
  const [afterMood, setAfterMood] = useState(5);
  const [activityNotes, setActivityNotes] = useState('');
  const [completedActivities, setCompletedActivities] = useState<Array<{
    id: number;
    beforeMood: number;
    afterMood: number;
    notes: string;
    date: Date;
  }>>([]);

  const handleCompleteActivity = () => {
    setCompletedActivities([
      ...completedActivities,
      {
        id: Date.now(),
        beforeMood,
        afterMood,
        notes: activityNotes,
        date: new Date()
      }
    ]);
    setActivityNotes('');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Track Your Activity</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Before Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Frown className="w-8 h-8 text-red-500" />
              <Slider 
                value={[beforeMood]} 
                onValueChange={(val) => setBeforeMood(val[0])}
                min={1}
                max={10}
                step={1}
                className="w-full mx-4"
              />
              <Smile className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>After Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Frown className="w-8 h-8 text-red-500" />
              <Slider 
                value={[afterMood]} 
                onValueChange={(val) => setAfterMood(val[0])}
                min={1}
                max={10}
                step={1}
                className="w-full mx-4"
              />
              <Smile className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How did the activity make you feel? Any insights?"
            value={activityNotes}
            onChange={(e) => setActivityNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button 
        className="w-full" 
        onClick={handleCompleteActivity}
        disabled={!activityNotes.trim()}
      >
        Complete Activity
      </Button>

      {completedActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedActivities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mood change: {activity.beforeMood} → {activity.afterMood}
                    </p>
                  </div>
                  <Clock className="text-muted-foreground" />
                </div>
                {activity.notes && (
                  <p className="mt-2 text-sm">{activity.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}