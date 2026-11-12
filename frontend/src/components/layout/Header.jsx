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
    <header className="h-16 ios-glass border-b border-black/5 dark:border-white/10 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Mobile Trigger & Apple Spotlight Search Input */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-full text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search ChitFlow..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-[#E5E5EA]/80 dark:bg-[#2C2C2E]/80 border-none rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] text-slate-900 dark:text-white placeholder:text-[#8E8E93] transition-all"
          />
          <kbd className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.2 text-[9px] font-semibold text-[#8E8E93] bg-white dark:bg-black/30 rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right Apple Action Buttons */}
      <div className="flex items-center space-x-2.5">
        {/* Apple Primary Pill Button */}
        <button
          onClick={() => navigate('/payments')}
          className="ios-pill-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs text-white bg-[#007AFF] hover:bg-[#0062CC] shadow-[0_2px_8px_rgba(0,122,255,0.35)]"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Collect Payment</span>
        </button>

        {/* Apple Subtle Pill Button */}
        <button
          onClick={() => navigate('/chit-groups')}
          className="ios-pill-btn hidden md:inline-flex items-center space-x-1 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-[#E5E5EA]/90 dark:bg-[#2C2C2E]/90 hover:bg-[#D1D1D6] dark:hover:bg-[#3A3A3C]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>

        <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Light / Dark mode"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF9500]" /> : <Moon className="w-4 h-4 text-[#5856D6]" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1C1E]" />
          )}
        </button>

        {/* User Profile Avatar Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white font-bold text-xs flex items-center justify-center shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
              LA
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
              {settings.adminName || 'Admin'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#8E8E93] hidden lg:block" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#2C2C2E]/95 backdrop-blur-xl rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-black/5 dark:border-white/10 py-1.5 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-black/5 dark:border-white/10">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {settings.adminName}
                  </p>
                  <p className="text-[10px] text-[#8E8E93] truncate">{settings.adminEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#007AFF] hover:text-white flex items-center space-x-2 rounded-[10px] mx-1 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile & Company</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/reports');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#007AFF] hover:text-white flex items-center space-x-2 rounded-[10px] mx-1 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
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
