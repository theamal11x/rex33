import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Message, ContentEntry, Category } from '@shared/schema';

interface AppContextType {
  view: 'conversation' | 'archive' | 'admin' | 'adminLogin';
  setView: (view: 'conversation' | 'archive' | 'admin' | 'adminLogin') => void;
  sessionId: string;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  isTyping: boolean;
  startNewConversation: () => void;
  categories: Category[];
  contentEntries: ContentEntry[];
  refreshContent: () => Promise<void>;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'conversation' | 'archive' | 'admin' | 'adminLogin'>('conversation');
  const [sessionId, setSessionId] = useState(() => nanoid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentEntries, setContentEntries] = useState<ContentEntry[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Load initial messages based on session ID
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversation/${sessionId}/messages`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [sessionId]);
  
  // Load categories and content entries
  useEffect(() => {
    refreshContent();
  }, []);
  
  // Load content entries when selected category changes
  useEffect(() => {
    const fetchContentByCategory = async () => {
      if (selectedCategoryId !== null) {
        try {
          const response = await fetch(`/api/content/category/${selectedCategoryId}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            setContentEntries(data);
          }
        } catch (error) {
          console.error('Failed to fetch content by category:', error);
        }
      }
    };

    if (selectedCategoryId) {
      fetchContentByCategory();
    }
  }, [selectedCategoryId]);

  const refreshContent = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories', {
        credentials: 'include'
      });
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
      
      // Fetch content entries
      const contentResponse = await fetch('/api/content', {
        credentials: 'include'
      });
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setContentEntries(contentData);
      }
    } catch (error) {
      console.error('Failed to refresh content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async (message: string) => {
    // Check for admin trigger
    if (message.toLowerCase() === 'heyopenhereiam') {
      setView('adminLogin');
      return;
    }
    
    try {
      setIsTyping(true);
      
      // Add user message locally immediately for better UX
      setMessages(prev => [...prev, {
        id: 0, // Temporary ID
        conversationId: 0,
        content: message,
        role: 'user',
        emotionalTone: null,
        intent: null,
        createdAt: new Date()
      }]);

      const response = await apiRequest('POST', '/api/conversation/message', {
        message,
        sessionId
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update messages with the server response
        setMessages(prev => {
          // Find all messages except the temporary user message we added
          const filteredMessages = prev.filter(m => 
            !(m.id === 0 && m.content === message && m.role === 'user')
          );
          
          // Fetch updated messages from server
          return [...filteredMessages, data.message];
        });
        
        // Refresh messages from server to ensure consistency
        const messagesResponse = await fetch(`/api/conversation/${sessionId}/messages`, {
          credentials: 'include'
        });
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const startNewConversation = () => {
    setSessionId(nanoid());
    setMessages([]);
    setView('conversation');
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        sessionId,
        messages,
        sendMessage,
        isTyping,
        startNewConversation,
        categories,
        contentEntries,
        refreshContent,
        selectedCategoryId,
        setSelectedCategoryId
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
