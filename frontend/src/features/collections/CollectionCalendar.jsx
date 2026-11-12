import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV } from '../../utils/export';

export const CollectionCalendar = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInstallments = installments.filter((ins) => {
    if (selectedMonth && ins.month !== selectedMonth) return false;
    if (selectedGroup !== 'ALL' && ins.groupId !== selectedGroup) return false;
    if (statusFilter !== 'ALL' && ins.status !== statusFilter) return false;
    return true;
  });

  const expectedTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
  const collectedTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
  const pendingTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.remainingAmount || 0), 0);
  const efficiency = expectedTotal > 0 ? Math.round((collectedTotal / expectedTotal) * 100) : 0;

  const handleExport = () => {
    const data = filteredInstallments.map((ins) => {
      const mem = members.find((m) => m.id === ins.memberId);
      const grp = groups.find((g) => g.id === ins.groupId);
      return {
        'Chit Group': grp ? grp.name : ins.groupId,
        'Member Name': mem ? mem.fullName : ins.memberId,
        'Mobile': mem ? mem.mobileNumber : '',
        'Month': ins.month,
        'Due Date': ins.dueDate,
        'Expected Amount': ins.expectedAmount,
        'Paid Amount': ins.paidAmount,
        'Remaining Balance': ins.remainingAmount,
        'Status': ins.status,
      };
    });
    exportToCSV(data, `ChitFlow_Collections_${selectedMonth}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Collections Matrix
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {filteredInstallments.length} DUE CYCLES
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time monthly installment schedule ledger with collection reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Month CSV</span>
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
          >
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month selector */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-800 dark:text-white font-medium"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-11">November 2026 (Current)</option>
              <option value="2026-12">December 2026</option>
              <option value="2027-01">January 2027</option>
            </select>
          </div>

          {/* Group selector */}
          <div className="flex items-center space-x-1.5">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-800 dark:text-white font-medium"
            >
              <option value="ALL">All Chit Circles</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-800 dark:text-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>

        {/* Progress summary */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-mono">Realization:</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">{efficiency}%</span>
          <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${efficiency}%` }} />
          </div>
        </div>
      </div>

      {/* Monthly Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Target Inflow</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
            {formatCurrency(expectedTotal)}
          </p>
          <p className="text-[11px] text-slate-500">{filteredInstallments.length} subscriber cycles</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Realized Collection</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            {formatCurrency(collectedTotal)}
          </p>
          <p className="text-[11px] text-slate-500">{efficiency}% settled</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Outstanding Inflow</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5 font-mono">
            {formatCurrency(pendingTotal)}
          </p>
          <p className="text-[11px] text-slate-500">Unpaid balances</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Cycle Health</span>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {efficiency >= 80 ? 'Optimal' : efficiency >= 50 ? 'Moderate' : 'Needs Action'}
          </p>
          <p className="text-[11px] text-slate-500">Based on due dates</p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Subscriber</th>
                <th className="px-4 py-2.5">Chit Group</th>
                <th className="px-4 py-2.5">Cycle #</th>
                <th className="px-4 py-2.5">Due Date</th>
                <th className="px-4 py-2.5">Expected</th>
                <th className="px-4 py-2.5">Paid</th>
                <th className="px-4 py-2.5">Outstanding</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {filteredInstallments.length > 0 ? (
                filteredInstallments.map((ins) => {
                  const mem = members.find((m) => m.id === ins.memberId);
                  const grp = groups.find((g) => g.id === ins.groupId);

                  return (
                    <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {mem?.fullName || ins.memberId}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {mem?.mobileNumber}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">
                        {grp?.name || ins.groupId}
                      </td>
                      <td className="px-4 py-2.5 font-medium">Month #{ins.installmentNumber}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(ins.dueDate)}</td>
                      <td className="px-4 py-2.5 font-medium font-mono text-slate-900 dark:text-white">
                        {formatCurrency(ins.expectedAmount)}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">
                        {formatCurrency(ins.paidAmount)}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-rose-600 font-mono">
                        {formatCurrency(ins.remainingAmount)}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={ins.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {ins.remainingAmount > 0 ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/payments?memberId=${ins.memberId}&groupId=${ins.groupId}&installmentId=${ins.id}`
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs inline-flex items-center gap-1"
                          >
                            <span>Collect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-medium text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No installments match the selected parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
