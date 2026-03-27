'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PasswordGate from './components/PasswordGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PasswordGate>
      <div className="flex h-screen overflow-hidden bg-[#13132B]">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Content area */}
          <main className="flex-1 overflow-auto bg-[#13132B] p-6">
            {children}
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
