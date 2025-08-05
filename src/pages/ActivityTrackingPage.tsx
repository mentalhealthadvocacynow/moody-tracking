"use client";

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Frown, Clock, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export default function ActivityTrackingPage() {
  const navigate = useNavigate();
  const [beforeMood, setBeforeMood] = useState(5);
  const [afterMood, setAfterMood] = useState(5);
  const [activityNotes, setActivityNotes] = useState('');
  const { activities, addActivity, weeklyActivities, monthlyActivities, yearlyActivities } = useActivityTracking();

  const handleCompleteActivity = () => {
    addActivity({
      beforeMood,
      afterMood,
      notes: activityNotes
    });
    setActivityNotes('');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ... (rest of your UI with the new grouped activities) ... */}
    </div>
  );
}