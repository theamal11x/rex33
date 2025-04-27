import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { BookIcon, MessageSquareIcon, FolderIcon, HeartIcon, SparklesIcon, BookOpenIcon, BrainIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Sidebar() {
  const { 
    setView, 
    startNewConversation, 
    categories, 
    selectedCategoryId, 
    setSelectedCategoryId 
  } = useApp();
  
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  
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
  
  const SectionTitle = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20 bg-gradient-to-r from-primary-400/10 to-primary-200/5">
      <div className="rounded-full bg-gradient-to-br from-primary to-primary-400 w-7 h-7 flex items-center justify-center shadow-glow">
        {icon}
      </div>
      <h3 className="font-display text-base font-bold text-gradient">{children}</h3>
    </div>
  );
  
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      } 
    }
  };
  
  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.div 
      className="lg:w-80 mt-4 lg:mt-0 lg:ml-6 lg:flex-shrink-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="sticky top-4 space-y-6">
        {/* About Rex */}
        <motion.div
          className="glass-card relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/10 blur-xl -translate-y-1/2 translate-x-1/4 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/10 blur-xl translate-y-1/2 -translate-x-1/4 z-0"></div>
          
          <SectionTitle icon={<HeartIcon className="w-4 h-4 text-white" />}>
            About Rex
          </SectionTitle>
          
          <div className="p-4 relative z-10">
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Rex is an emotional mirror of Mohsin Raja's inner world, capturing his thoughts, feelings, and reflections.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Feel free to ask about his perspectives, personal philosophy, or emotional journey.
            </p>
          </div>
        </motion.div>
        
        {/* Quick Access */}
        <motion.div
          className="glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <SectionTitle icon={<SparklesIcon className="w-4 h-4 text-white" />}>
            Quick Access
          </SectionTitle>
          
          <motion.div 
            className="p-2"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={menuItemVariants}
              onHoverStart={() => setHoverItem("archive")}
              onHoverEnd={() => setHoverItem(null)}
            >
              <Button
                onClick={handleViewArchive}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm h-10 px-3 mb-2 rounded-xl font-medium relative overflow-hidden group",
                  hoverItem === "archive" ? "text-secondary-700" : "text-slate-700"
                )}
              >
                <span className={cn(
                  "absolute inset-0 bg-secondary/10 rounded-xl scale-0 transition-transform duration-300",
                  hoverItem === "archive" ? "scale-100" : ""
                )}></span>
                <BookOpenIcon className={cn(
                  "h-4 w-4 mr-3 transition-colors duration-300",
                  hoverItem === "archive" ? "text-secondary-600" : "text-secondary"
                )} />
                <span className="relative z-10">Browse Reflection Archive</span>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={menuItemVariants}
              onHoverStart={() => setHoverItem("newConversation")}
              onHoverEnd={() => setHoverItem(null)}
            >
              <Button
                onClick={handleStartNewConversation}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm h-10 px-3 rounded-xl font-medium relative overflow-hidden group",
                  hoverItem === "newConversation" ? "text-primary-700" : "text-slate-700"
                )}
              >
                <span className={cn(
                  "absolute inset-0 bg-primary/10 rounded-xl scale-0 transition-transform duration-300",
                  hoverItem === "newConversation" ? "scale-100" : ""
                )}></span>
                <MessageSquareIcon className={cn(
                  "h-4 w-4 mr-3 transition-colors duration-300",
                  hoverItem === "newConversation" ? "text-primary-600" : "text-primary"
                )} />
                <span className="relative z-10">Start New Conversation</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Categories */}
        {categories && categories.length > 0 && (
          <motion.div
            className="glass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <SectionTitle icon={<FolderIcon className="w-4 h-4 text-white" />}>
              Content Categories
            </SectionTitle>
            
            <motion.div 
              className="p-2"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {categories.map((category, idx) => (
                  <motion.div 
                    key={category.id}
                    variants={menuItemVariants}
                    onHoverStart={() => setHoverItem(`category-${category.id}`)}
                    onHoverEnd={() => setHoverItem(null)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm h-auto py-2 px-3 mb-1 rounded-xl font-normal transition-all duration-300 relative overflow-hidden",
                        selectedCategoryId === category.id 
                          ? "bg-accent/10 text-accent-700 font-medium"
                          : hoverItem === `category-${category.id}` 
                            ? "text-accent-700" 
                            : "text-slate-700"
                      )}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className={cn(
                        "absolute inset-0 bg-accent/10 rounded-xl scale-0 transition-transform duration-300",
                        (hoverItem === `category-${category.id}` && selectedCategoryId !== category.id) ? "scale-100" : ""
                      )}></span>
                      <FolderIcon className={cn(
                        "h-4 w-4 mr-2 flex-shrink-0 transition-colors duration-300",
                        (selectedCategoryId === category.id || hoverItem === `category-${category.id}`) 
                          ? "text-accent-600" 
                          : "text-accent"
                      )} />
                      <span className="truncate relative z-10">{category.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
        
        {/* Suggested Topics */}
        <motion.div
          className="glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <SectionTitle icon={<BrainIcon className="w-4 h-4 text-white" />}>
            Suggested Topics
          </SectionTitle>
          
          <div className="p-3">
            <motion.div 
              className="flex flex-wrap gap-2"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
            >
              {suggestedTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  variants={menuItemVariants}
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-full bg-white/70 border border-primary-100 text-sm text-slate-700 shadow-sm hover:bg-primary-50 transition-all duration-300"
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
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
