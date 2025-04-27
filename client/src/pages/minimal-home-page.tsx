import { MinimalConversationView } from '@/components/minimal-conversation-view';
import { useApp } from '@/context/app-context';
import { AuthProvider } from '@/hooks/use-auth';

export default function MinimalHomePage() {
  const { view } = useApp();
  
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <MinimalConversationView />
        </div>
      </div>
    </AuthProvider>
  );
}