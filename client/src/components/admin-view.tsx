import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { PenIcon, PlusIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminView() {
  const { user, logoutMutation } = useAuth();
  const { refreshContent, categories } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [contentEntries, setContentEntries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  
  // Content form states
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [contentTitle, setContentTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentCategory, setContentCategory] = useState('');
  const [contentStatus, setContentStatus] = useState('draft');
  
  // Category form states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryType, setCategoryType] = useState('personal_growth');
  
  // Delete confirmation
  const [deleteContentId, setDeleteContentId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  
  // Load content entries
  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setContentEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content entries',
        variant: 'destructive'
      });
    }
  };
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Content CRUD operations
  const openContentDialog = (entry?: any) => {
    if (entry) {
      setEditingContentId(entry.id);
      setContentTitle(entry.title);
      setContentBody(entry.content);
      setContentCategory(entry.categoryId.toString());
      setContentStatus(entry.status);
    } else {
      setEditingContentId(null);
      setContentTitle('');
      setContentBody('');
      setContentCategory(categories[0]?.id.toString() || '');
      setContentStatus('draft');
    }
    setIsContentDialogOpen(true);
  };
  
  const handleContentSubmit = async () => {
    try {
      const formData = {
        title: contentTitle,
        content: contentBody,
        categoryId: parseInt(contentCategory),
        status: contentStatus
      };
      
      let response;
      if (editingContentId) {
        response = await apiRequest('PUT', `/api/content/${editingContentId}`, formData);
      } else {
        response = await apiRequest('POST', '/api/content', formData);
      }
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: editingContentId 
            ? 'Content entry updated successfully' 
            : 'Content entry created successfully'
        });
        
        setIsContentDialogOpen(false);
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content entry',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteContent = async () => {
    if (!deleteContentId) return;
    
    try {
      const response = await apiRequest('DELETE', `/api/content/${deleteContentId}`, undefined);
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Content entry deleted successfully'
        });
        
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content entry',
        variant: 'destructive'
      });
    } finally {
      setDeleteContentId(null);
    }
  };
  
  // Category CRUD operations
  const openCategoryDialog = (category?: any) => {
    if (category) {
      setEditingCategoryId(category.id);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
      setCategoryType(category.type);
    } else {
      setEditingCategoryId(null);
      setCategoryName('');
      setCategoryDescription('');
      setCategoryType('personal_growth');
    }
    setIsCategoryDialogOpen(true);
  };
  
  const handleCategorySubmit = async () => {
    try {
      const formData = {
        name: categoryName,
        description: categoryDescription,
        type: categoryType
      };
      
      let response;
      if (editingCategoryId) {
        response = await apiRequest('PUT', `/api/categories/${editingCategoryId}`, formData);
      } else {
        response = await apiRequest('POST', '/api/categories', formData);
      }
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: editingCategoryId 
            ? 'Category updated successfully' 
            : 'Category created successfully'
        });
        
        setIsCategoryDialogOpen(false);
        refreshContent();
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    
    try {
      const response = await apiRequest('DELETE', `/api/categories/${deleteCategoryId}`, undefined);
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Category deleted successfully'
        });
        
        refreshContent();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      });
    } finally {
      setDeleteCategoryId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col flex-1 border border-teal-600/10">
        {/* Admin Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-100/30 to-cream border-b border-teal-600/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">Admin Dashboard</h2>
            <p className="text-slate-700/70 text-sm">Manage your reflections and content</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-700/70">Welcome, {user?.username}</span>
            <Button 
              onClick={() => setLocation('/')}
              variant="ghost"
              className="text-teal-600 hover:text-teal-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Exit Admin
            </Button>
          </div>
        </div>
        
        {/* Admin Content */}
        <div className="flex-1 overflow-auto">
          {/* Admin Navigation */}
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-teal-600/10 bg-teal-100/10">
              <TabsList className="border-b-0 bg-transparent h-auto">
                <TabsTrigger 
                  value="content" 
                  className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600 rounded-none"
                >
                  Manage Content
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600 rounded-none"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600 rounded-none"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Content Management */}
            <TabsContent value="content" className="p-6 m-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Your Reflections</h3>
                <Button 
                  onClick={() => openContentDialog()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </div>
              
              {/* Content Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-teal-600/10 rounded-lg overflow-hidden">
                  <thead className="bg-teal-100/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700/70 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700/70 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700/70 uppercase tracking-wider">Date Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700/70 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700/70 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-600/10">
                    {contentEntries.length > 0 ? (
                      contentEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100/50 text-amber-800">
                              {categories.find(c => c.id === entry.categoryId)?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700/70">
                            {formatDate(entry.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              entry.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : entry.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => openContentDialog(entry)}
                                variant="ghost" 
                                size="sm" 
                                className="text-teal-600 hover:text-teal-700 p-1 h-8 w-8"
                              >
                                <PenIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => setDeleteContentId(entry.id)}
                                variant="ghost" 
                                size="sm"
                                className="text-rose-600 hover:text-rose-700 p-1 h-8 w-8"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No content entries found. Create your first entry!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Category Management */}
            <TabsContent value="categories" className="p-6 m-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Chapter Management</h3>
                <Button 
                  onClick={() => openCategoryDialog()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Chapter
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="bg-white p-4 rounded-lg border border-teal-600/10 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{category.name}</h4>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => openCategoryDialog(category)}
                            variant="ghost" 
                            size="sm"
                            className="text-teal-600 hover:text-teal-700 p-1 h-8 w-8"
                          >
                            <PenIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => setDeleteCategoryId(category.id)}
                            variant="ghost" 
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 p-1 h-8 w-8"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700/70 mt-2">
                        {contentEntries.filter(e => e.categoryId === category.id).length} entries, 
                        last updated {formatDate(category.updatedAt)}
                      </p>
                      {category.description && (
                        <p className="text-sm text-slate-600 mt-2 italic">
                          {category.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-lg">
                    No categories found. Create your first category!
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Settings */}
            <TabsContent value="settings" className="p-6 m-0">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Username</p>
                      <p className="font-medium">{user?.username}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleLogout}
                        variant="outline"
                        className="text-slate-700"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Content Edit Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingContentId ? 'Edit Content' : 'Create New Content'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {editingContentId ? 'update' : 'create'} a reflection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter a title for your reflection"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={contentCategory} onValueChange={setContentCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={contentStatus} onValueChange={setContentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder="Write your reflection here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsContentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContentSubmit}
              disabled={!contentTitle || !contentBody || !contentCategory}
            >
              {editingContentId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Category Edit Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {editingCategoryId ? 'update' : 'create'} a category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter a name for the category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={categoryType} onValueChange={setCategoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early_reflections">Early Reflections</SelectItem>
                  <SelectItem value="professional_journey">Professional Journey</SelectItem>
                  <SelectItem value="personal_growth">Personal Growth</SelectItem>
                  <SelectItem value="relationship_reflections">Relationship Reflections</SelectItem>
                  <SelectItem value="philosophy">Philosophy</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Enter a description for the category"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCategorySubmit}
              disabled={!categoryName || !categoryType}
            >
              {editingCategoryId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Content Confirmation */}
      <AlertDialog open={deleteContentId !== null} onOpenChange={(open) => !open && setDeleteContentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The content will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContent} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteCategoryId !== null} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The category and all associated content will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
