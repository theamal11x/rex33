import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#fff8ed] to-[#fff1d5] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background pattern grid */}
          <div className="absolute inset-0 bg-gradient-grid bg-[length:40px_40px] opacity-30"></div>
          
          {/* Animated circles in background */}
          <motion.div 
            className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary to-orange-300 opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            style={{ top: '20%', left: '30%' }}
          />
          
          <motion.div 
            className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-secondary to-blue-400 opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 20, 0]  
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ bottom: '20%', right: '30%' }}
          />
          
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-accent to-purple-400 opacity-20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, 30, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{ top: '60%', left: '20%' }}
          />
          
          {/* Main content */}
          <motion.div 
            className="flex flex-col items-center relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-orange-400 mb-8 flex items-center justify-center shadow-glow"
              initial={{ y: 20, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <motion.span 
                className="text-white font-display text-9xl font-bold"
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                R
              </motion.span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl font-bold text-gradient mb-3 font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Rex
            </motion.h1>
            
            <motion.div 
              className="h-1 w-32 bg-gradient-to-r from-primary to-orange-400 mb-5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            />
            
            <motion.p 
              className="text-lg text-center max-w-sm text-slate-700 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              A reflection of Mohsin Raja's inner world
            </motion.p>
            
            {/* Loading indicator */}
            <motion.div 
              className="mt-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}