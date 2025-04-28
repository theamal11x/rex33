import { useState, useEffect } from 'react';
import { useApp } from '@/context/app-context';

// Define emotional colors mapping
const emotionColors: Record<string, string> = {
  // Happy/Positive emotions - warm, uplifting colors
  happy: 'rgba(255, 222, 173, 0.3)', // Peach
  joyful: 'rgba(255, 222, 173, 0.3)',
  excited: 'rgba(255, 165, 0, 0.2)', // Light orange
  grateful: 'rgba(255, 182, 193, 0.2)', // Light pink
  content: 'rgba(255, 222, 173, 0.25)',
  optimistic: 'rgba(253, 253, 150, 0.2)', // Light yellow
  
  // Calm/Reflective emotions - cool, serene colors
  calm: 'rgba(176, 224, 230, 0.3)', // Powder blue
  peaceful: 'rgba(176, 224, 230, 0.25)',
  reflective: 'rgba(173, 216, 230, 0.3)', // Light blue
  thoughtful: 'rgba(173, 216, 230, 0.25)',
  introspective: 'rgba(176, 224, 230, 0.2)',
  
  // Neutral emotions - neutral colors
  neutral: 'rgba(245, 245, 245, 0.2)', // Light gray
  objective: 'rgba(245, 245, 245, 0.2)',
  professional: 'rgba(245, 245, 245, 0.15)',
  
  // Sad/Melancholy emotions - subdued blues and purples
  sad: 'rgba(176, 196, 222, 0.3)', // Light steel blue
  melancholy: 'rgba(176, 196, 222, 0.25)',
  nostalgic: 'rgba(204, 204, 255, 0.25)', // Lavender
  regretful: 'rgba(176, 196, 222, 0.3)',
  
  // Anxious/Concerned emotions - light purples
  anxious: 'rgba(221, 160, 221, 0.15)', // Light purple
  concerned: 'rgba(221, 160, 221, 0.15)',
  worried: 'rgba(221, 160, 221, 0.2)',
  
  // Frustrated/Angry emotions - subdued reds/oranges
  frustrated: 'rgba(255, 160, 122, 0.2)', // Light salmon
  angry: 'rgba(255, 160, 122, 0.2)',
  annoyed: 'rgba(255, 160, 122, 0.15)',
  
  // Confused emotions - light yellows
  confused: 'rgba(255, 255, 224, 0.3)', // Light yellow
  uncertain: 'rgba(255, 255, 224, 0.25)',
  curious: 'rgba(255, 255, 204, 0.3)', // Pale yellow
  
  // Default color - subtle cream
  default: 'rgba(255, 253, 245, 0.2)'
};

// Helper function to find the closest emotional tone match
function findEmotionColor(emotion: string | null): string {
  if (!emotion) return emotionColors.default;
  
  // Convert to lowercase for matching
  const normalizedEmotion = emotion.toLowerCase();
  
  // Check for exact matches first
  if (emotionColors[normalizedEmotion]) {
    return emotionColors[normalizedEmotion];
  }
  
  // If no exact match, look for partial matches
  for (const [key, value] of Object.entries(emotionColors)) {
    if (normalizedEmotion.includes(key)) {
      return value;
    }
  }
  
  // Check for word similarities
  if (normalizedEmotion.includes('happ') || normalizedEmotion.includes('joy') || normalizedEmotion.includes('delight')) {
    return emotionColors.happy;
  }
  if (normalizedEmotion.includes('calm') || normalizedEmotion.includes('peace') || normalizedEmotion.includes('serene')) {
    return emotionColors.calm;
  }
  if (normalizedEmotion.includes('sad') || normalizedEmotion.includes('unhapp') || normalizedEmotion.includes('melanch')) {
    return emotionColors.sad;
  }
  if (normalizedEmotion.includes('anx') || normalizedEmotion.includes('nerv') || normalizedEmotion.includes('worr')) {
    return emotionColors.anxious;
  }
  if (normalizedEmotion.includes('ang') || normalizedEmotion.includes('mad') || normalizedEmotion.includes('frust')) {
    return emotionColors.angry;
  }
  if (normalizedEmotion.includes('confus') || normalizedEmotion.includes('puzzl') || normalizedEmotion.includes('uncertain')) {
    return emotionColors.confused;
  }
  
  // Default fallback
  return emotionColors.default;
}

export function EmotionalBackground() {
  const { messages } = useApp();
  const [backgroundColor, setBackgroundColor] = useState<string>(emotionColors.default);
  
  useEffect(() => {
    // If there are no messages, use default background
    if (messages.length === 0) {
      setBackgroundColor(emotionColors.default);
      return;
    }
    
    // Use the most recent AI response that has an emotional tone
    const aiMessages = messages.filter(msg => msg.role === 'assistant' && msg.emotionalTone);
    
    if (aiMessages.length === 0) {
      setBackgroundColor(emotionColors.default);
      return;
    }
    
    // Get the latest message with an emotional tone
    const latestAiMessage = aiMessages[aiMessages.length - 1];
    const newColor = findEmotionColor(latestAiMessage.emotionalTone);
    
    // Smoothly transition to the new color
    setBackgroundColor(newColor);
  }, [messages]);
  
  // Apply the background as a full-screen element that sits behind all content
  return (
    <div 
      className="fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out" 
      style={{ backgroundColor }}
    />
  );
}