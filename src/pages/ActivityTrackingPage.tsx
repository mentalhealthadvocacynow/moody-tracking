const handleCompleteActivity = () => {
  try {
    // Save the activity data
    addActivity({
      beforeMood,
      afterMood,
      notes: activityNotes
    });

    // Show success notification
    showSuccess('Activity completed and saved!');

    // Clear the form and local storage draft
    setBeforeMood(5);
    setAfterMood(5);
    setActivityNotes('');
    localStorage.removeItem('activityTrackingDraft');

    // Navigate back to home
    navigate('/');
  } catch (error) {
    console.error('Error saving activity:', error);
    showError('Failed to save activity');
  }
};