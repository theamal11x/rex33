import { Message } from '@shared/schema';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BrainCog, Heart, MessageCircle } from 'lucide-react';
import { Badge } from './badge';

interface MessageDisplayProps {
  message: Message;
}

// Emotion color mapping for visual cues
const emotionColors: Record<string, string> = {
  // Positive emotions - green spectrum
  happy: 'bg-green-100 text-green-800',
  joyful: 'bg-green-100 text-green-800',
  excited: 'bg-green-100 text-green-800',
  content: 'bg-green-100 text-green-800',
  enthusiastic: 'bg-green-100 text-green-800',
  optimistic: 'bg-green-100 text-green-800',
  grateful: 'bg-green-200 text-green-800',
  peaceful: 'bg-green-100 text-green-800',
  
  // Reflective emotions - blue spectrum
  sad: 'bg-blue-100 text-blue-800',
  melancholic: 'bg-blue-100 text-blue-800',
  reflective: 'bg-blue-100 text-blue-800',
  contemplative: 'bg-blue-100 text-blue-800',
  thoughtful: 'bg-blue-100 text-blue-800',
  nostalgic: 'bg-blue-100 text-blue-800',
  
  // Anxious emotions - yellow spectrum
  anxious: 'bg-yellow-100 text-yellow-800',
  worried: 'bg-yellow-100 text-yellow-800',
  nervous: 'bg-yellow-100 text-yellow-800',
  apprehensive: 'bg-yellow-100 text-yellow-800',
  uncertain: 'bg-yellow-100 text-yellow-800',
  
  // Curious emotions - purple spectrum
  curious: 'bg-purple-100 text-purple-800',
  inquisitive: 'bg-purple-100 text-purple-800',
  interested: 'bg-purple-100 text-purple-800',
  intrigued: 'bg-purple-100 text-purple-800',
  fascinated: 'bg-purple-100 text-purple-800',
  
  // Neutral emotions - slate spectrum
  neutral: 'bg-slate-100 text-slate-800',
  calm: 'bg-slate-100 text-slate-800',
  
  // Negative emotions - red spectrum
  angry: 'bg-red-100 text-red-800',
  frustrated: 'bg-red-100 text-red-800',
  upset: 'bg-red-100 text-red-800',
  irritated: 'bg-red-100 text-red-800',
  
  // Warm emotions - amber/orange spectrum
  warm: 'bg-amber-100 text-amber-800',
  friendly: 'bg-amber-100 text-amber-800',
  welcoming: 'bg-amber-100 text-amber-800',
  
  // Default
  default: 'bg-amber-100 text-amber-800'
};

// Intent color mapping
const intentColors: Record<string, string> = {
  // Questions and inquiries
  question: 'bg-blue-100 text-blue-800',
  inquiry: 'bg-blue-100 text-blue-800',
  asking: 'bg-blue-100 text-blue-800',
  curious: 'bg-blue-100 text-blue-800',
  confused: 'bg-blue-100 text-blue-800',
  clarification: 'bg-blue-100 text-blue-800',
  
  // Sharing and statements
  sharing: 'bg-green-100 text-green-800',
  statement: 'bg-green-100 text-green-800',
  expression: 'bg-green-100 text-green-800',
  personal: 'bg-green-100 text-green-800',
  reflective: 'bg-green-100 text-green-800',
  update: 'bg-green-100 text-green-800',
  
  // Seeking guidance
  advice: 'bg-purple-100 text-purple-800',
  guidance: 'bg-purple-100 text-purple-800',
  help: 'bg-purple-100 text-purple-800',
  suggestion: 'bg-purple-100 text-purple-800',
  recommendation: 'bg-purple-100 text-purple-800',
  
  // Responses and reactions
  responding: 'bg-amber-100 text-amber-800',
  reaction: 'bg-amber-100 text-amber-800',
  reply: 'bg-amber-100 text-amber-800',
  acknowledgment: 'bg-amber-100 text-amber-800',
  feedback: 'bg-amber-100 text-amber-800',
  
  // Greetings and social
  greeting: 'bg-teal-100 text-teal-800',
  farewell: 'bg-teal-100 text-teal-800',
  social: 'bg-teal-100 text-teal-800',
  pleasantry: 'bg-teal-100 text-teal-800',
  
  // Testing or connection checking
  testing: 'bg-slate-100 text-slate-700',
  checking: 'bg-slate-100 text-slate-700',
  connection: 'bg-slate-100 text-slate-700',
  
  // Default
  default: 'bg-slate-100 text-slate-800'
};

export function MessageDisplay({ message }: MessageDisplayProps) {
  const isUser = message.role === 'user';
  
  // Determine appropriate colors based on detected emotions
  const emotionColor = message.emotionalTone ? 
    (emotionColors[message.emotionalTone.toLowerCase()] || emotionColors.default) : 
    emotionColors.default;
    
  const intentColor = message.intent ? 
    (intentColors[message.intent.toLowerCase()] || intentColors.default) : 
    intentColors.default;
  
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
          isUser ? "bg-teal-100" : "bg-amber-500",
          "shadow-sm"
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
          "p-4 rounded-2xl max-w-3xl shadow-sm",
          isUser 
            ? "bg-teal-50 text-slate-800 rounded-tr-none" 
            : "bg-amber-100/50 text-slate-800 rounded-tl-none"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {!isUser && message.emotionalTone && (
          <div className="mt-2 flex flex-wrap gap-2 items-center text-xs">
            {message.emotionalTone && (
              <Badge variant="outline" className={cn("px-2 py-0.5 flex items-center gap-1", emotionColor)}>
                <Heart className="h-3 w-3" />
                <span>{message.emotionalTone}</span>
              </Badge>
            )}
            
            {message.intent && (
              <Badge variant="outline" className={cn("px-2 py-0.5 flex items-center gap-1", intentColor)}>
                <BrainCog className="h-3 w-3" />
                <span>{message.intent}</span>
              </Badge>
            )}
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
