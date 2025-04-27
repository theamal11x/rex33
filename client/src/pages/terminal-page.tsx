import { useApp } from '@/context/app-context';
import { TerminalUI } from '@/components/terminal-ui';
import { AuthProvider } from '@/hooks/use-auth';
import { useState } from 'react';

export default function TerminalPage() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <AuthProvider>
      <div className={`min-h-screen flex flex-col font-sans ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Left sidebar with pink background */}
        <div className="fixed left-0 top-0 h-full w-16 bg-pink-50 flex flex-col items-center py-6 space-y-6">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          <div 
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700"
            onClick={toggleDarkMode}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col ml-16">
          <TerminalUI darkMode={darkMode} />
        </div>
      </div>
    </AuthProvider>
  );
}