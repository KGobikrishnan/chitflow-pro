import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  UserPlus,
  Trash2,
  Download,
  CreditCard,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { exportToCSV } from '../../utils/export';
import { toast } from 'sonner';

export const ChitGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);
  const transactions = useAppStore((state) => state.transactions);
  const payouts = useAppStore((state) => state.payouts);
  const deleteGroup = useAppStore((state) => state.deleteGroup);
  const assignMemberToGroup = useAppStore((state) => state.assignMemberToGroup);

  const [activeTab, setActiveTab] = useState('overview'); // overview, members, installments, collections, payouts, reports
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMemberToAssign, setSelectedMemberToAssign] = useState('');

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold">Chit Group Not Found</h2>
        <button
          onClick={() => navigate('/chit-groups')}
          className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  // Filtered datasets
  const groupInstallments = installments.filter((ins) => ins.groupId === group.id);
  const groupTransactions = transactions.filter((tx) => tx.groupId === group.id);
  const groupPayouts = payouts.filter((p) => p.groupId === group.id);
  const assignedMembers = members.filter((m) => m.assignedGroupIds?.includes(group.id));
  const availableMembers = members.filter((m) => !m.assignedGroupIds?.includes(group.id));

  // Financial calculations
  const totalCollected = groupInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
  const totalRemaining = groupInstallments.reduce((sum, ins) => sum + (ins.remainingAmount || 0), 0);
  const totalExpectedEver = groupInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
  const completionRate = totalExpectedEver > 0 ? Math.round((totalCollected / totalExpectedEver) * 100) : 0;

  const handleDelete = () => {
    deleteGroup(group.id);
    toast.success('Chit Group removed successfully.');
    navigate('/chit-groups');
  };

  const handleAssign = () => {
    if (!selectedMemberToAssign) return;
    assignMemberToGroup(selectedMemberToAssign, group.id);
    toast.success('Member enrolled in circle.');
    setSelectedMemberToAssign('');
  };

  const handleExportGroupCSV = () => {
    const data = groupInstallments.map((ins) => {
      const mem = members.find((m) => m.id === ins.memberId);
      return {
        'Group Name': group.name,
        'Member Name': mem?.fullName || ins.memberId,
        'Installment Month': `Month ${ins.installmentNumber}`,
        'Due Date': ins.dueDate,
        'Expected Amount': ins.expectedAmount,
        'Paid Amount': ins.paidAmount,
        'Remaining Balance': ins.remainingAmount,
        'Status': ins.status,
      };
    });
    exportToCSV(data, `${group.name}_Full_Ledger.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/chit-groups')}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Chit Groups
        </button>
      </div>

      {/* Group Financial Workspace Header */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-slate-400 font-medium">{group.id}</span>
              <StatusBadge status={group.status} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              {group.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tenure: {group.durationMonths} Months • Started: {formatDate(group.startDate)} • Ends: {formatDate(group.endDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportGroupCSV}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Ledger</span>
            </button>
            <button
              onClick={() => navigate(`/payments?groupId=${group.id}`)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect from Group</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
              title="Delete Chit Circle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial KPI bar */}
        <div className="mt-5 pt-4 border-t border-[#e2e4e9]/70 dark:border-[#1e283d] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] font-mono uppercase">Total Chit Pool</span>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
              {formatCurrency(group.chitValue)}
            </p>
            <p className="text-[11px] text-slate-500">₹{group.monthlyInstallment?.toLocaleString('en-IN')}/mo</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-mono uppercase">Total Realized</span>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-[11px] text-slate-500">{completionRate}% collected</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-mono uppercase">Outstanding Dues</span>
            <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-[11px] text-slate-500">Scheduled receivables</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-mono uppercase">Subscribers</span>
            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {assignedMembers.length} / {group.memberCount}
            </p>
            <p className="text-[11px] text-slate-500">Circle capacity</p>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'members', label: `Members (${assignedMembers.length})` },
            { id: 'installments', label: `Installments (${groupInstallments.length})` },
            { id: 'collections', label: `Transactions (${groupTransactions.length})` },
            { id: 'payouts', label: `Auctions & Payouts (${groupPayouts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 border-b-2 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Scheme Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {group.description || 'Statutory Chit Fund Scheme under Section 4 of the Chit Funds Act, 1982.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2e4e9]/70 dark:border-[#1e283d]">
                <div>
                  <span className="text-slate-400">Monthly Due Date</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.collectionDueDate}th of each month
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Grace Period</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.gracePeriodDays || 5} Calendar Days
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Collection Frequency</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    Monthly Systematic
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Member Preview */}
            <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assigned Members</h3>
                <button
                  onClick={() => setActiveTab('members')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  View all ({assignedMembers.length})
                </button>
              </div>

              <div className="divide-y divide-[#e2e4e9]/60 dark:divide-[#1e283d]">
                {assignedMembers.slice(0, 5).map((m) => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{m.fullName}</p>
                      <p className="text-[11px] text-slate-400">{m.id} • {m.city}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/members/${m.id}`)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Enrollment Widget */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Enroll Member</span>
              </h3>
              <p className="text-slate-500 mb-3 text-xs">
                Select a registered member to allocate to this chit fund circle.
              </p>

              <select
                value={selectedMemberToAssign}
                onChange={(e) => setSelectedMemberToAssign(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white mb-3"
              >
                <option value="">-- Choose Member --</option>
                {availableMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.city} - {m.id})
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssign}
                disabled={!selectedMemberToAssign}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-md shadow-xs text-xs"
              >
                Enroll Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Mobile Number</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Paid in Group</th>
                <th className="px-4 py-3">Pending in Group</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {assignedMembers.map((m) => {
                const memberGroupInst = groupInstallments.filter((ins) => ins.memberId === m.id);
                const mPaid = memberGroupInst.reduce((s, ins) => s + (ins.paidAmount || 0), 0);
                const mPending = memberGroupInst.reduce((s, ins) => s + (ins.remainingAmount || 0), 0);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-slate-400">{m.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {m.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.mobileNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{m.city}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(mPaid)}</td>
                    <td className="px-4 py-3 font-bold text-amber-600">{formatCurrency(mPending)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/members/${m.id}`)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        Ledger Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Installments */}
      {activeTab === 'installments' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 dark:bg-[#182032] border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Schedule Registry ({groupInstallments.length} records)
            </span>
            <button
              onClick={() => navigate('/collections')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Open Collections Matrix →
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Cycle #</th>
                <th className="px-4 py-2.5">Member</th>
                <th className="px-4 py-2.5">Due Date</th>
                <th className="px-4 py-2.5">Expected</th>
                <th className="px-4 py-2.5">Paid</th>
                <th className="px-4 py-2.5">Balance</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {groupInstallments.slice(0, 50).map((ins) => {
                const mem = members.find((m) => m.id === ins.memberId);
                return (
                  <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold">Month {ins.installmentNumber}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                      {mem?.fullName || ins.memberId}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{formatDate(ins.dueDate)}</td>
                    <td className="px-4 py-2.5">{formatCurrency(ins.expectedAmount)}</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-600">
                      {formatCurrency(ins.paidAmount)}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-rose-600">
                      {formatCurrency(ins.remainingAmount)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={ins.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {ins.remainingAmount > 0 && (
                        <button
                          onClick={() =>
                            navigate(
                              `/payments?memberId=${ins.memberId}&groupId=${ins.groupId}&installmentId=${ins.id}`
                            )
                          }
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 rounded hover:bg-indigo-100"
                        >
                          Collect
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Collections / Transactions */}
      {activeTab === 'collections' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Receipt Number</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {groupTransactions.map((tx) => {
                const mem = members.find((m) => m.id === tx.memberId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono font-medium text-slate-600 dark:text-slate-300">
                      {tx.receiptNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {mem?.fullName || 'Member'}
                    </td>
                    <td className="px-4 py-3">Month {tx.installmentNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(tx.paymentDate)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{tx.paymentMethod}</span> •{' '}
                      <span className="font-mono text-slate-400">{tx.referenceNumber}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Auctions & Payouts */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Draw #</th>
                <th className="px-4 py-3">Winner Member</th>
                <th className="px-4 py-3">Gross Value</th>
                <th className="px-4 py-3">Bid Discount</th>
                <th className="px-4 py-3">Foreman Commission</th>
                <th className="px-4 py-3">Net Disbursed</th>
                <th className="px-4 py-3">Date & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {groupPayouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-bold">Month {po.installmentNumber}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {po.memberName}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(po.grossAmount)}</td>
                  <td className="px-4 py-3 text-rose-600 font-semibold">
                    -{formatCurrency(po.discountBidAmount)}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(po.companyCommissionAmount)}</td>
                  <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(po.netPayoutAmount)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(po.payoutDate)} •{' '}
                    <span className="font-mono text-slate-400">{po.referenceNumber}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Chit Circle"
        message="Permanently remove this chit circle and all associated installment schedules and transaction records?"
        confirmText="Yes, Delete Circle"
        isDestructive={true}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
