"use client";

// ... (keep existing imports)

export default function MoodJournalPage() {
  // ... (keep existing state and functions)

  // Update the render section to show thoughts:
  {entries.length > 0 && (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map(entry => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mood: {entry.mood}/10
                  </p>
                </div>
                <div className="text-2xl">
                  {entry.mood >= 7 ? '😊' : entry.mood >= 4 ? '😐' : '😞'}
                </div>
              </div>
              {entry.notes && (
                <div className="mt-2 text-sm">
                  <p>{entry.notes}</p>
                  {entry.thoughts && (
                    <div className="mt-2 space-y-2">
                      {entry.thoughts.inControl.length > 0 && (
                        <div>
                          <p className="font-medium">Things I Can Control:</p>
                          <ul className="list-disc pl-5">
                            {entry.thoughts.inControl.map((thought, i) => (
                              <li key={i}>{thought}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.thoughts.outOfControl.length > 0 && (
                        <div>
                          <p className="font-medium">Things I Can't Control:</p>
                          <ul className="list-disc pl-5">
                            {entry.thoughts.outOfControl.map((thought, i) => (
                              <li key={i}>{thought}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  )}