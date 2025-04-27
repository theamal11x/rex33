import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/app-context';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageProps {
  text: string;
  isCommand?: boolean;
  isWelcome?: boolean;
  darkMode?: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isCommand = false, isWelcome = false, darkMode = false }) => {
  return (
    <div className={cn(
      "mb-3 leading-relaxed font-mono",
      isCommand ? "text-pink-600 pl-4 relative before:content-['$'] before:absolute before:left-0 before:text-pink-400" : "",
      isWelcome ? "text-blue-500" : darkMode ? "text-gray-300" : "text-gray-800"
    )}>
      {text}
    </div>
  );
};

interface TerminalUIProps {
  darkMode?: boolean;
}

export const TerminalUI: React.FC<TerminalUIProps> = ({ darkMode = false }) => {
  const { messages, sendMessage, isTyping } = useApp();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<MessageProps[]>([
    { text: "Welcome to Rex Digital Forge v1.0.0", isWelcome: true },
    { text: "Type 'help' to see available commands.", isWelcome: true },
    { text: "Try asking about Mohsin's thoughts, feelings, or creative process.", isWelcome: true },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Process API messages and add them to history
  useEffect(() => {
    if (messages.length > 0) {
      const currentMessages = [...history];
      
      // Add any new messages from the conversation
      messages.forEach(msg => {
        const existingMessage = currentMessages.find(m => m.text === msg.content);
        if (!existingMessage) {
          currentMessages.push({
            text: msg.content,
            isCommand: msg.role === 'user',
            isWelcome: false
          });
        }
      });
      
      setHistory(currentMessages);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && !isTyping) {
      // Add user command to history
      setHistory(prev => [...prev, { text: input, isCommand: true }]);
      
      // Send to API
      sendMessage(input);
      
      // Clear input
      setInput('');
    }
  };

  const focusTerminal = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className={`text-3xl font-mono font-bold tracking-tight ${darkMode ? 'text-white' : ''}`}>Rex Digital Forge</h1>
        <p className={`text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your terminal-style digital assistant</p>
      </header>
      
      {/* Terminal Window */}
      <div 
        className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-2xl mx-auto w-full shadow-md rounded-md mb-6 overflow-hidden`}
        style={{ boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)' }}
      >
        {/* Terminal Header */}
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-2 flex items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className={`ml-4 text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>rex@digital-forge</div>
        </div>
        
        {/* Terminal Content */}
        <div 
          className={`flex-1 overflow-auto p-4 font-mono text-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          ref={terminalRef}
          onClick={focusTerminal}
        >
          {history.map((msg, index) => (
            <Message 
              key={index} 
              text={msg.text} 
              isCommand={msg.isCommand}
              isWelcome={msg.isWelcome}
              darkMode={darkMode}
            />
          ))}
          
          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-pink-400 font-mono"
              >
                <div className="flex items-center space-x-1 pl-4 relative before:content-['$'] before:absolute before:left-0 before:text-pink-300">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >●</motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  >●</motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  >●</motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Terminal Input */}
        <form onSubmit={handleSubmit} className={`flex items-center border-t p-3 ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <span className="text-pink-500 mr-2 font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 bg-transparent border-none outline-none font-mono placeholder-gray-400 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            placeholder="Type a command..."
            ref={inputRef}
            disabled={isTyping}
            autoFocus
          />
        </form>
      </div>
      
      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-sm text-pink-400 mb-2 font-mono">
          <a href="#" className="hover:underline">Leave feedback for Mohsin</a>
        </p>
        <p className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>© 2025 Rex Digital Forge</p>
        <p className={`text-xs mt-1 font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Type "help" in the terminal to get started</p>
      </footer>
    </div>
  );
};