// ... (previous imports remain the same)

export default function ActivitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ... (previous content remains the same) ... */}
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/mood-check')}  // This is correctly linked now
          className="mt-8"
        >
          How am I feeling right now?
        </Button>
      </div>
    </div>
  );
}