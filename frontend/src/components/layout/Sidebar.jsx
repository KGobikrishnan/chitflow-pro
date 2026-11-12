import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Users,
  CreditCard,
  CircleDollarSign,
  Trophy,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const navGroups = [
  {
    title: 'Operations',
    items: [
      { name: 'Overview', href: '/', icon: LayoutDashboard, color: 'bg-[#007AFF] text-white' },
      { name: 'Collections', href: '/collections', icon: CreditCard, color: 'bg-[#34C759] text-white' },
      { name: 'Collect Payment', href: '/payments', icon: CircleDollarSign, color: 'bg-[#5856D6] text-white' },
      { name: 'Receipts', href: '/receipts', icon: Receipt, color: 'bg-[#FF9500] text-white' },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Chit Groups', href: '/chit-groups', icon: Layers, color: 'bg-[#AF52DE] text-white' },
      { name: 'Members', href: '/members', icon: Users, color: 'bg-[#00C7BE] text-white' },
      { name: 'Auctions & Payouts', href: '/payouts', icon: Trophy, color: 'bg-[#FF2D55] text-white' },
    ],
  },
  {
    title: 'Analytics & Settings',
    items: [
      { name: 'Reports & Audit', href: '/reports', icon: BarChart3, color: 'bg-[#32ADE6] text-white' },
      { name: 'Notifications', href: '/notifications', icon: Bell, badgeKey: 'notifications', color: 'bg-[#FF3B30] text-white' },
      { name: 'Settings', href: '/settings', icon: Settings, color: 'bg-[#8E8E93] text-white' },
    ],
  },
];

export const Sidebar = ({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) => {
  const notifications = useAppStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#F2F2F7]/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl text-slate-800 dark:text-slate-200 transition-all duration-300 ease-in-out border-r border-black/5 dark:border-white/10 flex flex-col ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Apple macOS/iOS style Window Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Apple Squircle Icon */}
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-tr from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white font-bold text-sm shadow-[0_3px_10px_rgba(0,122,255,0.35)] shrink-0">
              CF
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight text-base font-sans">
                  ChitFlow
                </span>
                <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#007AFF]/15 text-[#007AFF] dark:text-[#0A84FF]">
                  iOS Edition
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Apple Style Grouped Nav List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-tight text-[#8E8E93] uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={({ isActive }) =>
                        `flex items-center ${
                          collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                        } rounded-[12px] text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#007AFF] text-white font-semibold shadow-[0_2px_8px_rgba(0,122,255,0.35)]'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center space-x-3">
                            {/* Apple settings icon tile */}
                            <div
                              className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-white/20 text-white' : item.color
                              } shadow-[0_2px_5px_rgba(0,0,0,0.1)]`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {!collapsed && (
                              <span className={isActive ? 'text-white font-semibold' : ''}>
                                {item.name}
                              </span>
                            )}
                          </div>

                          {!collapsed && item.badgeKey === 'notifications' && unreadCount > 0 && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-white text-[#007AFF]'
                                  : 'bg-[#FF3B30] text-white shadow-[0_2px_5px_rgba(255,59,48,0.3)]'
                              }`}
                            >
                              {unreadCount}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Compliance Card */}
        {!collapsed ? (
          <div className="p-3 border-t border-black/5 dark:border-white/10">
            <div className="p-3 rounded-[14px] bg-white dark:bg-[#2C2C2E] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">TN Chit Fund 1982</div>
                  <div className="text-[10px] text-slate-400 truncate">Licensed & Audited</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#34C759] shrink-0 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-black/5 dark:border-white/10 flex justify-center">
            <ShieldCheck className="w-5 h-5 text-[#34C759]" />
          </div>
        )}
      </aside>
    </>
  );
};
