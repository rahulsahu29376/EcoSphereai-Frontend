import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { QuickLogModal } from '../components/dashboard/QuickLogModal';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080E10] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Sticky Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenQuickLog={() => setQuickLogOpen(true)}
        />

        {/* Content Page Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ onOpenQuickLog: () => setQuickLogOpen(true) }} />
          </div>

          {/* Minimal Clean Footer */}
          <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EcoSphere AI Platform &bull; IPCC & GHG Protocol Aligned</span>
              </div>
              <div>
                <span>Production Ready AI Sustainability Engine &bull; Net Zero 2026</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Quick Log Modal */}
      <QuickLogModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
      />
    </div>
  );
};
