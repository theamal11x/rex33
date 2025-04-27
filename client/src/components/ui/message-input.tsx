import { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, SparklesIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

// Define the custom event type
interface SetMessageInputEvent extends CustomEvent {
  detail: { message: string };
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Ask me anything about Mohsin's thoughts or feelings...",
  value,
  onChange
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Controlled component logic
  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : message;
  
  const handleChange = (newValue: string) => {
    if (isControlled) {
      onChange(newValue);
    } else {
      setMessage(newValue);
    }
  };

  // Listen for the custom event from sidebar suggested topics
  useEffect(() => {
    const handleSetMessage = (event: Event) => {
      const customEvent = event as SetMessageInputEvent;
      handleChange(customEvent.detail.message);
    };

    window.addEventListener('set-message-input', handleSetMessage);
    
    return () => {
      window.removeEventListener('set-message-input', handleSetMessage);
    };
  }, [isControlled, onChange]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentValue.trim() && !disabled) {
      onSendMessage(currentValue.trim());
      handleChange('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Ambient glow effect for focus state */}
        <AnimatePresence>
          {isFocused && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/5 blur-xl -z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        <Input
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-5 py-3 rounded-full glass-input shadow-sm border-primary-100/50 focus:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none text-slate-800 placeholder:text-slate-500/60 h-14 pr-14 transition-all duration-300"
          style={{
            position: 'relative', // Adding position for the container warning
          }}
        />
        
        {/* Send Button - Only show when input has content */}
        <AnimatePresence>
          {currentValue.trim() && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute right-1.5 top-1.5"
            >
              <Button 
                type="submit" 
                disabled={disabled} 
                className="group bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white p-2.5 rounded-full flex items-center justify-center transition-all h-11 w-11 shadow-glow overflow-hidden disabled:opacity-50 disabled:shadow-none"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)' 
                  }}
                />
                
                {/* Shimmer effect */}
                <motion.div 
                  className="absolute inset-0"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    zIndex: 0
                  }}
                />
                
                <motion.span 
                  className="relative z-10"
                  whileHover={{ rotate: 15 }}
                  whileTap={{ scale: 0.9, rotate: 30 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <SendIcon className="h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hint decoration when empty */}
        <AnimatePresence>
          {!currentValue.trim() && !isFocused && (
            <motion.span
              className="absolute right-5 top-1/2 -translate-y-1/2 text-primary-300/60 pointer-events-none flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={{ 
                  y: [0, -2, 0],
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <SparklesIcon className="h-5 w-5" />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
