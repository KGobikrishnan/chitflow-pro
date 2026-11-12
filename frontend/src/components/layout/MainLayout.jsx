import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'sonner';

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] flex flex-col antialiased selection:bg-[#007AFF]/20 selection:text-[#007AFF]">
      <Toaster position="top-center" richColors theme="system" />
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        }`}
      >
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
