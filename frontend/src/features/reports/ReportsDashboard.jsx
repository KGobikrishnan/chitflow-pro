import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  Layers,
  Users,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { exportToCSV } from '../../utils/export';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ReportsDashboard = () => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);
  const transactions = useAppStore((state) => state.transactions);
  const payouts = useAppStore((state) => state.payouts);

  const [activeReportTab, setActiveReportTab] = useState('daily'); // daily, monthly, overdue, groupwise, mode
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  // Breakdown by payment method
  const methodBreakdown = transactions.reduce((acc, tx) => {
    const method = tx.paymentMethod || 'OTHER';
    if (!acc[method]) acc[method] = { method, count: 0, total: 0 };
    acc[method].count += 1;
    acc[method].total += Number(tx.amount) || 0;
    return acc;
  }, {});

  // Groupwise collection summary
  const groupwiseSummary = groups.map((g) => {
    const gInst = installments.filter((ins) => ins.groupId === g.id);
    const expected = gInst.reduce((s, ins) => s + (ins.expectedAmount || 0), 0);
    const collected = gInst.reduce((s, ins) => s + (ins.paidAmount || 0), 0);
    const pending = gInst.reduce((s, ins) => s + (ins.remainingAmount || 0), 0);
    const efficiency = expected > 0 ? Math.round((collected / expected) * 100) : 0;
    return {
      id: g.id,
      name: g.name,
      chitValue: g.chitValue,
      expected,
      collected,
      pending,
      efficiency,
    };
  });

  // Overdue records
  const overdueRecords = installments
    .filter((ins) => ins.status === 'OVERDUE')
    .map((ins) => {
      const mem = members.find((m) => m.id === ins.memberId);
      const grp = groups.find((g) => g.id === ins.groupId);
      return {
        ...ins,
        memberName: mem?.fullName || ins.memberId,
        mobileNumber: mem?.mobileNumber || '',
        groupName: grp?.name || ins.groupId,
      };
    });

  const handleExportOverdue = () => {
    const data = overdueRecords.map((r) => ({
      'Member Name': r.memberName,
      'Mobile': r.mobileNumber,
      'Chit Group': r.groupName,
      'Installment Month': `Month ${r.installmentNumber}`,
      'Due Date': r.dueDate,
      'Unpaid Balance (INR)': r.remainingAmount,
    }));
    exportToCSV(data, `ChitFlow_Overdue_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportGroupwise = () => {
    const data = groupwiseSummary.map((g) => ({
      'Group ID': g.id,
      'Group Name': g.name,
      'Chit Pool Value': g.chitValue,
      'Cumulative Expected': g.expected,
      'Collected to Date': g.collected,
      'Pending Amount': g.pending,
      'Collection Efficiency (%)': g.efficiency,
    }));
    exportToCSV(data, `ChitFlow_Groupwise_Financial_Report.csv`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Audited financial summaries, overdue collections, group-wise ledger and payment channel breakdown"
        breadcrumbs={['ChitFlow', 'Reports']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit Sheet</span>
            </button>
          </div>
        }
      />

      {/* Report Tab Selector */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { id: 'groupwise', label: 'Group-wise Financial Report' },
            { id: 'overdue', label: `Overdue Dues Ledger (${overdueRecords.length})` },
            { id: 'mode', label: 'Payment Channel Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`pb-3 border-b-2 transition-all ${
                activeReportTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Groupwise Report Panel */}
      {activeReportTab === 'groupwise' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Chit Circle Target vs Realized Collection Comparison
              </h3>
              <button
                onClick={handleExportGroupwise}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Summary CSV</span>
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupwiseSummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis
                    tickFormatter={(v) => `₹${v / 1000}k`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="collected" name="Realized Collection" fill="#4338ca" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending Balance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Group ID & Name</th>
                  <th className="px-4 py-3">Face Value</th>
                  <th className="px-4 py-3">Target Obligation</th>
                  <th className="px-4 py-3">Total Collected</th>
                  <th className="px-4 py-3">Pending Dues</th>
                  <th className="px-4 py-3">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {groupwiseSummary.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{g.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{g.id}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(g.chitValue)}</td>
                    <td className="px-4 py-3">{formatCurrency(g.expected)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(g.collected)}</td>
                    <td className="px-4 py-3 font-bold text-amber-600">{formatCurrency(g.pending)}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.efficiency}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overdue Report Panel */}
      {activeReportTab === 'overdue' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delayed & Default Installments Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Installment records exceeding due date + grace period
              </p>
            </div>
            <button
              onClick={handleExportOverdue}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Overdue CSV</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Member Details</th>
                  <th className="px-4 py-3">Chit Group</th>
                  <th className="px-4 py-3">Installment Cycle</th>
                  <th className="px-4 py-3">Scheduled Due Date</th>
                  <th className="px-4 py-3">Expected Amount</th>
                  <th className="px-4 py-3">Paid Amount</th>
                  <th className="px-4 py-3">Unpaid Balance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {overdueRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{r.memberName}</div>
                      <div className="text-[11px] text-slate-400">{r.mobileNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{r.groupName}</td>
                    <td className="px-4 py-3 font-semibold">Month #{r.installmentNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(r.dueDate)}</td>
                    <td className="px-4 py-3">{formatCurrency(r.expectedAmount)}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600">{formatCurrency(r.paidAmount)}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">{formatCurrency(r.remainingAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status="OVERDUE" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Channel Audit */}
      {activeReportTab === 'mode' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(methodBreakdown).map((m) => (
            <div
              key={m.method}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs"
            >
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{m.method} Collections</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(m.total)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{m.count} successful transactions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

