import { Message } from '@shared/schema';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MessageDisplayProps {
  message: Message;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      className={cn(
        "flex items-start space-x-3",
        isUser && "justify-end flex-row-reverse"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-teal-100" : "bg-amber-500"
        )}
      >
        {isUser ? (
          <span className="text-teal-700 font-medium text-xs">You</span>
        ) : (
          <span className="text-white font-['Caveat'] text-lg font-bold">R</span>
        )}
      </div>
      
      <div 
        className={cn(
          "p-3 rounded-2xl max-w-3xl",
          isUser 
            ? "bg-teal-50 text-slate-800 rounded-tr-none" 
            : "bg-amber-100/50 text-slate-800 rounded-tl-none"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.emotionalTone && (
          <div className="mt-1 text-xs text-slate-500">
            <span className="mr-2">{message.emotionalTone}</span>
            {message.intent && <span>{message.intent}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-fadeIn">
      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-['Caveat'] text-lg font-bold">R</span>
      </div>
      <div className="bg-amber-100/30 p-3 rounded-2xl rounded-tl-none">
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '100ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '200ms' }}></span>
        </div>
      </div>
    </div>
  );
}
