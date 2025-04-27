import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, MessageSquareIcon, FolderIcon, HeartIcon, SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="lg:w-72 mt-4 lg:mt-0 lg:ml-4 lg:flex-shrink-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <div className="sticky top-4 space-y-4">
        {/* About Rex */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border border-amber-200/60 shadow-md bg-amber-50/30 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 pb-2 pt-4 border-b border-amber-200/50">
              <CardTitle className="text-base font-medium flex items-center">
                <HeartIcon className="w-4 h-4 mr-2 text-amber-500" />
                About Rex
              </CardTitle>
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
        </motion.div>
        
        {/* Quick Access */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border border-amber-200/60 shadow-md bg-amber-50/30 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 pb-2 pt-4 border-b border-amber-200/50">
              <CardTitle className="text-base font-medium flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2 text-amber-500" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={handleViewArchive}
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-amber-100/60 hover:text-amber-900 h-10 px-3 mb-1 transition-all duration-200"
                >
                  <BookIcon className="h-4 w-4 mr-3 text-amber-500" />
                  <span>Browse Reflection Archive</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={handleStartNewConversation}
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-amber-100/60 hover:text-amber-900 h-10 px-3 transition-all duration-200"
                >
                  <MessageSquareIcon className="h-4 w-4 mr-3 text-amber-500" />
                  <span>Start New Conversation</span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Categories */}
        {categories && categories.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="border border-amber-200/60 shadow-md bg-amber-50/30 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 pb-2 pt-4 border-b border-amber-200/50">
                <CardTitle className="text-base font-medium flex items-center">
                  <FolderIcon className="w-4 h-4 mr-2 text-amber-500" />
                  Content Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {categories.map((category, idx) => (
                  <motion.div 
                    key={category.id} 
                    whileHover={{ x: 3 }} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 + (idx * 0.05) }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-sm hover:bg-amber-100/60 hover:text-amber-900 h-auto py-2 px-3 mb-1 font-normal transition-all duration-200 ${
                        selectedCategoryId === category.id ? 'bg-amber-100/70 text-amber-900 font-medium' : ''
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <FolderIcon className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Suggested Topics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Card className="border border-amber-200/60 shadow-md bg-amber-50/30 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 pb-2 pt-4 border-b border-amber-200/50">
              <CardTitle className="text-base font-medium flex items-center">
                <MessageSquareIcon className="w-4 h-4 mr-2 text-amber-500" />
                Suggested Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {suggestedTopics.map((topic, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ x: 3 }} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.1 + (index * 0.05) }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-amber-100/60 hover:text-amber-900 h-auto py-2 px-3 mb-1 font-normal transition-all duration-200"
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
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
