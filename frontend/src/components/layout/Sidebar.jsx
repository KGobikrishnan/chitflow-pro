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
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const navGroups = [
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Overview', href: '/', icon: LayoutDashboard },
      { name: 'Collections', href: '/collections', icon: CreditCard },
      { name: 'Collect Payment', href: '/payments', icon: CircleDollarSign },
      { name: 'Receipts', href: '/receipts', icon: Receipt },
    ],
  },
  {
    title: 'CHIT MANAGEMENT',
    items: [
      { name: 'Chit Groups', href: '/chit-groups', icon: Layers },
      { name: 'Members', href: '/members', icon: Users },
      { name: 'Auctions & Payouts', href: '/payouts', icon: Trophy },
    ],
  },
  {
    title: 'AUDIT & CONFIG',
    items: [
      { name: 'Reports & Audits', href: '/reports', icon: BarChart3 },
      { name: 'Notifications', href: '/notifications', icon: Bell, badgeKey: 'notifications' },
      { name: 'System Settings', href: '/settings', icon: Settings },
    ],
  },
];

export const Sidebar = ({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) => {
  const notifications = useAppStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0d121f] text-slate-300 transition-all duration-200 ease-in-out border-r border-[#1a2236] flex flex-col ${
          collapsed ? 'w-[68px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#1a2236]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              CF
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-semibold text-white tracking-tight text-sm">ChitFlow</span>
                <span className="ml-1.5 text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SAAS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-2.5 pb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
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
                          collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-2.5 py-2'
                        } rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-600/90 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-[#151c2d] hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
                        {!collapsed && <span>{item.name}</span>}
                      </div>

                      {!collapsed && item.badgeKey === 'notifications' && unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                          {unreadCount}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Legal Ledger badge / Compliance info */}
        {!collapsed ? (
          <div className="p-3 border-t border-[#1a2236]">
            <div className="p-2.5 rounded-md bg-[#131929] border border-[#1e2840] flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-medium text-slate-200 truncate">TN Act 1982 Reg.</div>
                  <div className="text-[9px] font-mono text-slate-400 truncate">Audited Ledgers</div>
                </div>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-[#1a2236] flex justify-center" title="Compliance Active">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </aside>
    </>
  );
};
