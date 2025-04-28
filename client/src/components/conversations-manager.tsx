import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageCircle, Users, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: string;
  emotionalTone: string | null;
  intent: string | null;
  createdAt: string;
}

interface Conversation {
  id: number;
  sessionId: string;
  userId: number | null;
  createdAt: string;
  summary?: string;
  messageCount?: number;
  lastMessage?: string;
  lastActivity?: string;
}

export function ConversationsManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [summaryLoading, setSelectSummaryLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch all conversations
  useEffect(() => {
    fetchConversations();
  }, []);
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchConversationMessages(selectedConversation.sessionId);
      generateConversationSummary(selectedConversation.id);
    }
  }, [selectedConversation]);
  
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/conversations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchConversationMessages = async (sessionId: string) => {
    try {
      setMessageLoading(true);
      const response = await fetch(`/api/conversation/${sessionId}/messages`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation messages');
      }
      
      const data = await response.json();
      setConversationMessages(data);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setMessageLoading(false);
    }
  };
  
  const generateConversationSummary = async (conversationId: number) => {
    try {
      // Only generate a summary if we don't already have one for this conversation
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation && !conversation.summary) {
        setSelectSummaryLoading(true);
        const response = await fetch(`/api/admin/conversations/${conversationId}/summary`, {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate conversation summary');
        }
        
        const data = await response.json();
        
        // Update the conversations list with the summary
        setConversations(prevConversations => 
          prevConversations.map(c => 
            c.id === conversationId ? { ...c, summary: data.summary } : c
          )
        );
        
        // Also update the selected conversation if it's the current one
        if (selectedConversation && selectedConversation.id === conversationId) {
          setSelectedConversation(prev => prev ? { ...prev, summary: data.summary } : null);
        }
      }
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      toast({
        title: 'Warning',
        description: 'Failed to generate conversation summary.',
        variant: 'default',
      });
    } finally {
      setSelectSummaryLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return 'bg-gray-100 text-gray-800';
    
    const emotionMap: {[key: string]: string} = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      anxious: 'bg-purple-100 text-purple-800',
      reflective: 'bg-teal-100 text-teal-800',
      curious: 'bg-green-100 text-green-800',
      excited: 'bg-orange-100 text-orange-800',
      grateful: 'bg-pink-100 text-pink-800',
      confused: 'bg-indigo-100 text-indigo-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    
    // Try to find a close match for the emotion
    const normalizedEmotion = emotion.toLowerCase();
    for (const [key, value] of Object.entries(emotionMap)) {
      if (normalizedEmotion.includes(key)) {
        return value;
      }
    }
    
    return 'bg-gray-100 text-gray-800';
  };
  
  const generateMessagePreview = (messages: Message[]) => {
    if (messages.length === 0) return 'No messages';
    
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      return lastUserMessage.content.length > 60 
        ? lastUserMessage.content.substring(0, 60) + '...' 
        : lastUserMessage.content;
    }
    
    return 'No user messages';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Conversations</h2>
        <p className="text-muted-foreground mb-4">
          View user conversations and AI responses. Generate AI summaries to quickly understand conversation topics.
        </p>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="col-span-1 border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 border-b">
                <h3 className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Conversation List
                </h3>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No conversations found.
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            Session ID: {conversation.sessionId.substring(0, 8)}...
                          </div>
                          <Badge variant="outline">
                            {conversation.messageCount || 0} messages
                          </Badge>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1 inline" />
                          {formatRelativeTime(conversation.createdAt)}
                        </div>
                        
                        <div className="mt-2 text-sm">
                          {conversation.lastMessage || generateMessagePreview(
                            conversationMessages.filter(m => m.conversationId === conversation.id)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation Details */}
            <div className="col-span-1 lg:col-span-2">
              {!selectedConversation ? (
                <div className="border rounded-lg p-10 h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="h-10 w-10 mb-2 mx-auto opacity-20" />
                    <p>Select a conversation to view details</p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">
                      Conversation Detail
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(selectedConversation.createdAt)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Tabs defaultValue="messages">
                      <TabsList className="mb-4">
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="summary">AI Summary</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="messages" className="space-y-4">
                        {messageLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : conversationMessages.length === 0 ? (
                          <div className="p-8 text-center border rounded-lg">
                            <AlertCircle className="h-8 w-8 mb-2 mx-auto text-muted-foreground opacity-20" />
                            <p className="text-muted-foreground">No messages in this conversation</p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {conversationMessages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`p-4 rounded-lg ${
                                  message.role === 'user' 
                                    ? 'bg-muted ml-10' 
                                    : 'bg-primary/10 mr-10'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-medium">
                                    {message.role === 'user' ? 'User' : 'AI Response'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(message.createdAt)}
                                  </div>
                                </div>
                                
                                <div className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </div>
                                
                                {message.role === 'assistant' && (message.emotionalTone || message.intent) && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {message.emotionalTone && (
                                      <Badge className={getEmotionColor(message.emotionalTone)}>
                                        Emotion: {message.emotionalTone}
                                      </Badge>
                                    )}
                                    {message.intent && (
                                      <Badge variant="outline">
                                        Intent: {message.intent}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="summary">
                        {summaryLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2">Generating summary...</span>
                          </div>
                        ) : (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedConversation.summary ? (
                                <div className="whitespace-pre-wrap text-sm">
                                  {selectedConversation.summary}
                                </div>
                              ) : (
                                <div className="text-center p-4">
                                  <Button 
                                    onClick={() => generateConversationSummary(selectedConversation.id)}
                                    disabled={summaryLoading}
                                  >
                                    {summaryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Summary
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}