import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Trash, Plus, Save, Loader2 } from 'lucide-react';
import { useApp } from '@/context/app-context';

interface AiGuideline {
  id: number;
  title: string;
  content: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AiGuidelineFormData {
  id?: number;
  title: string;
  content: string;
  priority: number;
  isActive: boolean;
}

const emptyGuideline: AiGuidelineFormData = {
  title: '',
  content: '',
  priority: 1,
  isActive: true,
};

export function AiGuidelinesManager() {
  const [guidelines, setGuidelines] = useState<AiGuideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<AiGuidelineFormData>(emptyGuideline);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Fetch guidelines on component mount
  useEffect(() => {
    fetchGuidelines();
  }, []);
  
  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-guidelines');
      
      if (!response.ok) {
        throw new Error('Failed to fetch guidelines');
      }
      
      const data = await response.json();
      setGuidelines(data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI guidelines. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };
  
  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: parseInt(value) }));
  };
  
  const resetForm = () => {
    setFormData(emptyGuideline);
    setIsEditing(false);
  };
  
  const handleEditGuideline = (guideline: AiGuideline) => {
    setFormData({
      id: guideline.id,
      title: guideline.title,
      content: guideline.content,
      priority: guideline.priority,
      isActive: guideline.isActive,
    });
    setIsEditing(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const isUpdate = !!formData.id;
      const url = isUpdate 
        ? `/api/ai-guidelines/${formData.id}`
        : '/api/ai-guidelines';
      
      const method = isUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save guideline');
      }
      
      toast({
        title: 'Success',
        description: isUpdate ? 'Guideline updated successfully.' : 'New guideline created successfully.',
      });
      
      resetForm();
      fetchGuidelines();
    } catch (error) {
      console.error('Error saving guideline:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteGuideline = async (id: number) => {
    try {
      setDeleting(id);
      
      const response = await fetch(`/api/ai-guidelines/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete guideline');
      }
      
      toast({
        title: 'Success',
        description: 'Guideline deleted successfully.',
      });
      
      fetchGuidelines();
      
      // If we were editing this guideline, reset the form
      if (formData.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting guideline:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete guideline. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">AI Response Guidelines</h2>
        <p className="text-muted-foreground mb-4">
          Create guidelines that influence how Rex responds to users. Guidelines with higher priority take precedence when there are conflicting instructions.
        </p>
        
        {/* New/Edit Guideline Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Guideline' : 'New Guideline'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update this response guideline' 
                : 'Add a new guideline to influence Rex\'s responses'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Guideline title (visible to admins only)"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Guideline content (will be included in prompts to Gemini)"
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority.toString()} 
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Low</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - High</SelectItem>
                      <SelectItem value="4">4 - Highest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isActive">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Guideline
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Guideline
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Guidelines List */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold">Existing Guidelines</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : guidelines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No guidelines found. Create your first guideline above.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {guidelines.map(guideline => (
                <Card key={guideline.id} className={`${!guideline.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {guideline.title}
                          {!guideline.isActive && (
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Priority: {guideline.priority} | 
                          Created: {new Date(guideline.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditGuideline(guideline)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteGuideline(guideline.id)}
                          disabled={deleting === guideline.id}
                        >
                          {deleting === guideline.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{guideline.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}