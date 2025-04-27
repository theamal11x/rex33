import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-amber-500 mb-6 flex items-center justify-center shadow-lg"
              initial={{ y: 20, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <span className="text-white font-['Caveat'] text-7xl font-bold">R</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-amber-800 mb-2 font-['Caveat']"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Rex
            </motion.h1>
            
            <motion.div 
              className="h-0.5 w-16 bg-amber-500 mb-3"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            
            <motion.p 
              className="text-amber-700/80 text-center max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              A reflection of Mohsin Raja's inner world
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}