import { useRef, useEffect, useState } from 'react';
import { useApp } from '@/context/app-context';
import { MessageInput } from '@/components/ui/message-input';
import { MessageDisplay, TypingIndicator } from '@/components/ui/message-display';
import { motion } from 'framer-motion';
import { SocialLinks } from '@/components/social-links';
import { MessageSquareIcon, HeartIcon, SparklesIcon, LineChartIcon } from 'lucide-react';
import { EmotionalJourney } from '@/components/emotional-journey';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ConversationView() {
  const { messages, sendMessage, isTyping, sessionId } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showJourney, setShowJourney] = useState(false);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <motion.div 
      className="flex-1 flex flex-col h-full"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden flex flex-col flex-1 border border-amber-200"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Welcome Header */}
        <motion.div 
          className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-amber-100 to-amber-50/80 border-b border-amber-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HeartIcon className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500" />
                <h2 className="text-lg sm:text-xl font-medium text-amber-900">Welcome to Rex</h2>
              </div>
              <p className="text-slate-700/80 text-xs sm:text-sm">Mohsin's emotional mirror and personal reflection space</p>
            </div>
            
            <div className="flex items-center gap-2">
              {messages.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs hidden sm:flex items-center gap-1"
                  onClick={() => setShowJourney(!showJourney)}
                >
                  <LineChartIcon className="h-3 w-3" />
                  {showJourney ? 'Hide' : 'Show'} Emotional Journey
                </Button>
              )}
              <div className="sm:ml-auto">
                <SocialLinks />
              </div>
            </div>
          </div>
          
          {/* Mobile emotional journey button */}
          {messages.length > 1 && (
            <div className="mt-2 flex sm:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs w-full flex items-center justify-center gap-1"
                onClick={() => setShowJourney(!showJourney)}
              >
                <LineChartIcon className="h-3 w-3" />
                {showJourney ? 'Hide' : 'Show'} Emotional Journey
              </Button>
            </div>
          )}
        </motion.div>
        
        {/* Emotional Journey Visualization */}
        {showJourney && messages.length > 0 && (
          <motion.div
            className="p-3 sm:p-4 border-b border-amber-200 bg-amber-50/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmotionalJourney sessionId={sessionId} />
          </motion.div>
        )}
        
        {/* Conversation Area */}
        <motion.div 
          className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5" 
          style={{ maxHeight: '65vh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Initial greeting message if no messages */}
          {messages.length === 0 && (
            <motion.div 
              className="flex items-start space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white font-['Caveat'] text-lg sm:text-xl font-bold">R</span>
              </div>
              <div className="bg-gradient-to-r from-amber-100/70 to-amber-50/80 text-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-tl-none max-w-3xl shadow-sm border border-amber-200/50">
                <p className="font-medium mb-1 sm:mb-2 text-amber-900 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                  Hello there.
                </p>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                  I'm Rex, an emotional mirror of Mohsin Raja's thoughts, feelings, and reflections. 
                  I'm here to share his perspective, stories, and inner world with you. What would you like to talk about?
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Conversation messages */}
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MessageDisplay message={message} />
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </motion.div>
        
        {/* Input Area */}
        <motion.div 
          className="border-t border-amber-200 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-amber-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500 flex-shrink-0" />
            <MessageInput 
              onSendMessage={sendMessage} 
              disabled={isTyping}
              placeholder="Type your message to Rex..."
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
