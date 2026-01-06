'use client';

import { Suspense } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { TerminalBar } from '@/components/TerminalBar';
import { WarRoom } from '@/components/WarRoom';

function HomeContent() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Bar - Terminal degli Agenti - hidden on mobile */}
      <div className="hidden md:block">
        <TerminalBar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - L'Interrogatorio - full width on mobile */}
        <ChatSidebar />
        
        {/* Main Canvas - La War Room - hidden on mobile */}
        <main className="hidden md:block flex-1 overflow-hidden">
          <WarRoom />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background flex items-center justify-center"><span className="text-text-muted">Caricamento...</span></div>}>
      <HomeContent />
    </Suspense>
  );
}
