import { useApp } from '@/context/app-context';
import { ConversationView } from '@/components/conversation-view';
import { ArchiveView } from '@/components/archive-view';
import { AdminLogin } from '@/components/admin-login';
import { Sidebar } from '@/components/sidebar';
import { AuthProvider } from '@/hooks/use-auth';
import { SocialLinks } from '@/components/social-links';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { view } = useApp();
  
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFBEB] text-slate-800 font-sans">
        {/* Header */}
        <header className="px-6 py-4 bg-gradient-to-r from-amber-100 to-[#FFFBEB] border-b border-amber-500/20 shadow-sm">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                <span className="text-white font-['Caveat'] text-2xl font-bold">R</span>
              </div>
              <h1 className="text-2xl font-['Caveat'] font-bold text-amber-700">Rex</h1>
            </div>
            <p className="hidden md:block text-sm italic text-slate-700/70">"A mirror to the soul behind the words"</p>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4">
          <div className="flex-1 flex flex-col h-full transition-all duration-300">
            {view === 'conversation' && <ConversationView />}
            {view === 'archive' && <ArchiveView />}
            {view === 'adminLogin' && <AdminLogin />}
          </div>
          
          <Sidebar />
        </main>
      </div>
    </AuthProvider>
  );
}
