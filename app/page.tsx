'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Dashboard } from '@/components/dashboard';
import { LiveVerification } from '@/components/live-verification';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'verification'>('dashboard');
  const [userCount, setUserCount] = useState(0);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header currentPage={currentPage} userCount={userCount} />
        <main className="flex-1 overflow-auto p-6">
          {currentPage === 'dashboard' && <Dashboard onCountChange={setUserCount} />}
          {currentPage === 'verification' && <LiveVerification />}
        </main>
      </div>
    </div>
  );
}
