import { useRef, useEffect, useState } from 'react';
import { useApp } from '@/context/app-context';
import { MessageInput } from '@/components/ui/message-input';
import { MessageDisplay, TypingIndicator } from '@/components/ui/message-display';
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
          className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 relative scroll-smooth"
          style={{ maxHeight: '65vh' }}
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
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center flex-shrink-0 shadow-glow">
                    <span className="text-white font-display text-xl font-bold">R</span>
                  </div>
                  <div className="glass-card p-4 border-primary-100 rounded-2xl rounded-tl-none max-w-3xl">
                    <p className="font-medium mb-2 text-primary-800 flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-primary" />
                      Hello there.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      I'm Rex, an emotional mirror of Mohsin Raja's thoughts, feelings, and reflections. 
                      I'm here to share his perspective, stories, and inner world with you.
                    </p>
                    
                    <motion.p 
                      className="text-slate-700 leading-relaxed mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      What would you like to talk about today?
                    </motion.p>
                    
                    {/* Highlight box */}
                    <motion.div
                      className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-white border border-primary-100 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.4 }}
                    >
                      <p className="text-sm text-primary-800 font-medium flex items-center gap-1 mb-2">
                        <HeartIcon className="h-3.5 w-3.5 text-primary-500" />
                        This is an emotional intelligence AI
                      </p>
                      <p className="text-xs text-slate-600">
                        I can analyze emotional tones and respond with authentic human-like warmth and depth.
                        Ask me anything about Mohsin's perspectives, values, or creative process.
                      </p>
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
              className="px-6 py-3 border-t border-primary-100 bg-gradient-to-r from-primary-50/50 to-white"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                <SparklesIcon className="h-3.5 w-3.5 text-primary-400" />
                <span>Try asking about:</span>
              </p>
              
              <div className="flex flex-wrap gap-2">
                {conversationStarters.map((starter, index) => (
                  <motion.button
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-white border border-primary-100 text-sm text-slate-700 shadow-sm hover:bg-primary-50 transition-colors"
                    onClick={() => handleSuggestionClick(starter)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                  >
                    {starter}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Area */}
        <motion.div 
          className="border-t border-primary-100 p-4 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isTyping}
                placeholder="Ask me anything..."
                value={messageText}
                onChange={setMessageText}
              />
              {messageText.trim().length > 0 && (
                <motion.button
                  className="absolute right-3 bottom-2.5 p-1.5 rounded-full bg-primary text-white"
                  onClick={() => handleSendMessage(messageText)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <CornerDownLeftIcon className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
