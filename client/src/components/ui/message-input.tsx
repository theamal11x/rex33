import { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Define the custom event type
interface SetMessageInputEvent extends CustomEvent {
  detail: { message: string };
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Ask me anything about Mohsin's thoughts or feelings..."
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  // Listen for the custom event from sidebar suggested topics
  useEffect(() => {
    const handleSetMessage = (event: Event) => {
      const customEvent = event as SetMessageInputEvent;
      setMessage(customEvent.detail.message);
    };

    window.addEventListener('set-message-input', handleSetMessage);
    
    return () => {
      window.removeEventListener('set-message-input', handleSetMessage);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
      <div className="flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-white border border-amber-300/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800 placeholder:text-slate-500/50 text-sm sm:text-base h-10 sm:h-12"
        />
      </div>
      <Button 
        type="submit" 
        disabled={disabled || !message.trim()} 
        className="bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors h-10 w-10 sm:h-12 sm:w-12"
      >
        <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </form>
  );
}
