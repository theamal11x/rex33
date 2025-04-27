import { useRef, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { MessageInput } from '@/components/ui/message-input';
import { MessageDisplay, TypingIndicator } from '@/components/ui/message-display';
import { motion } from 'framer-motion';

export function ConversationView() {
  const { messages, sendMessage, isTyping } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col flex-1 border border-amber-500/10">
        {/* Welcome Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-100/50 to-cream border-b border-amber-500/10">
          <h2 className="text-xl font-medium">Welcome to Rex</h2>
          <p className="text-slate-700/70 text-sm">Mohsin's emotional mirror and personal reflection space</p>
        </div>
        
        {/* Conversation Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ maxHeight: '65vh' }}>
          {/* Initial greeting message if no messages */}
          {messages.length === 0 && (
            <motion.div 
              className="flex items-start space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-['Caveat'] text-lg font-bold">R</span>
              </div>
              <div className="bg-amber-100/50 text-slate-800 p-3 rounded-2xl rounded-tl-none max-w-3xl">
                <p className="font-medium mb-1">Hello there.</p>
                <p>I'm Rex, an emotional mirror of Mohsin Raja's thoughts, feelings, and reflections. I'm here to share his perspective, stories, and inner world with you. What would you like to talk about?</p>
              </div>
            </motion.div>
          )}
          
          {/* Conversation messages */}
          {messages.map((message) => (
            <MessageDisplay key={message.id} message={message} />
          ))}
          
          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-amber-500/10 p-3 bg-cream">
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
