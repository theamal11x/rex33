import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { AdminView } from '@/components/admin-view';
import { Loader2 } from 'lucide-react';

function AdminPageContent() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFBEB]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBEB] text-slate-800 font-sans">
      {/* Header */}
      <header className="px-6 py-4 bg-gradient-to-r from-teal-100/30 to-[#FFFBEB] border-b border-teal-600/20 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center animate-pulse">
              <span className="text-white font-['Caveat'] text-2xl font-bold">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-['Caveat'] font-bold text-teal-700">Rex</h1>
              <p className="text-sm text-teal-700/70">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4">
        <AdminView />
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  );
}
