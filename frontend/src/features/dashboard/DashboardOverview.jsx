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
  Filter,
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

  const [timeframe, setTimeframe] = useState('ALL');

  // Dynamic state-derived metrics
  const kpis = analyticsService.calculateKPIs({ groups, members, installments, payouts });
  const trendData = analyticsService.getMonthlyCollectionTrend(transactions);

  // Group-wise performance summary
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

  // Recent 6 transactions
  const recentTransactions = [...transactions].slice(0, 6);

  // Next upcoming or pending installments
  const upcomingCollections = installments
    .filter((ins) => ins.status === 'PENDING' || ins.status === 'UPCOMING')
    .slice(0, 5);

  const handleExportDashboard = () => {
    const data = transactions.map((tx) => ({
      'Transaction ID': tx.id,
      'Receipt Number': tx.receiptNumber,
      'Payment Date': tx.paymentDate,
      'Member ID': tx.memberId,
      'Amount (INR)': tx.amount,
      'Method': tx.paymentMethod,
      'Reference': tx.referenceNumber,
    }));
    exportToCSV(data, `ChitFlow_Dashboard_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Distribution figures
  const totalInstallmentCount =
    kpis.distribution.paid +
    kpis.distribution.partiallyPaid +
    kpis.distribution.pending +
    kpis.distribution.overdue;

  const paidShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.paid / totalInstallmentCount) * 100) : 0;
  const partialShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.partiallyPaid / totalInstallmentCount) * 100) : 0;
  const pendingShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.pending / totalInstallmentCount) * 100) : 0;
  const overdueShare = totalInstallmentCount > 0 ? Math.round((kpis.distribution.overdue / totalInstallmentCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Financial Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Financial Overview
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              LIVE STATE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor verified chit subscriptions, monthly collection curves, and liquidity disbursements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportDashboard}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Feed</span>
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Collect Installment</span>
          </button>
        </div>
      </div>

      {/* Tier 1: Primary Executive Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Collected Inflow</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(kpis.totalCollected)}
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mr-1.5">
              <TrendingUp className="w-3 h-3" /> {kpis.collectionEfficiency}%
            </span>
            <span>cumulative collection efficiency</span>
          </div>
        </div>

        {/* Expected Monthly Collection */}
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Monthly Expected Run-Rate</span>
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">
              MONTHLY
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(kpis.expectedMonthlyCollection)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Scheduled across </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{kpis.activeChits} active chit circles</span>
          </div>
        </div>

        {/* Outstanding / Pending Amount */}
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Outstanding Due Balance</span>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
              PENDING
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(kpis.totalPending)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Remaining balance over group tenures</span>
          </div>
        </div>

        {/* Overdue / Defaults */}
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Delayed & Overdue Dues</span>
            <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded">
              ACTION
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {formatCurrency(kpis.overdueAmount)}
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-rose-600 dark:text-rose-400 mr-1.5">
              {kpis.overdueCount} installments
            </span>
            <span>past grace period</span>
          </div>
        </div>
      </div>

      {/* Tier 2: Secondary Operational Status Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-[#111625] p-3.5 rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] text-xs">
        <div className="flex items-center space-x-2.5 px-3 border-r border-[#e2e4e9] dark:border-[#1e283d]">
          <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Active Circles</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{kpis.activeChits} / {groups.length} groups</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 border-r border-[#e2e4e9] dark:border-[#1e283d]">
          <Users className="w-4 h-4 text-sky-500 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Enrolled Members</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{kpis.totalMembers} subscribers</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 border-r border-[#e2e4e9] dark:border-[#1e283d]">
          <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Disbursed Payouts</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(kpis.totalPayouts)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Completed Draws</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{payouts.length} auctions held</span>
          </div>
        </div>
      </div>

      {/* Main Analytics: Interactive Area Curve & Health Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Collection Realization Curve
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly actual subscription collection volume vs cycle targets
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-slate-600 dark:text-slate-400 mr-3">Collected (INR)</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e4e9" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#868c98' }} tickLine={false} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 11, fill: '#868c98' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Realized']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#4338ca"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#curveFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sophisticated Segmented Distribution Health */}
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Installment Status Distribution
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {totalInstallmentCount} records
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Live portfolio breakdown of all scheduled member payments
            </p>

            {/* Segmented bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 mb-5">
              <div style={{ width: `${paidShare}%` }} className="bg-emerald-500 h-full" title={`Paid: ${paidShare}%`} />
              <div style={{ width: `${partialShare}%` }} className="bg-amber-500 h-full" title={`Partial: ${partialShare}%`} />
              <div style={{ width: `${pendingShare}%` }} className="bg-sky-500 h-full" title={`Pending: ${pendingShare}%`} />
              <div style={{ width: `${overdueShare}%` }} className="bg-rose-500 h-full" title={`Overdue: ${overdueShare}%`} />
            </div>

            {/* Detailed metric list */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Paid in Full</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.paid}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({paidShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Partially Paid</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.partiallyPaid}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({partialShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Pending Dues</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{kpis.distribution.pending}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({pendingShare}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Overdue Over 5d</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-600 dark:text-rose-400">{kpis.distribution.overdue}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({overdueShare}%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/collections')}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
          >
            <span>Open Collections Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tier 3: Group Performance Bars */}
      <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Group Collection Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target realization and active subscription performance per circle
            </p>
          </div>
          <button
            onClick={() => navigate('/chit-groups')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All Groups</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {groupPerformance.map((gp) => (
            <div
              key={gp.id}
              onClick={() => navigate(`/chit-groups/${gp.id}`)}
              className="p-3.5 rounded-md bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start text-xs">
                <span className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                  {gp.name}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{gp.id}</span>
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {formatCurrency(gp.collected)}
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {gp.percent}% Realized
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${Math.min(gp.percent, 100)}%` }}
                />
              </div>

              <div className="mt-2.5 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Value: {formatCurrency(gp.chitValue)}</span>
                <span>Due: {formatCurrency(gp.pending)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 4: Recent Transactions Table & Upcoming Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Transaction Receipts
              </h3>
              <p className="text-xs text-slate-500">Live feed of verified member installment receipts</p>
            </div>
            <button
              onClick={() => navigate('/receipts')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Member / Receipt</th>
                  <th className="px-3 py-2.5">Chit Group</th>
                  <th className="px-3 py-2.5">Method</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
                {recentTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.memberId);
                  const group = groups.find((g) => g.id === tx.groupId);

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => navigate(`/receipts?receiptNumber=${tx.receiptNumber}`)}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#182032] cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {member?.fullName || 'Member'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {tx.receiptNumber}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                        {group?.name || 'Group'}
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-3 py-3">
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
        <div className="bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Collections
              </h3>
              <button
                onClick={() => navigate('/collections')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingCollections.map((ins) => {
                const member = members.find((m) => m.id === ins.memberId);
                const group = groups.find((g) => g.id === ins.groupId);

                return (
                  <div
                    key={ins.id}
                    className="p-3 rounded-md bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {member?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
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
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center mt-0.5"
                      >
                        Collect <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e2e4e9] dark:border-[#1e283d] text-[11px] text-slate-400">
            Realized collections automatically dispatch PDF receipts and update subscriber ledgers.
          </div>
        </div>
      </div>
    </div>
  );
};
