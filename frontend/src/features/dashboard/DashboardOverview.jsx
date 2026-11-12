import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Percent,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PageHeader } from '../../components/common/PageHeader';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);
  const transactions = useAppStore((state) => state.transactions);
  const payouts = useAppStore((state) => state.payouts);

  // Derive dynamic metrics
  const kpis = analyticsService.calculateKPIs({ groups, members, installments, payouts });
  const trendData = analyticsService.getMonthlyCollectionTrend(transactions);

  // Distribution chart data
  const pieData = [
    { name: 'Paid', value: kpis.distribution.paid, color: '#10B981' },
    { name: 'Partially Paid', value: kpis.distribution.partiallyPaid, color: '#F59E0B' },
    { name: 'Pending', value: kpis.distribution.pending, color: '#3B82F6' },
    { name: 'Overdue', value: kpis.distribution.overdue, color: '#EF4444' },
  ];

  // Recent 6 transactions
  const recentTransactions = [...transactions].slice(0, 6);

  // Next upcoming installments
  const upcomingInstallments = installments
    .filter((ins) => ins.status === 'PENDING' || ins.status === 'UPCOMING')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Overview"
        subtitle="Real-time status of active chit circles, collections, member ledger and payouts"
        breadcrumbs={['ChitFlow', 'Dashboard', 'Overview']}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/payments')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Installment</span>
            </button>
            <button
              onClick={() => navigate('/chit-groups')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              Manage Groups
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Chits"
          value={kpis.activeChits}
          subtitle={`Across ${groups.length} registered groups`}
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Registered Members"
          value={kpis.totalMembers}
          subtitle="Active contributors"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Monthly Expected"
          value={formatCurrency(kpis.expectedMonthlyCollection)}
          subtitle="Current cycle target"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(kpis.totalCollected)}
          subtitle="Cumulative verified inflow"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Collections"
          value={formatCurrency(kpis.totalPending)}
          subtitle="Remaining installments"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Overdue Balance"
          value={formatCurrency(kpis.overdueAmount)}
          subtitle={`${kpis.overdueCount} delayed payments`}
          icon={AlertOctagon}
          color="rose"
        />
        <StatCard
          title="Total Payouts"
          value={formatCurrency(kpis.totalPayouts)}
          subtitle={`${payouts.length} auction distributions`}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Collection Efficiency"
          value={`${kpis.collectionEfficiency}%`}
          subtitle="On-time collection health"
          icon={Percent}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collection Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Inflow Collection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Month-on-month realized subscription collections (INR)
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Collected Amount']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#4338ca"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Installment Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Current status of scheduled member payments
          </p>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} installments`, name]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Collections Table & Action Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-500">Live feed of verified member payments</p>
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
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Member / Receipt</th>
                  <th className="px-3 py-2.5">Group</th>
                  <th className="px-3 py-2.5">Method</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.memberId);
                  const group = groups.find((g) => g.id === tx.groupId);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
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
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Dues
              </h3>
              <button
                onClick={() => navigate('/collections')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingInstallments.map((ins) => {
                const member = members.find((m) => m.id === ins.memberId);
                const group = groups.find((g) => g.id === ins.groupId);

                return (
                  <div
                    key={ins.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {member?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {group?.name} • Due: {formatDate(ins.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatCurrency(ins.remainingAmount)}
                      </p>
                      <button
                        onClick={() => navigate(`/payments?memberId=${ins.memberId}&installmentId=${ins.id}&groupId=${ins.groupId}`)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center"
                      >
                        Collect <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            Automated reminders dispatched for overdue accounts.
          </div>
        </div>
      </div>
    </div>
  );
};

