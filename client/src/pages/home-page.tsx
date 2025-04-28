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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-[#FFFBEB] text-slate-800 font-sans">
        {/* Header */}
        <motion.header 
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center">
            <motion.div 
              className="flex items-center space-x-3 mb-2 sm:mb-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md">
                <span className="text-white font-['Caveat'] text-xl sm:text-2xl font-bold">R</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-['Caveat'] font-bold text-amber-700">Rex</h1>
            </motion.div>
            <motion.p 
              className="text-xs sm:text-sm italic text-slate-700/70 mb-2 sm:mb-0 sm:ml-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              "A mirror to the soul behind the words"
            </motion.p>
          </div>
          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </motion.header>
        
        {/* Main Content */}
        <motion.main 
          className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-3 sm:p-4 gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div 
            className="order-2 lg:order-1 flex-1 flex flex-col h-full transition-all duration-300 bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-amber-100 overflow-hidden"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {(view === 'conversation' || view === 'archive') && <ConversationView />}
            {view === 'adminLogin' && <AdminLogin />}
          </motion.div>
          
          <div className="order-1 lg:order-2">
            <Sidebar />
          </div>
        </motion.main>
        
        {/* Footer */}
        <motion.footer 
          className="py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-amber-50 to-amber-100 border-t border-amber-200 text-center text-xs text-amber-700/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>© {new Date().getFullYear()} Mohsin Raja. A personal emotional journey shared.</p>
        </motion.footer>
      </div>
    </AuthProvider>
  );
}
