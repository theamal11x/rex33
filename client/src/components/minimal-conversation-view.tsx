import { useRef, useEffect, useState } from 'react';
import { useApp } from '@/context/app-context';
import { MinimalMessageInput } from '@/components/ui/minimal-message-input';
import { MinimalMessageDisplay, MinimalTypingIndicator } from '@/components/ui/minimal-message-display';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Menu, Info, User } from 'lucide-react';
import { Button } from './ui/button';

export function MinimalConversationView() {
  const { messages, sendMessage, isTyping, startNewConversation } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Suggested conversation starters
  const conversationStarters = [
    "What inspires you?",
    "How do you approach decisions?",
    "Tell me about your philosophy",
    "What values guide you?"
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
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
            <span className="font-bold">R</span>
          </div>
          <h1 className="font-medium text-gray-800">Rex Terminal</h1>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={startNewConversation}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ maxHeight: 'calc(100vh - 130px)' }}
      >
        {/* Welcome message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="font-medium text-gray-800 mb-2">Welcome to Rex Terminal</h2>
              <div className="text-sm text-gray-600 mb-3">
                I'm Rex, an emotional mirror of Mohsin Raja's thoughts, feelings, and reflections.
                Ask me anything about his perspectives, values, or creative process.
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Messages */}
        <AnimatePresence>
          {messages.map((message) => (
            <MinimalMessageDisplay key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && <MinimalTypingIndicator />}
        </AnimatePresence>
        
        {/* For auto-scroll */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestion chips */}
      <AnimatePresence>
        {showSuggestions && messages.length === 0 && (
          <motion.div 
            className="bg-white border-t border-gray-100 p-3 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {conversationStarters.map((starter, index) => (
              <motion.button
                key={index}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700"
                onClick={() => handleSuggestionClick(starter)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {starter}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <MinimalMessageInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder="Message Rex..."
          value={messageText}
          onChange={setMessageText}
        />
      </div>
    </div>
  );
}