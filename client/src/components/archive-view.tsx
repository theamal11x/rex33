import { useApp } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export function ArchiveView() {
  const { setView, categories, contentEntries, selectedCategoryId, setSelectedCategoryId } = useApp();
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  
  const selectedEntryData = contentEntries.find(entry => entry.id === selectedEntry);
  
  const formatDate = (dateString: Date | string) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col flex-1 border border-amber-500/10">
        {/* Archive Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-100/50 to-cream border-b border-amber-500/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">Reflection Archive</h2>
            <p className="text-slate-700/70 text-sm">Mohsin's archived thoughts and stories</p>
          </div>
          <Button
            onClick={() => setView('conversation')}
            variant="ghost"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to conversation
          </Button>
        </div>
        
        {/* Archive Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedEntry ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Button
                onClick={() => setSelectedEntry(null)}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to archive
              </Button>
              
              {selectedEntryData && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-2 flex justify-between">
                      <h3 className="text-xl font-medium">{selectedEntryData.title}</h3>
                      <span className="text-sm text-slate-500">
                        {formatDate(selectedEntryData.createdAt)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                        {categories.find(c => c.id === selectedEntryData.categoryId)?.name || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedEntryData.content}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <>
              {/* Chapters List */}
              <h3 className="text-lg font-medium mb-4">Reflection Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="bg-cream rounded-xl p-5 border border-amber-500/10 hover:shadow-md transition-shadow cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                    <p className="text-slate-700/70 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center text-sm text-amber-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>
                        {contentEntries.filter(e => e.categoryId === category.id).length} entries
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Recent Entries */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-amber-500/20 pb-2">
                  <h3 className="text-lg font-medium">
                    {selectedCategoryId 
                      ? `Entries in ${categories.find(c => c.id === selectedCategoryId)?.name || 'Category'}`
                      : 'Recent Reflections'
                    }
                  </h3>
                  
                  {selectedCategoryId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:text-amber-700"
                      onClick={() => setSelectedCategoryId(null)}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {contentEntries
                    .filter(entry => !selectedCategoryId || entry.categoryId === selectedCategoryId)
                    .map((entry) => (
                      <motion.div
                        key={entry.id}
                        className="bg-white rounded-xl p-5 border border-amber-500/10 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedEntry(entry.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">{entry.title}</h4>
                          <span className="text-xs text-slate-500">{formatDate(entry.createdAt)}</span>
                        </div>
                        <p className="text-slate-700/80 text-sm line-clamp-2">
                          {entry.content}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-amber-100/50 rounded-full text-amber-800">
                            {categories.find(c => c.id === entry.categoryId)?.name || 'Uncategorized'}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-amber-600 hover:text-amber-700"
                          >
                            Read more
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    
                  {contentEntries.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <p>No reflection entries found.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
