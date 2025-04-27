import { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send, Smile } from 'lucide-react';
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

export function MinimalMessageInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Message Rex...",
  value,
  onChange
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  
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
    <form onSubmit={handleSubmit} className="flex items-center bg-gray-100 rounded-full pl-4 pr-1.5 py-1.5">
      <input
        type="text"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500 text-sm outline-none"
      />
      
      <AnimatePresence>
        {currentValue.trim() ? (
          <motion.button
            type="submit"
            disabled={disabled}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center ml-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center ml-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Smile className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
}