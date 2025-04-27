import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function AdminLogin() {
  const { setView } = useApp();
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      await loginMutation.mutateAsync({ email, password });
      setLocation('/admin');
    } catch (error) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full justify-center items-center">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full border border-amber-500/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 mx-auto flex items-center justify-center">
            <span className="text-white font-['Caveat'] text-2xl font-bold">R</span>
          </div>
          <h2 className="text-xl font-medium mt-4">Rex Admin Login</h2>
          <p className="text-slate-700/70 text-sm">Enter your credentials to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-1">Email</Label>
              <Input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-cream border border-amber-300/30 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none text-slate-800"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-slate-800 mb-1">Password</Label>
              <Input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-cream border border-amber-300/30 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none text-slate-800"
                placeholder="Enter your password"
              />
            </div>
            
            {error && (
              <div className="text-rose-600 text-sm">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Button
            onClick={() => setView('conversation')}
            variant="ghost"
            className="text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
