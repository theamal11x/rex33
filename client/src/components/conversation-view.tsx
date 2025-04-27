import { useRef, useEffect, useState } from 'react';
import { useApp } from '@/context/app-context';
import { MessageInput } from '@/components/ui/message-input';
import { MinimalMessageDisplay, MinimalTypingIndicator } from '@/components/ui/minimal-message-display';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialLinks } from '@/components/social-links';
import { MessageSquareIcon, HeartIcon, SparklesIcon, CornerDownLeftIcon, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export function ConversationView() {
  const { messages, sendMessage, isTyping } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Suggested conversation starters
  const conversationStarters = [
    "What inspires your creative process?",
    "How do you approach difficult decisions?",
    "Tell me about your personal philosophy",
    "What values guide your life?"
  ];
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Hide suggestions once user starts engaging
  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false);
    }
  }, [messages]);
  
  const handleSendMessage = (message: string) => {
    sendMessage(message);
    setMessageText("");
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setMessageText(suggestion);
    // Don't automatically send to allow user to edit if desired
  };
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Main conversation container */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
        
        {/* Welcome Header */}
        <motion.div 
          className="relative px-6 py-5 bg-gradient-to-r from-primary-50 to-white border-b border-primary-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-400 flex items-center justify-center shadow-glow animate-pulse-subtle">
                <span className="text-white font-display text-xl font-bold">R</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gradient">Welcome to Rex</h2>
                <p className="text-slate-600 text-sm">Mohsin's emotional mirror and reflection space</p>
              </div>
            </div>
            
            <SocialLinks variant="minimal" size="sm" animate={false} />
          </div>
        </motion.div>
        
        {/* Conversation Area */}
        <motion.div 
          className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 relative scroll-smooth bg-noise"
          style={{ 
            maxHeight: 'calc(65vh - 80px)',
            position: 'relative'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Conversation welcome message */}
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="flex items-start gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center flex-shrink-0 shadow-glow"
                    animate={{ 
                      boxShadow: ["0 0 20px 2px rgba(255, 155, 0, 0.2), 0 0 30px 8px rgba(255, 155, 0, 0.1)", 
                                "0 0 25px 5px rgba(255, 155, 0, 0.3), 0 0 40px 12px rgba(255, 155, 0, 0.15)",
                                "0 0 20px 2px rgba(255, 155, 0, 0.2), 0 0 30px 8px rgba(255, 155, 0, 0.1)"]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-white font-display text-xl font-bold">R</span>
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-white/20"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0, 0.2, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  </motion.div>
                  
                  <div className="glass-card-premium p-6 border-primary-100 rounded-2xl rounded-tl-none max-w-3xl relative overflow-hidden">
                    {/* Decorative elements */}
                    <motion.div 
                      className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tr from-primary/10 to-orange-300/5 blur-2xl -translate-y-1/2 translate-x-1/2 z-0"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    />
                    
                    <div className="relative z-10">
                      <motion.p 
                        className="font-display font-bold text-lg mb-3 text-gradient bg-clip-text text-transparent flex items-center gap-2"
                        animate={{ 
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{ 
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #ef7a00, #ffb23e, #f59e0b, #ef7a00)',
                          backgroundSize: '300% auto'
                        }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, 0, -10, 0]
                          }}
                          transition={{ 
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <SparklesIcon className="h-5 w-5 text-primary" />
                        </motion.div>
                        Hello there.
                      </motion.p>
                      
                      <p className="text-slate-700 leading-relaxed mb-4">
                        I'm Rex, an emotional mirror of Mohsin Raja's thoughts, feelings, and reflections. 
                        I'm here to share his perspective, stories, and inner world with you.
                      </p>
                      
                      <motion.p 
                        className="text-slate-700 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        What would you like to talk about today?
                      </motion.p>
                    </div>
                    
                    {/* Highlight box */}
                    <motion.div
                      className="mt-4 p-4 bg-gradient-to-r from-primary-50/70 to-white/70 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm relative z-10 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6, type: "spring" }}
                    >
                      {/* Animated subtle shimmer effect */}
                      <motion.div 
                        className="absolute inset-0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut" 
                        }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          zIndex: 0
                        }}
                      />
                      
                      <div className="relative z-10">
                        <p className="text-sm font-display font-bold text-primary-800 flex items-center gap-2 mb-2">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              repeatDelay: 1
                            }}
                          >
                            <HeartIcon className="h-4 w-4 text-primary-500" />
                          </motion.div>
                          This is an emotional intelligence AI
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          I can analyze emotional tones and respond with authentic human-like warmth and depth.
                          Ask me anything about Mohsin's perspectives, values, or creative process.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Conversation messages */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: Math.min(0.1 * index, 0.5) 
                }}
              >
                <MessageDisplay message={message} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </motion.div>
        
        {/* Suggestions area */}
        <AnimatePresence>
          {showSuggestions && messages.length === 0 && (
            <motion.div 
              className="px-6 py-4 border-t border-primary-100/50 bg-gradient-to-r from-primary-50/40 to-white/80 backdrop-blur-sm relative overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {/* Background decorative elements */}
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/5 to-secondary/5 blur-3xl -translate-y-3/4"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className="text-sm text-primary-700 mb-3 flex items-center gap-2 font-medium"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <motion.span
                    animate={{ 
                      rotate: [0, 10, 0, -10, 0]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-primary-100 to-white shadow-inner"
                  >
                    <SparklesIcon className="h-3.5 w-3.5 text-primary-500" />
                  </motion.span>
                  <span>Try asking about:</span>
                </motion.div>
                
                <div className="flex flex-wrap gap-2 pl-1">
                  {conversationStarters.map((starter, index) => (
                    <motion.button
                      key={index}
                      className="px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 text-sm text-slate-700 shadow-sm hover:border-primary-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-white transition-all duration-300"
                      onClick={() => handleSuggestionClick(starter)}
                      whileHover={{ 
                        y: -3, 
                        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.2 * index + 0.3,
                        type: "spring",
                        stiffness: 500,
                        damping: 20
                      }}
                    >
                      {starter}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Area */}
        <motion.div 
          className="border-t border-primary-100 p-5 bg-gradient-to-r from-white to-primary-50/20 backdrop-blur-md relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Background decorative elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/5 to-primary/1 blur-3xl translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute top-0 left-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-accent/5 to-accent/1 blur-3xl -translate-y-1/2"></div>
          
          <div className="flex items-end gap-2 relative z-10">
            <div className="relative flex-1 glass-card-premium overflow-visible rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isTyping}
                placeholder="Ask me anything..."
                value={messageText}
                onChange={setMessageText}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
