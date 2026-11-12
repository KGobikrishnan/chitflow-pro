import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  Plus,
  CreditCard,
  User,
  Shield,
  Layers,
  ChevronDown,
  Command,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const notifications = useAppStore((state) => state.notifications);
  const settings = useAppStore((state) => state.settings);

  const [profileOpen, setProfileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/members?q=${encodeURIComponent(quickSearch)}`);
    }
  };

  return (
    <header className="h-14 bg-white/90 dark:bg-[#111625]/90 backdrop-blur-md border-b border-[#e2e4e9] dark:border-[#1e283d] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Mobile trigger & Global Command Search */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-64 sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member, phone, receipt or group..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-1 text-xs bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 font-normal"
          />
          <kbd className="hidden sm:inline-flex items-center absolute right-2 top-1/2 -translate-y-1/2 px-1 text-[9px] font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Action: Collect Payment */}
        <button
          onClick={() => navigate('/payments')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Collect Payment</span>
        </button>

        {/* Quick Action: Create Group */}
        <button
          onClick={() => navigate('/chit-groups')}
          className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-200/60 dark:border-slate-700"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle light / dark mode"
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Admin User Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-indigo-600 text-white font-semibold text-[11px] flex items-center justify-center">
              LA
            </div>
            <span className="hidden lg:inline text-xs font-medium text-slate-800 dark:text-slate-200">
              {settings.adminName || 'Admin'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111625] rounded-md shadow-lg border border-[#e2e4e9] dark:border-[#1e283d] py-1 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#e2e4e9] dark:border-[#1e283d]">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {settings.adminName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{settings.adminEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account & Legal</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/reports');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audit Logs</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
