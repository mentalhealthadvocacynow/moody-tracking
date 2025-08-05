"use client";

import { useState, useEffect } from 'react';

export const useActivityTracking = () => {
  const [activities, setActivities] = useState<Array<{
    id: number;
    beforeMood: number;
    afterMood: number;
    notes: string;
    date: Date;
  }>>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mentalHealthActivities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        const withDates = parsed.map((a: any) => ({
          ...a,
          date: new Date(a.date)
        }));
        setActivities(withDates);
      } catch (e) {
        console.error("Failed to parse saved activities", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('mentalHealthActivities', JSON.stringify(activities));
    }
  }, [activities]);

  const addActivity = (activity: {
    beforeMood: number;
    afterMood: number;
    notes: string;
  }) => {
    const newActivity = {
      id: Date.now(),
      date: new Date(),
      ...activity
    };
    setActivities(prev => [...prev, newActivity]);
  };

  return {
    activities,
    addActivity,
    weeklyActivities: activities.filter(a => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return a.date > oneWeekAgo;
    }),
    monthlyActivities: activities.filter(a => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return a.date > oneMonthAgo;
    }),
    yearlyActivities: activities.filter(a => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return a.date > oneYearAgo;
    })
  };
};