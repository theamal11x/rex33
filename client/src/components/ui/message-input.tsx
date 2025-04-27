import { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="flex space-x-3 w-full">
      <div className="flex-1 relative">
        <Input
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-full glass-input shadow-sm border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800 placeholder:text-slate-400/70 h-12"
        />
      </div>
      <Button 
        type="submit" 
        disabled={disabled || !currentValue.trim()} 
        className="bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white px-5 py-3 rounded-full flex items-center justify-center transition-all h-12 w-12 shadow-glow disabled:opacity-50 disabled:shadow-none"
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}
