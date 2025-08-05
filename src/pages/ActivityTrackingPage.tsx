// ... (keep all imports and types the same)

const ActivityTrackingPage = () => {
  // ... (keep all existing state and effects)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ... (keep all other JSX the same until activity history section) */}

      {/* Updated Activity history section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Activity History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const activityDate = new Date(activity.date);
              return (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {activityDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {' at '}
                        {activityDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
              );
            })
          ) : (
            <p className="text-muted-foreground">No activities recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTrackingPage;