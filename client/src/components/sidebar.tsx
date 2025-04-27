import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, MessageSquareIcon, FolderIcon } from 'lucide-react';

export function Sidebar() {
  const { 
    setView, 
    startNewConversation, 
    categories, 
    selectedCategoryId, 
    setSelectedCategoryId 
  } = useApp();
  
  const handleViewArchive = () => {
    setView('archive');
  };
  
  const handleStartNewConversation = () => {
    startNewConversation();
  };
  
  const handleCategoryClick = (categoryId: number) => {
    setView('archive');
    setSelectedCategoryId(categoryId);
  };
  
  const suggestedTopics = [
    "Personal philosophy and values",
    "Creative inspirations and process",
    "Thoughts on relationships and connection", 
    "Professional journey and growth",
    "Emotional milestones and lessons",
    "Hopes and dreams for the future",
    "Challenges I've overcome",
    "What vulnerability means to me"
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
        
        {/* Categories */}
        {categories && categories.length > 0 && (
          <Card className="border border-amber-500/10 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-amber-100/50 to-cream pb-2 pt-4">
              <CardTitle className="text-base font-medium">Content Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start text-sm hover:bg-amber-100/30 h-auto py-2 px-3 mb-1 font-normal ${
                    selectedCategoryId === category.id ? 'bg-amber-100/70 text-amber-900' : ''
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <FolderIcon className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{category.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
        
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
                onClick={() => {
                  startNewConversation();
                  // Use a small timeout to ensure the conversation view is loaded
                  setTimeout(() => {
                    // Create a custom event to set the message input
                    const event = new CustomEvent('set-message-input', { 
                      detail: { message: `I'd like to talk about "${topic}". What are your thoughts?` }
                    });
                    window.dispatchEvent(event);
                  }, 100);
                }}
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
