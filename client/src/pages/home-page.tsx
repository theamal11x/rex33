import { useApp } from '@/context/app-context';
import { ConversationView } from '@/components/conversation-view';
import { ArchiveView } from '@/components/archive-view';
import { AdminLogin } from '@/components/admin-login';
import { Sidebar } from '@/components/sidebar';
import { AuthProvider } from '@/hooks/use-auth';
import { SocialLinks } from '@/components/social-links';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { SparklesIcon, HeartIcon, BrainIcon, MenuIcon, XIcon } from 'lucide-react';

export default function HomePage() {
  const { view } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax and opacity effects based on scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);
  const bgOffset = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const staggerItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Close mobile menu when resizing window
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
        {/* Dynamic animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fff8ed] to-[#fff1d5]" />
          <motion.div 
            className="absolute inset-0 bg-gradient-grid bg-[length:40px_40px] opacity-30"
            style={{ y: bgOffset }}
          />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-orange-300/10 blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/10 to-blue-300/10 blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="fixed top-20 right-40 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-orange-400 opacity-20 blur-lg"
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div
          className="fixed bottom-40 left-20 w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-blue-400 opacity-20 blur-lg"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div
          className="fixed top-1/3 left-1/4 w-10 h-10 rounded-full bg-gradient-to-r from-accent to-purple-400 opacity-20 blur-lg"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-40 px-6 py-3 glass-effect border-b border-white/20"
          style={{ opacity: headerOpacity, scale: headerScale }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-display text-2xl font-bold">R</span>
              </motion.div>
              <h1 className="text-3xl font-display font-bold text-gradient">Rex</h1>
            </motion.div>
            
            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-6">
              <motion.p 
                className="text-base italic text-slate-700/80 max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                "A mirror to the soul behind the words"
              </motion.p>
              
              <SocialLinks variant="header" size="sm" animate={false} />
            </div>
            
            {/* Mobile menu button */}
            <motion.button
              className="lg:hidden p-2 rounded-full glass-effect"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </motion.button>
          </div>
        </motion.header>
        
        {/* Mobile menu */}
        <motion.div 
          className={`lg:hidden fixed inset-0 bg-white/80 backdrop-blur-lg z-30 flex flex-col items-center justify-center gap-8 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -50 }}
          animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <SocialLinks size="lg" showLabels={true} />
          <p className="text-center text-lg italic text-slate-700/80 max-w-xs px-6">
            "A mirror to the soul behind the words"
          </p>
        </motion.div>
        
        {/* Main Content */}
        <motion.main 
          ref={mainRef}
          className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 pt-6 pb-20 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Content container */}
          <motion.div 
            className="flex-1 flex flex-col h-full"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Content cards */}
            <motion.div 
              className="glass-card flex-1 flex flex-col shadow-lg relative overflow-hidden"
              variants={staggerItemVariants}
            >
              {/* Glassmorphic decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-to-tr from-accent/20 to-accent/5 blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              
              {/* Views */}
              {view === 'conversation' && <ConversationView />}
              {view === 'archive' && <ArchiveView />}
              {view === 'adminLogin' && <AdminLogin />}
            </motion.div>
            
            {/* Feature cards - only show on larger screens when in conversation view */}
            {view === 'conversation' && (
              <motion.div 
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Emotional Intelligence */}
                <motion.div 
                  className="glass-card p-5 flex flex-col items-center text-center"
                  variants={staggerItemVariants}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emotion-500 to-emotion-400 flex items-center justify-center mb-3 shadow-glow-emotion">
                    <HeartIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-gradient-emotion">Emotional Intelligence</h3>
                  <p className="text-sm text-slate-600">Understand the emotions behind each conversation with advanced AI analysis.</p>
                </motion.div>
                
                {/* Personal Reflections */}
                <motion.div 
                  className="glass-card p-5 flex flex-col items-center text-center"
                  variants={staggerItemVariants}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-primary-400 flex items-center justify-center mb-3 shadow-glow">
                    <BrainIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-gradient">Authentic Reflections</h3>
                  <p className="text-sm text-slate-600">Explore a curated collection of personal thoughts, stories, and philosophies.</p>
                </motion.div>
                
                {/* Interactive Experience */}
                <motion.div 
                  className="glass-card p-5 flex flex-col items-center text-center"
                  variants={staggerItemVariants}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-500 to-accent-400 flex items-center justify-center mb-3 shadow-glow-accent">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-gradient-accent">Interactive Experience</h3>
                  <p className="text-sm text-slate-600">Engage in meaningful conversations that feel genuinely human and emotionally rich.</p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <Sidebar />
        </motion.main>
        
        {/* Footer */}
        <motion.footer 
          className="px-6 py-4 bg-white/20 backdrop-blur-sm border-t border-white/20 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-700/80">© {new Date().getFullYear()} Mohsin Raja | A personal emotional journey shared</p>
            <SocialLinks variant="footer" size="sm" animate={false} />
          </div>
        </motion.footer>
      </div>
    </AuthProvider>
  );
}
