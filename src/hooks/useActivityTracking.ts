"use client";

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/utils/toast';

type Activity = {
  id: number;
  beforeMood: number;
  afterMood: number;
  notes: string;
  date: string; // Changed to string for proper serialization
};

export const useActivityTracking = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mentalHealthActivities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActivities(parsed);
      } catch (e) {
        console.error("Failed to parse saved activities", e);
        // Clear corrupted data
        localStorage.removeItem('mentalHealthActivities');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mentalHealthActivities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      id: Date.now(),
      date: new Date().toISOString(), // Store as ISO string
      ...activity
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const getActivities = () => {
    return [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return {
    activities: getActivities(),
    addActivity,
    weeklyActivities: getActivities().filter(a => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(a.date) > oneWeekAgo;
    })
  };
};