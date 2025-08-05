"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Clock, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { showSuccess, showError } from '@/utils/toast';

type ActivityDraft = {
  beforeMood: number;
  afterMood: number;
  activityNotes: string;
};

const ActivityTrackingPage = () => {
  const navigate = useNavigate();
  const [beforeMood, setBeforeMood] = useState(5);
  const [afterMood, setAfterMood] = useState(5);
  const [activityNotes, setActivityNotes] = useState('');
  const { activities, addActivity, weeklyActivities } = useActivityTracking();

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('activityTrackingDraft');
      if (savedDraft) {
        const draft: ActivityDraft = JSON.parse(savedDraft);
        setBeforeMood(draft.beforeMood);
        setAfterMood(draft.afterMood);
        setActivityNotes(draft.activityNotes);
      }
    } catch (error) {
      console.error('Failed to load draft', error);
    }
  }, []);

  // Save draft to localStorage whenever state changes
  useEffect(() => {
    const draft: ActivityDraft = {
      beforeMood,
      afterMood,
      activityNotes
    };
    localStorage.setItem('activityTrackingDraft', JSON.stringify(draft));
  }, [beforeMood, afterMood, activityNotes]);

  const handleCompleteActivity = () => {
    try {
      addActivity({
        beforeMood,
        afterMood,
        notes: activityNotes
      });
      showSuccess('Activity completed and saved!');
      localStorage.removeItem('activityTrackingDraft');
      setBeforeMood(5);
      setAfterMood(5);
      setActivityNotes('');
      navigate('/');
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
          <CardTitle>Track Your Mood</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2">Mood Before Activity</label>
            <div className="flex items-center space-x-4">
              <Frown className="text-red-500" />
              <Slider 
                value={[beforeMood]} 
                onValueChange={(val) => setBeforeMood(val[0])}
                min={1}
                max={10}
                step={1}
              />
              <Smile className="text-green-500" />
            </div>
            <p className="text-center mt-2">Rating: {beforeMood}/10</p>
          </div>

          <div>
            <label className="block mb-2">Mood After Activity</label>
            <div className="flex items-center space-x-4">
              <Frown className="text-red-500" />
              <Slider 
                value={[afterMood]} 
                onValueChange={(val) => setAfterMood(val[0])}
                min={1}
                max={10}
                step={1}
              />
              <Smile className="text-green-500" />
            </div>
            <p className="text-center mt-2">Rating: {afterMood}/10</p>
          </div>

          <div>
            <label className="block mb-2">Notes</label>
            <Textarea
              value={activityNotes}
              onChange={(e) => setActivityNotes(e.target.value)}
              placeholder="How did the activity make you feel?"
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        className="w-full" 
        onClick={handleCompleteActivity}
        disabled={!beforeMood || !afterMood}
      >
        Complete Activity
      </Button>

      {/* Activity history section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(activity.date).toLocaleDateString()} at{' '}
                        {new Date(activity.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
              ))
          ) : (
            <p className="text-muted-foreground">No activities recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTrackingPage;