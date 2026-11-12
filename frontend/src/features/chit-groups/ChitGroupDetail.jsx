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
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
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

  const [activeTab, setActiveTab] = useState('overview'); // overview, members, installments, transactions, payouts
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMemberToAssign, setSelectedMemberToAssign] = useState('');

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Chit Group Not Found</h2>
        <button
          onClick={() => navigate('/chit-groups')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
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
    toast.success('Member assigned to group and installments scheduled.');
    setSelectedMemberToAssign('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <button
          onClick={() => navigate('/chit-groups')}
          className="hover:underline flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Chit Groups
        </button>
      </div>

      <PageHeader
        title={group.name}
        subtitle={`ID: ${group.id} • ${group.durationMonths} Months Tenure • Started ${formatDate(group.startDate)}`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/payments?groupId=${group.id}`)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Collect from Group
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Group Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Chit Pool Value</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(group.chitValue)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">₹{group.monthlyInstallment?.toLocaleString('en-IN')}/mo</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Collected</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalCollected)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{completionRate}% realization</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Dues</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(totalRemaining)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across remaining tenure</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Enrolled Members</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {assignedMembers.length} / {group.memberCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Group capacity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'members', label: `Members (${assignedMembers.length})` },
            { id: 'installments', label: `Installments (${groupInstallments.length})` },
            { id: 'transactions', label: `Transactions (${groupTransactions.length})` },
            { id: 'payouts', label: `Auctions & Payouts (${groupPayouts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition-all ${
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

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Group Summary</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {group.description || 'Standard Tamil Nadu compliant chit circle scheme.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Collection Due Date</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.collectionDueDate}th of every month
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Grace Period</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.gracePeriodDays || 5} Days
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Scheduled End Date</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatDate(group.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Member List preview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assigned Chit Members</h3>
                <button
                  onClick={() => setActiveTab('members')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Manage all
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                      View Ledger
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Assignment Box */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Enroll Member</span>
              </h3>
              <p className="text-slate-500 mb-3">
                Select a registered member to assign to this circle.
              </p>
              <select
                value={selectedMemberToAssign}
                onChange={(e) => setSelectedMemberToAssign(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white mb-3"
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
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs"
              >
                Enroll Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Paid in this Group</th>
                <th className="px-4 py-3">Pending in Group</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                    <td className="px-4 py-3">{m.mobileNumber}</td>
                    <td className="px-4 py-3">{m.city}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(mPaid)}</td>
                    <td className="px-4 py-3 font-semibold text-amber-600">{formatCurrency(mPending)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/members/${m.id}`)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        Profile & Ledger
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Installments Tab */}
      {activeTab === 'installments' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Generated Monthly Member Schedules ({groupInstallments.length} total records)
            </span>
            <button
              onClick={() => navigate('/collections')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Open Collections Matrix →
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Installment #</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Expected</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                    <td className="px-4 py-2.5">
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
          {groupInstallments.length > 50 && (
            <div className="p-3 text-center text-xs text-slate-400">
              Showing first 50 rows. View the Collections screen for complete matrix.
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Receipt / ID</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                    <td className="px-4 py-3">{formatDate(tx.paymentDate)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {tx.paymentMethod}
                      </span>{' '}
                      • <span className="font-mono text-slate-400">{tx.referenceNumber}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Draw #</th>
                <th className="px-4 py-3">Winning Member</th>
                <th className="px-4 py-3">Gross Chit</th>
                <th className="px-4 py-3">Bid Discount</th>
                <th className="px-4 py-3">Foreman Commission</th>
                <th className="px-4 py-3">Net Disbursed</th>
                <th className="px-4 py-3">Date & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                  <td className="px-4 py-3 font-bold text-indigo-600">
                    {formatCurrency(po.netPayoutAmount)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(po.payoutDate)} • <span className="font-mono text-slate-400">{po.referenceNumber}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Chit Group"
        message="Are you sure you want to permanently delete this chit group? All associated installments and transactions will be removed."
        confirmText="Yes, Delete Group"
        isDestructive={true}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

