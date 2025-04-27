import { Message } from '@shared/schema';
import { MessageRoleEnum } from 'shared/schema';
import { cn } from '@/lib/utils';
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageDisplayProps {
  message: Message;
}

export function MinimalMessageDisplay({ message }: MessageDisplayProps) {
  const isUser = message.role === MessageRoleEnum.user;
  
  return (
    <motion.div 
      className={cn(
        "flex w-full gap-2 py-1.5",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <motion.div 
          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white shadow-sm mt-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      )}
      
      {/* Message bubble */}
      <div className={cn(
        "max-w-[85%] px-3.5 py-2.5 rounded-xl shadow-sm relative",
        isUser 
          ? "bg-primary text-white" 
          : "bg-white border border-gray-100"
      )}>
        <div className="relative">
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser ? "text-white prose-invert" : "text-gray-800"
          )}
          dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }}
          />
        </div>
      </div>
      
      {/* Avatar for user */}
      {isUser && (
        <motion.div 
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 shadow-sm mt-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <User className="h-4 w-4" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function MinimalTypingIndicator() {
  return (
    <div className="flex w-full gap-2 py-1.5 justify-start">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white shadow-sm mt-1">
        <Sparkles className="h-4 w-4" />
      </div>
      
      {/* Typing indicator bubble */}
      <div className="px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm">
        <motion.div 
          className="flex space-x-1.5 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary/80"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary/60"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </div>
  );
}