import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, MessageSquareIcon } from 'lucide-react';

export function Sidebar() {
  const { setView, startNewConversation } = useApp();
  
  const handleViewArchive = () => {
    setView('archive');
  };
  
  const handleStartNewConversation = () => {
    startNewConversation();
  };
  
  const suggestedTopics = [
    "Personal philosophy and values",
    "Creative inspirations and process",
    "Thoughts on relationships and connection",
    "Professional journey and growth"
  ];
  
  return (
    <div className="lg:w-64 mt-4 lg:mt-0 lg:ml-4 lg:flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* About Rex */}
        <Card className="border border-amber-500/10 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-amber-100/50 to-cream pb-2 pt-4">
            <CardTitle className="text-base font-medium">About Rex</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-sm text-slate-700/80 mb-4">
              Rex is an emotional mirror of Mohsin Raja's inner world, capturing his thoughts, feelings, and reflections.
            </p>
            <p className="text-sm text-slate-700/80">
              Feel free to ask about his perspectives, personal philosophy, or emotional journey.
            </p>
          </CardContent>
        </Card>
        
        {/* Quick Access */}
        <Card className="border border-amber-500/10 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-amber-100/50 to-cream pb-2 pt-4">
            <CardTitle className="text-base font-medium">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <Button
              onClick={handleViewArchive}
              variant="ghost"
              className="w-full justify-start text-sm hover:bg-amber-100/30 h-10 px-3 mb-1"
            >
              <BookIcon className="h-4 w-4 mr-3 text-amber-500" />
              <span>Browse Reflection Archive</span>
            </Button>
            <Button
              onClick={handleStartNewConversation}
              variant="ghost"
              className="w-full justify-start text-sm hover:bg-amber-100/30 h-10 px-3"
            >
              <MessageSquareIcon className="h-4 w-4 mr-3 text-amber-500" />
              <span>Start New Conversation</span>
            </Button>
          </CardContent>
        </Card>
        
        {/* Suggested Topics */}
        <Card className="border border-amber-500/10 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-amber-100/50 to-cream pb-2 pt-4">
            <CardTitle className="text-base font-medium">Suggested Topics</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {suggestedTopics.map((topic, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-amber-100/30 h-auto py-2 px-3 mb-1 font-normal"
                onClick={() => startNewConversation()}
              >
                {topic}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
