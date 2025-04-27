import { Message } from '@shared/schema';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BrainCog, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Badge } from './badge';

interface MessageDisplayProps {
  message: Message;
}

// Emotion color mapping with more vibrant, premium styling
const emotionColors: Record<string, { bg: string, text: string, border: string, glow: string }> = {
  // Positive emotions - green spectrum
  happy: { 
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  joyful: { 
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  excited: { 
    bg: 'bg-gradient-to-r from-green-50 to-lime-50', 
    text: 'text-green-700',
    border: 'border-green-200',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.15)]'
  },
  content: { 
    bg: 'bg-gradient-to-r from-green-50 to-teal-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  enthusiastic: { 
    bg: 'bg-gradient-to-r from-lime-50 to-green-50', 
    text: 'text-lime-700',
    border: 'border-lime-200',
    glow: 'shadow-[0_0_12px_rgba(132,204,22,0.15)]'
  },
  optimistic: { 
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  grateful: { 
    bg: 'bg-gradient-to-r from-teal-50 to-emerald-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  peaceful: { 
    bg: 'bg-gradient-to-r from-teal-50 to-cyan-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  
  // Reflective emotions - blue spectrum
  sad: { 
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', 
    text: 'text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]'
  },
  melancholic: { 
    bg: 'bg-gradient-to-r from-blue-50 to-violet-50', 
    text: 'text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]'
  },
  reflective: { 
    bg: 'bg-gradient-to-r from-cyan-50 to-blue-50', 
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]'
  },
  contemplative: { 
    bg: 'bg-gradient-to-r from-blue-50 to-sky-50', 
    text: 'text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]'
  },
  thoughtful: { 
    bg: 'bg-gradient-to-r from-indigo-50 to-blue-50', 
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]'
  },
  nostalgic: { 
    bg: 'bg-gradient-to-r from-violet-50 to-blue-50', 
    text: 'text-violet-700',
    border: 'border-violet-200',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]'
  },
  
  // Anxious emotions - yellow spectrum
  anxious: { 
    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50', 
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]'
  },
  worried: { 
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  nervous: { 
    bg: 'bg-gradient-to-r from-yellow-50 to-lime-50', 
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]'
  },
  apprehensive: { 
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  uncertain: { 
    bg: 'bg-gradient-to-r from-orange-50 to-amber-50', 
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]'
  },
  
  // Curious emotions - purple spectrum
  curious: { 
    bg: 'bg-gradient-to-r from-purple-50 to-fuchsia-50', 
    text: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]'
  },
  inquisitive: { 
    bg: 'bg-gradient-to-r from-violet-50 to-purple-50', 
    text: 'text-violet-700',
    border: 'border-violet-200',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]'
  },
  interested: { 
    bg: 'bg-gradient-to-r from-fuchsia-50 to-purple-50', 
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.15)]'
  },
  intrigued: { 
    bg: 'bg-gradient-to-r from-purple-50 to-violet-50', 
    text: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]'
  },
  fascinated: { 
    bg: 'bg-gradient-to-r from-indigo-50 to-violet-50', 
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]'
  },
  
  // Neutral emotions - slate spectrum
  neutral: { 
    bg: 'bg-gradient-to-r from-slate-50 to-gray-50', 
    text: 'text-slate-700',
    border: 'border-slate-200',
    glow: 'shadow-[0_0_12px_rgba(100,116,139,0.15)]'
  },
  calm: { 
    bg: 'bg-gradient-to-r from-gray-50 to-slate-50', 
    text: 'text-gray-700',
    border: 'border-gray-200',
    glow: 'shadow-[0_0_12px_rgba(107,114,128,0.15)]'
  },
  
  // Negative emotions - red spectrum
  angry: { 
    bg: 'bg-gradient-to-r from-red-50 to-rose-50', 
    text: 'text-red-700',
    border: 'border-red-200',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]'
  },
  frustrated: { 
    bg: 'bg-gradient-to-r from-rose-50 to-red-50', 
    text: 'text-rose-700',
    border: 'border-rose-200',
    glow: 'shadow-[0_0_12px_rgba(225,29,72,0.15)]'
  },
  upset: { 
    bg: 'bg-gradient-to-r from-red-50 to-pink-50', 
    text: 'text-red-700',
    border: 'border-red-200',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]'
  },
  irritated: { 
    bg: 'bg-gradient-to-r from-orange-50 to-red-50', 
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]'
  },
  
  // Warm emotions - amber/orange spectrum
  warm: { 
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  friendly: { 
    bg: 'bg-gradient-to-r from-orange-50 to-amber-50', 
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]'
  },
  welcoming: { 
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  
  // Default
  default: { 
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  }
};

// Intent color mapping with premium styling
const intentColors: Record<string, { bg: string, text: string, border: string, glow: string }> = {
  // Questions and inquiries
  question: { 
    bg: 'bg-gradient-to-r from-blue-50 to-sky-50', 
    text: 'text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]'
  },
  inquiry: { 
    bg: 'bg-gradient-to-r from-sky-50 to-blue-50', 
    text: 'text-sky-700',
    border: 'border-sky-200',
    glow: 'shadow-[0_0_12px_rgba(14,165,233,0.15)]'
  },
  asking: { 
    bg: 'bg-gradient-to-r from-indigo-50 to-blue-50', 
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]'
  },
  curious: { 
    bg: 'bg-gradient-to-r from-violet-50 to-indigo-50', 
    text: 'text-violet-700',
    border: 'border-violet-200',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]'
  },
  confused: { 
    bg: 'bg-gradient-to-r from-purple-50 to-violet-50', 
    text: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]'
  },
  clarification: { 
    bg: 'bg-gradient-to-r from-cyan-50 to-blue-50', 
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]'
  },
  
  // Sharing and statements
  sharing: { 
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50', 
    text: 'text-green-700',
    border: 'border-green-200',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.15)]'
  },
  statement: { 
    bg: 'bg-gradient-to-r from-emerald-50 to-teal-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  expression: { 
    bg: 'bg-gradient-to-r from-teal-50 to-green-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  personal: { 
    bg: 'bg-gradient-to-r from-lime-50 to-green-50', 
    text: 'text-lime-700',
    border: 'border-lime-200',
    glow: 'shadow-[0_0_12px_rgba(132,204,22,0.15)]'
  },
  reflective: { 
    bg: 'bg-gradient-to-r from-cyan-50 to-teal-50', 
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]'
  },
  update: { 
    bg: 'bg-gradient-to-r from-green-50 to-lime-50', 
    text: 'text-green-700',
    border: 'border-green-200',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.15)]'
  },
  
  // Seeking guidance
  advice: { 
    bg: 'bg-gradient-to-r from-purple-50 to-violet-50', 
    text: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]'
  },
  guidance: { 
    bg: 'bg-gradient-to-r from-violet-50 to-purple-50', 
    text: 'text-violet-700',
    border: 'border-violet-200',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]'
  },
  help: { 
    bg: 'bg-gradient-to-r from-fuchsia-50 to-purple-50', 
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.15)]'
  },
  suggestion: { 
    bg: 'bg-gradient-to-r from-indigo-50 to-purple-50', 
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]'
  },
  recommendation: { 
    bg: 'bg-gradient-to-r from-purple-50 to-fuchsia-50', 
    text: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]'
  },
  
  // Responses and reactions
  responding: { 
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  reaction: { 
    bg: 'bg-gradient-to-r from-orange-50 to-amber-50', 
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]'
  },
  reply: { 
    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50', 
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]'
  },
  acknowledgment: { 
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  },
  feedback: { 
    bg: 'bg-gradient-to-r from-orange-50 to-red-50', 
    text: 'text-orange-700',
    border: 'border-orange-200',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]'
  },
  
  // Greetings and social
  greeting: { 
    bg: 'bg-gradient-to-r from-teal-50 to-cyan-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  farewell: { 
    bg: 'bg-gradient-to-r from-cyan-50 to-teal-50', 
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.15)]'
  },
  social: { 
    bg: 'bg-gradient-to-r from-emerald-50 to-teal-50', 
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  pleasantry: { 
    bg: 'bg-gradient-to-r from-teal-50 to-emerald-50', 
    text: 'text-teal-700',
    border: 'border-teal-200',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]'
  },
  
  // Testing or connection checking
  testing: { 
    bg: 'bg-gradient-to-r from-gray-50 to-slate-50', 
    text: 'text-gray-700',
    border: 'border-gray-200',
    glow: 'shadow-[0_0_12px_rgba(107,114,128,0.15)]'
  },
  checking: { 
    bg: 'bg-gradient-to-r from-slate-50 to-gray-50', 
    text: 'text-slate-700',
    border: 'border-slate-200',
    glow: 'shadow-[0_0_12px_rgba(100,116,139,0.15)]'
  },
  connection: { 
    bg: 'bg-gradient-to-r from-zinc-50 to-slate-50', 
    text: 'text-zinc-700',
    border: 'border-zinc-200',
    glow: 'shadow-[0_0_12px_rgba(113,113,122,0.15)]'
  },
  
  // Default
  default: { 
    bg: 'bg-gradient-to-r from-slate-50 to-gray-50', 
    text: 'text-slate-700',
    border: 'border-slate-200',
    glow: 'shadow-[0_0_12px_rgba(100,116,139,0.15)]'
  }
};

export function MessageDisplay({ message }: MessageDisplayProps) {
  const isUser = message.role === 'user';
  
  // Determine appropriate colors based on detected emotions
  const emotionStyle = message.emotionalTone ? 
    (emotionColors[message.emotionalTone.toLowerCase()] || emotionColors.default) : 
    emotionColors.default;
    
  const intentStyle = message.intent ? 
    (intentColors[message.intent.toLowerCase()] || intentColors.default) : 
    intentColors.default;
  
  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };
  
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.2,
        duration: 0.3,
        type: "spring",
        stiffness: 500
      }
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "flex items-start gap-3 my-6",
        isUser && "justify-end flex-row-reverse"
      )}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "flex-shrink-0 rounded-full flex items-center justify-center shadow-md relative",
          isUser 
            ? "w-9 h-9 bg-gradient-to-br from-secondary to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
            : "w-11 h-11 bg-gradient-to-br from-primary to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        )}
      >
        {isUser ? (
          <span className="text-white font-medium text-xs">You</span>
        ) : (
          <span className="text-white font-display text-lg font-bold">R</span>
        )}
        
        {/* Animated glow effect */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-full",
            isUser ? "bg-secondary" : "bg-primary"
          )}
          animate={{ 
            opacity: [0, 0.2, 0],
            scale: [1, 1.4, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 5, // Random delay for organic feel
          }}
        />
      </motion.div>
      
      {/* Message bubble */}
      <div 
        className={cn(
          "relative p-5 rounded-2xl max-w-3xl",
          isUser 
            ? "glass-card-premium bg-white/60 rounded-tr-none border-secondary-100" 
            : "glass-card-premium rounded-tl-none border-primary-100"
        )}
      >
        {/* Subtle glowing accent for the bubble edge */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-30",
          isUser ? "shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
          isUser ? "rounded-tr-none" : "rounded-tl-none"
        )}></div>
        
        {/* Message content */}
        <motion.p 
          className="whitespace-pre-wrap text-slate-700 leading-relaxed relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {message.content}
        </motion.p>
        
        {/* Emotion and intent tags */}
        {!isUser && (message.emotionalTone || message.intent) && (
          <motion.div 
            className="mt-4 flex flex-wrap gap-2 items-center"
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
          >
            {message.emotionalTone && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className={cn(
                  "text-xs px-3 py-1 rounded-full flex items-center gap-1.5",
                  emotionStyle.bg,
                  emotionStyle.text,
                  "border",
                  emotionStyle.border,
                  emotionStyle.glow
                )}
              >
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Heart className="h-3 w-3" />
                </motion.span>
                <span className="font-medium">{message.emotionalTone}</span>
              </motion.div>
            )}
            
            {message.intent && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className={cn(
                  "text-xs px-3 py-1 rounded-full flex items-center gap-1.5",
                  intentStyle.bg,
                  intentStyle.text,
                  "border",
                  intentStyle.border,
                  intentStyle.glow
                )}
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <BrainCog className="h-3 w-3" />
                </motion.span>
                <span className="font-medium">{message.intent}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 my-6">
      <motion.div 
        className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0.8, 1],
          rotate: [-5, 0]
        }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <span className="text-white font-display text-lg font-bold">R</span>
      </motion.div>
      
      <motion.div 
        className="glass-card-premium p-4 rounded-2xl rounded-tl-none relative"
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <div className="absolute inset-0 rounded-2xl rounded-tl-none shadow-[0_0_20px_rgba(245,158,11,0.15)] opacity-30"></div>
        
        <div className="flex space-x-3 items-center relative z-10">
          <Sparkles className="h-4 w-4 text-primary/50 animate-pulse-subtle" />
          <div className="flex space-x-2">
            <motion.span 
              className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-amber-400"
              animate={{ 
                scale: [0.5, 1.2, 0.5],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0
              }}
            />
            <motion.span 
              className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-amber-400"
              animate={{ 
                scale: [0.5, 1.2, 0.5],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.span 
              className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-amber-400"
              animate={{ 
                scale: [0.5, 1.2, 0.5],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
