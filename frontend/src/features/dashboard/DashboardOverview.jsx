import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Download,
  AlertCircle,
  Clock,
  Layers,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV } from '../../utils/export';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);
  const transactions = useAppStore((state) => state.transactions);
  const payouts = useAppStore((state) => state.payouts);

  const [activeSegment, setActiveSegment] = useState('ALL');

  const kpis = analyticsService.calculateKPIs({ groups, members, installments, payouts });
  const trendData = analyticsService.getMonthlyCollectionTrend(transactions);

  const groupPerformance = groups.map((g) => {
    const gInst = installments.filter((ins) => ins.groupId === g.id);
    const expected = gInst.reduce((s, ins) => s + (ins.expectedAmount || 0), 0);
    const collected = gInst.reduce((s, ins) => s + (ins.paidAmount || 0), 0);
    const pending = gInst.reduce((s, ins) => s + (ins.remainingAmount || 0), 0);
    const percent = expected > 0 ? Math.round((collected / expected) * 100) : 0;
    return {
      id: g.id,
      name: g.name,
      chitValue: g.chitValue,
      expected,
      collected,
      pending,
      percent,
    };
  });

  const recentTransactions = [...transactions].slice(0, 6);
  const upcomingCollections = installments
    .filter((ins) => ins.status === 'PENDING' || ins.status === 'UPCOMING')
    .slice(0, 5);

  const totalInstallmentCount =
    kpis.distribution.paid +
    kpis.distribution.partiallyPaid +
    kpis.distribution.pending +
    kpis.distribution.overdue;

  const paidShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.paid / totalInstallmentCount) * 100) : 0;
  const partialShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.partiallyPaid / totalInstallmentCount) * 100) : 0;
  const pendingShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.pending / totalInstallmentCount) * 100) : 0;
  const overdueShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.overdue / totalInstallmentCount) * 100) : 0;

  const handleExport = () => {
    const data = transactions.map((tx) => ({
      'Receipt #': tx.receiptNumber,
      'Date': tx.paymentDate,
      'Member ID': tx.memberId,
      'Amount (INR)': tx.amount,
      'Channel': tx.paymentMethod,
      'Reference': tx.referenceNumber,
    }));
    exportToCSV(data, `ChitFlow_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Apple Large Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider block mb-0.5">
            Real-time Operations
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            Financial Overview
          </h1>
          <p className="text-xs text-[#8E8E93] mt-0.5 font-medium">
            Tamil Nadu Chit Funds Act compliant ledger & subscription analytics
          </p>
        </div>

        {/* Apple Segmented Filter & Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExport}
            className="ios-pill-btn px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#F2F2F7] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="ios-pill-btn px-4 py-2 text-xs text-white bg-[#007AFF] hover:bg-[#0062CC] shadow-[0_3px_12px_rgba(0,122,255,0.35)] flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Collect Installment</span>
          </button>
        </div>
      </div>

      {/* Apple iOS Modern Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="ios-card p-5 relative overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Total Realized Inflow
            </span>
            <div className="w-8 h-8 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {formatCurrency(kpis.totalCollected)}
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-[#34C759]">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>{kpis.collectionEfficiency}% overall realization rate</span>
          </div>
        </div>

        {/* Expected Monthly Collection */}
        <div className="ios-card p-5 relative overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Expected Monthly Target
            </span>
            <div className="w-8 h-8 rounded-full bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {formatCurrency(kpis.expectedMonthlyCollection)}
          </div>
          <div className="mt-2 text-xs text-[#8E8E93] font-medium">
            Across {kpis.activeChits} active subscription circles
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="ios-card p-5 relative overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Outstanding Receivables
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FF9500]/15 text-[#FF9500] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {formatCurrency(kpis.totalPending)}
          </div>
          <div className="mt-2 text-xs text-[#8E8E93] font-medium">
            Scheduled across remaining circle tenures
          </div>
        </div>

        {/* Overdue */}
        <div className="ios-card p-5 relative overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Overdue Beyond Grace
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-[#FF3B30]">
            {formatCurrency(kpis.overdueAmount)}
          </div>
          <div className="mt-2 text-xs text-[#FF3B30] font-semibold">
            {kpis.overdueCount} delayed member installments
          </div>
        </div>
      </div>

      {/* Secondary Apple Status Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="ios-card p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#5856D6] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(88,86,214,0.3)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase">Active Chits</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{kpis.activeChits} / {groups.length} Circles</div>
          </div>
        </div>

        <div className="ios-card p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#00C7BE] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,199,190,0.3)]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase">Subscribers</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{kpis.totalMembers} Enrolled</div>
          </div>
        </div>

        <div className="ios-card p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#34C759] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(52,199,89,0.3)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase">Payouts Released</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(kpis.totalPayouts)}</div>
          </div>
        </div>

        <div className="ios-card p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#AF52DE] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(175,82,222,0.3)]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase">Auctions Conducted</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{payouts.length} Draws Completed</div>
          </div>
        </div>
      </div>

      {/* Main Apple Inflow Curve & Health Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apple Chart View */}
        <div className="lg:col-span-2 ios-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Realized Inflow Curve
              </h3>
              <p className="text-xs text-[#8E8E93] mt-0.5">
                Monthly realized subscription cash flow against cycle targets
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#007AFF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)]" />
              <span>Realized Collection (INR)</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="appleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#007AFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8E8E93' }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 11, fill: '#8E8E93' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Collected']}
                  contentStyle={{
                    backgroundColor: 'rgba(28, 28, 30, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#007AFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#appleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Apple Segmented Health Widget */}
        <div className="ios-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Installment Health
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {totalInstallmentCount} Total
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] mb-5">
              Live status distribution of all subscriber schedules
            </p>

            {/* iOS Apple Health Style Multi-Segmented Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-[#E5E5EA] dark:bg-[#2C2C2E] p-0.5 shadow-inner mb-6">
              <div style={{ width: `${paidShare}%` }} className="bg-[#34C759] h-full rounded-l-full" title={`Paid: ${paidShare}%`} />
              <div style={{ width: `${partialShare}%` }} className="bg-[#FF9500] h-full" title={`Partial: ${partialShare}%`} />
              <div style={{ width: `${pendingShare}%` }} className="bg-[#5856D6] h-full" title={`Pending: ${pendingShare}%`} />
              <div style={{ width: `${overdueShare}%` }} className="bg-[#FF3B30] h-full rounded-r-full" title={`Overdue: ${overdueShare}%`} />
            </div>

            {/* Apple Details Rows */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#34C759] shadow-[0_1px_4px_rgba(52,199,89,0.4)]" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Fully Settled</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.paid}</span>
                  <span className="text-[#8E8E93] ml-1.5 font-medium">({paidShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF9500] shadow-[0_1px_4px_rgba(255,149,0,0.4)]" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Partially Paid</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.partiallyPaid}</span>
                  <span className="text-[#8E8E93] ml-1.5 font-medium">({partialShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#5856D6] shadow-[0_1px_4px_rgba(88,86,214,0.4)]" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Pending Cycles</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.pending}</span>
                  <span className="text-[#8E8E93] ml-1.5 font-medium">({pendingShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-[0_1px_4px_rgba(255,59,48,0.4)]" />
                  <span className="font-semibold text-[#FF3B30]">Overdue Past Grace</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#FF3B30]">{kpis.distribution.overdue}</span>
                  <span className="text-[#8E8E93] ml-1.5 font-medium">({overdueShare}%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/collections')}
            className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 text-xs font-bold text-[#007AFF] hover:underline flex items-center justify-between"
          >
            <span>Open Collections Matrix</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Circle Performance Cards */}
      <div className="ios-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chit Circle Subscription Performance
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Target completion & collection health per active scheme
            </p>
          </div>
          <button
            onClick={() => navigate('/chit-groups')}
            className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
          >
            <span>View All Groups</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {groupPerformance.map((gp) => (
            <div
              key={gp.id}
              onClick={() => navigate(`/chit-groups/${gp.id}`)}
              className="p-4 rounded-[16px] bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5 hover:border-[#007AFF]/40 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <div className="flex justify-between items-start text-xs">
                <span className="font-bold text-slate-900 dark:text-white text-sm truncate pr-2">
                  {gp.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white dark:bg-black/40 text-slate-500">
                  {gp.id}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="font-extrabold text-base text-[#007AFF]">
                  {formatCurrency(gp.collected)}
                </span>
                <span className="font-semibold text-[#34C759]">
                  {gp.percent}% Realized
                </span>
              </div>

              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-full transition-all"
                  style={{ width: `${Math.min(gp.percent, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-[11px] text-[#8E8E93] font-medium">
                <span>Value: {formatCurrency(gp.chitValue)}</span>
                <span>Outstanding: {formatCurrency(gp.pending)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 4: Recent Transactions & Upcoming Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 ios-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Transaction Receipts
              </h3>
              <p className="text-xs text-[#8E8E93]">Live verified payment receipts issued</p>
            </div>
            <button
              onClick={() => navigate('/receipts')}
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] uppercase tracking-wider font-semibold text-[10px] rounded-lg">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-lg">Subscriber / Receipt</th>
                  <th className="px-3.5 py-2.5">Chit Circle</th>
                  <th className="px-3.5 py-2.5">Channel</th>
                  <th className="px-3.5 py-2.5">Amount</th>
                  <th className="px-3.5 py-2.5 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-medium">
                {recentTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.memberId);
                  const group = groups.find((g) => g.id === tx.groupId);

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => navigate(`/receipts?receiptNumber=${tx.receiptNumber}`)}
                      className="hover:bg-[#F2F2F7]/80 dark:hover:bg-[#2C2C2E]/60 cursor-pointer transition-colors"
                    >
                      <td className="px-3.5 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {member?.fullName || 'Member'}
                        </div>
                        <div className="text-[11px] text-[#8E8E93] font-mono">
                          {tx.receiptNumber}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300">
                        {group?.name || 'Group'}
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status={tx.remainingBalance === 0 ? 'PAID' : 'PARTIALLY_PAID'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Collections Card */}
        <div className="ios-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Collections
              </h3>
              <button
                onClick={() => navigate('/collections')}
                className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
              >
                <span>Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingCollections.map((ins) => {
                const member = members.find((m) => m.id === ins.memberId);
                const group = groups.find((g) => g.id === ins.groupId);

                return (
                  <div
                    key={ins.id}
                    className="p-3.5 rounded-[14px] bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {member?.fullName}
                      </p>
                      <p className="text-[11px] text-[#8E8E93] mt-0.5 font-medium">
                        {group?.name} • Due: {formatDate(ins.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(ins.remainingAmount)}
                      </p>
                      <button
                        onClick={() =>
                          navigate(
                            `/payments?memberId=${ins.memberId}&installmentId=${ins.id}&groupId=${ins.groupId}`
                          )
                        }
                        className="text-[11px] text-[#007AFF] font-bold hover:underline inline-flex items-center mt-0.5"
                      >
                        Collect <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-[#8E8E93]">
            Instant computerized receipt generation dispatched upon collection.
          </div>
        </div>
      </div>
    </div>
  );
};
