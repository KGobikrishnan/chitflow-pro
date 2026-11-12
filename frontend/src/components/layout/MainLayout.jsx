import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'sonner';

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f19] text-[#090d14] dark:text-[#f8fafc] flex flex-col antialiased">
      <Toaster position="top-right" richColors theme="system" />
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
          collapsed ? 'lg:pl-[68px]' : 'lg:pl-64'
        }`}
      >
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1520px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
