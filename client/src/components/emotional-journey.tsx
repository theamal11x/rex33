import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// Define emotion color mapping
const emotionColors = {
  happy: "#4CAF50",
  joyful: "#8BC34A",
  curious: "#2196F3",
  excited: "#FF9800",
  neutral: "#9E9E9E",
  reflective: "#9C27B0",
  nostalgic: "#673AB7",
  anxious: "#FFC107",
  sad: "#607D8B",
  angry: "#F44336",
  confused: "#FF5722",
  frustrated: "#E91E63"
};

// Default emotion mapping (fallback for emotions not in the list)
const defaultColor = "#9E9E9E";

// Get color for an emotion
const getEmotionColor = (emotion: string) => {
  if (!emotion) return defaultColor;
  
  // Try to find exact match
  const exactMatch = emotionColors[emotion.toLowerCase() as keyof typeof emotionColors];
  if (exactMatch) return exactMatch;
  
  // Try to find partial match (for compound emotions like "mildly curious")
  for (const [key, value] of Object.entries(emotionColors)) {
    if (emotion.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return defaultColor;
};

// Define emotional journey data type
interface EmotionalDataPoint {
  timestamp: string;
  emotion: string;
  role: string;
  id: number;
}

// Props for the EmotionalJourney component
interface EmotionalJourneyProps {
  sessionId: string;
}

export function EmotionalJourney({ sessionId }: EmotionalJourneyProps) {
  const [data, setData] = useState<EmotionalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Map emotions to a numerical value for charting
  const emotionValues = [
    'angry', 'frustrated', 'anxious', 'confused', 'sad', 
    'neutral', 'reflective', 'nostalgic', 'curious', 'excited', 'joyful', 'happy'
  ];
  
  useEffect(() => {
    async function fetchEmotionalJourneyData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/conversation/${sessionId}/emotional-journey`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch emotional journey data');
        }
        
        const journeyData = await response.json();
        setData(journeyData);
      } catch (err) {
        setError((err as Error).message);
        toast({
          title: 'Error',
          description: 'Failed to load emotional journey data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchEmotionalJourneyData();
  }, [sessionId, toast]);
  
  // Transform data for charting
  const formattedData = data.map(point => {
    // Get the base emotion (first word in case it's compound)
    const baseEmotion = point.emotion?.toLowerCase().split(' ').pop() || 'neutral';
    
    // Find emotional value for y-axis
    const emotionValue = emotionValues.findIndex(e => baseEmotion.includes(e));
    const normalizedValue = emotionValue !== -1 ? 
      emotionValue + 1 : 
      emotionValues.indexOf('neutral') + 1;
    
    // Format date for display
    const date = new Date(point.timestamp);
    const formattedTime = formatDistanceToNow(date, { addSuffix: true });
    
    return {
      timestamp: point.timestamp,
      emotion: point.emotion,
      emotionValue: normalizedValue,
      formattedTime,
      id: point.id
    };
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-destructive">Error loading emotional journey: {error}</p>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No emotional data available yet.</p>
        <p className="text-sm mt-2">Continue your conversation to build an emotional journey.</p>
      </div>
    );
  }
  
  const toggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'area' : 'line');
  };
  
  return (
    <div className="bg-card p-4 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Emotional Journey</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleChartType}
            className="text-xs"
          >
            {chartType === 'line' ? 'Area View' : 'Line View'}
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(data.map(d => d.emotion))).map((emotion, i) => (
            <Badge 
              key={i}
              style={{ backgroundColor: getEmotionColor(emotion) }}
              className="text-white"
            >
              {emotion}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="formattedTime"
                tick={{ fontSize: isMobile ? 8 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              <YAxis 
                domain={[0, emotionValues.length + 1]} 
                ticks={[1, 4, 8, 12]}
                tickFormatter={(value) => {
                  const emoIndex = value - 1;
                  return emoIndex >= 0 && emoIndex < emotionValues.length ? 
                    emotionValues[emoIndex] : '';
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const dataPoint = formattedData.find(d => d.emotionValue === value);
                  return [dataPoint?.emotion || '', 'Emotion'];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="emotionValue" 
                name="Emotional State" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={formattedData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="formattedTime"
                tick={{ fontSize: isMobile ? 8 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              <YAxis 
                domain={[0, emotionValues.length + 1]} 
                ticks={[1, 4, 8, 12]}
                tickFormatter={(value) => {
                  const emoIndex = value - 1;
                  return emoIndex >= 0 && emoIndex < emotionValues.length ? 
                    emotionValues[emoIndex] : '';
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const dataPoint = formattedData.find(d => d.emotionValue === value);
                  return [dataPoint?.emotion || '', 'Emotion'];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <defs>
                <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="emotionValue" 
                name="Emotional State" 
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#emotionGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {isMobile && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Rotate your device for a better view of the emotional journey chart.
        </p>
      )}
      
      <p className="text-xs text-muted-foreground mt-4">
        This visualization shows how the emotional tone of the conversation has evolved over time,
        based on AI's analysis of the messages.
      </p>
    </div>
  );
}