"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Smile, Frown, Clock, Home, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { showSuccess, showError } from '@/utils/toast';
import BreathingExercise from '@/components/BreathingExercise';

const ActivityTrackingPage = () => {
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [beforeMood, setBeforeMood] = useState(5);
  const [afterMood, setAfterMood] = useState(5);
  const [activityNotes, setActivityNotes] = useState('');
  const { activities, addActivity } = useActivityTracking();
  const navigate = useNavigate();

  const handleCompleteActivity = () => {
    try {
      addActivity({
        beforeMood,
        afterMood,
        notes: activityNotes
      });
      showSuccess('Activity completed and saved!');
      setBeforeMood(5);
      setAfterMood(5);
      setActivityNotes('');
    } catch (error) {
      showError('Failed to save activity');
      console.error('Error saving activity:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Track Your Activity</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6" />
            <div>
              <CardTitle>Breathing Exercise</CardTitle>
              <CardDescription>Calm your nervous system before tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showBreathingExercise ? (
            <BreathingExercise />
          ) : (
            <Button 
              onClick={() => setShowBreathingExercise(true)}
              className="w-full"
            >
              Start Breathing Exercise
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Track Your Mood</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2">Mood Before Activity</h3>
            <div className="flex items-center gap-4">
              <Frown className="text-red-500" />
              <Slider
                value={[beforeMood]}
                onValueChange={(value) => setBeforeMood(value[0])}
                min={1}
                max={10}
                step={1}
              />
              <Smile className="text-green-500" />
            </div>
            <p className="text-center mt-2">Rating: {beforeMood}/10</p>
          </div>

          <div>
            <h3 className="mb-2">Mood After Activity</h3>
            <div className="flex items-center gap-4">
              <Frown className="text-red-500" />
              <Slider
                value={[afterMood]}
                onValueChange={(value) => setAfterMood(value[0])}
                min={1}
                max={10}
                step={1}
              />
              <Smile className="text-green-500" />
            </div>
            <p className="text-center mt-2">Rating: {afterMood}/10</p>
          </div>

          <div>
            <h3 className="mb-2">Activity Notes</h3>
            <Textarea
              value={activityNotes}
              onChange={(e) => setActivityNotes(e.target.value)}
              placeholder="Describe the activity and how it affected you..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleCompleteActivity}
        className="w-full"
        disabled={!beforeMood || !afterMood}
      >
        Complete Activity
      </Button>

      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mood: {activity.beforeMood} → {activity.afterMood}
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
};

export default ActivityTrackingPage;