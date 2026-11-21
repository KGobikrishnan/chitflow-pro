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
  Gift,
  ArrowUpRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Logo } from '../common/Logo';

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
    title: 'DISBURSEMENTS & PAYABLES',
    items: [
      { name: 'Non-Auction Payments', href: '/disbursements', icon: ArrowUpRight },
      { name: 'Gifts & Payables', href: '/gifts-payables', icon: Gift },
      { name: 'Auctions & Payouts', href: '/payouts', icon: Trophy },
    ],
  },
  {
    title: 'CHIT MANAGEMENT',
    items: [
      { name: 'Chit Groups', href: '/chit-groups', icon: Layers },
      { name: 'Members', href: '/members', icon: Users },
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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0d121f] text-slate-200 transition-all duration-200 ease-in-out border-r border-[#1a2236] flex flex-col ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Bar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1a2236]">
          <div className="flex items-center overflow-hidden">
            {collapsed ? (
              <Logo size="md" showText={false} />
            ) : (
              <div className="flex items-center space-x-2.5">
                <Logo size="md" showText={false} />
                <div className="leading-tight">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-white tracking-tight text-base">
                      Chit<span className="text-indigo-400">Flow</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono font-medium tracking-wide">
                    Financial SaaS
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-3 pb-2 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
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
                          collapsed ? 'justify-center px-0 py-3' : 'justify-between px-3.5 py-2.5'
                        } rounded-lg text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                            : 'text-slate-300 hover:bg-[#161f33] hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
                        {!collapsed && <span className="tracking-normal">{item.name}</span>}
                      </div>

                      {!collapsed && item.badgeKey === 'notifications' && unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500 text-white">
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
          <div className="p-3.5 border-t border-[#1a2236]">
            <div className="p-3 rounded-lg bg-[#131929] border border-[#1e2840] flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 truncate">TN Act 1982 Reg.</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">Audited FinTech Ledgers</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-xs shadow-emerald-400/50" />
            </div>
          </div>
        ) : (
          <div className="p-3.5 border-t border-[#1a2236] flex justify-center" title="Compliance Active">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        )}
      </aside>
    </>
  );
};
