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
  ChevronRight,
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

  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMemberToAssign, setSelectedMemberToAssign] = useState('');

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold">Chit Group Not Found</h2>
        <button
          onClick={() => navigate('/chit-groups')}
          className="mt-3 ios-pill-btn px-4 py-2 text-xs text-white bg-[#007AFF]"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  const groupInstallments = installments.filter((ins) => ins.groupId === group.id);
  const groupTransactions = transactions.filter((tx) => tx.groupId === group.id);
  const groupPayouts = payouts.filter((p) => p.groupId === group.id);
  const assignedMembers = members.filter((m) => m.assignedGroupIds?.includes(group.id));
  const availableMembers = members.filter((m) => !m.assignedGroupIds?.includes(group.id));

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
    toast.success('Subscriber enrolled into circle.');
    setSelectedMemberToAssign('');
  };

  const handleExportGroupCSV = () => {
    const data = groupInstallments.map((ins) => {
      const mem = members.find((m) => m.id === ins.memberId);
      return {
        'Group Name': group.name,
        'Subscriber Name': mem?.fullName || ins.memberId,
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
          className="text-xs font-bold text-[#007AFF] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Chit Groups
        </button>
      </div>

      {/* Apple Group Header Card */}
      <div className="ios-card p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#8E8E93]">{group.id}</span>
              <StatusBadge status={group.status} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF] mt-1">
              {group.name}
            </h1>
            <p className="text-xs text-[#8E8E93] mt-0.5 font-medium">
              Tenure: {group.durationMonths} Months • Started: {formatDate(group.startDate)} • Scheduled End: {formatDate(group.endDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportGroupCSV}
              className="ios-pill-btn px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-[#E5E5EA] dark:bg-[#2C2C2E] hover:bg-[#D1D1D6] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#8E8E93]" />
              <span>Export Ledger</span>
            </button>
            <button
              onClick={() => navigate(`/payments?groupId=${group.id}`)}
              className="ios-pill-btn px-4 py-1.5 text-xs text-white bg-[#007AFF] hover:bg-[#0062CC] shadow-[0_3px_10px_rgba(0,122,255,0.35)] flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect from Group</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
              title="Delete Chit Circle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial KPI bar */}
        <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Chit Pool Value</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(group.chitValue)}
            </p>
            <p className="text-[11px] text-[#8E8E93]">₹{group.monthlyInstallment?.toLocaleString('en-IN')}/month</p>
          </div>
          <div>
            <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Realized Collection</span>
            <p className="text-lg font-extrabold text-[#34C759] mt-0.5">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-[11px] text-[#8E8E93]">{completionRate}% realization</p>
          </div>
          <div>
            <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Outstanding Balance</span>
            <p className="text-lg font-extrabold text-[#FF9500] mt-0.5">
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-[11px] text-[#8E8E93]">Scheduled receivables</p>
          </div>
          <div>
            <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Subscribers</span>
            <p className="text-lg font-extrabold text-[#007AFF] mt-0.5">
              {assignedMembers.length} / {group.memberCount}
            </p>
            <p className="text-[11px] text-[#8E8E93]">Enrolled capacity</p>
          </div>
        </div>
      </div>

      {/* Apple Segmented Tabs */}
      <div className="ios-segmented">
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
            className={`ios-segmented-btn ${activeTab === tab.id ? 'active' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-2 space-y-6">
            <div className="ios-card p-6">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Circle Overview</h3>
              <p className="text-[#8E8E93] leading-relaxed mb-4">
                {group.description || 'Statutory Chit Fund Scheme under Section 4 of the Chit Funds Act, 1982.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-black/5 dark:border-white/10">
                <div>
                  <span className="text-[#8E8E93] font-medium">Monthly Due Date</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.collectionDueDate}th of every month
                  </p>
                </div>
                <div>
                  <span className="text-[#8E8E93] font-medium">Grace Period</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {group.gracePeriodDays || 5} Calendar Days
                  </p>
                </div>
                <div>
                  <span className="text-[#8E8E93] font-medium">Collection Frequency</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    Monthly Systematic
                  </p>
                </div>
              </div>
            </div>

            <div className="ios-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enrolled Subscribers</h3>
                <button
                  onClick={() => setActiveTab('members')}
                  className="text-[#007AFF] font-bold hover:underline"
                >
                  View all ({assignedMembers.length})
                </button>
              </div>

              <div className="divide-y divide-black/5 dark:divide-white/10 font-medium">
                {assignedMembers.slice(0, 5).map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{m.fullName}</p>
                      <p className="text-[11px] text-[#8E8E93]">{m.id} • {m.city}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/members/${m.id}`)}
                      className="text-xs text-[#007AFF] hover:underline font-semibold"
                    >
                      Ledger Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="ios-card p-6">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#007AFF]" />
                <span>Enroll Subscriber</span>
              </h3>
              <p className="text-[#8E8E93] mb-4 text-xs">
                Select a registered member to allocate into this chit circle.
              </p>

              <select
                value={selectedMemberToAssign}
                onChange={(e) => setSelectedMemberToAssign(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-none rounded-[12px] text-slate-900 dark:text-white mb-3 text-xs"
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
                className="w-full ios-pill-btn py-2 bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-40 text-white font-semibold text-xs shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
              >
                Enroll Subscriber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members */}
      {activeTab === 'members' && (
        <div className="ios-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] uppercase tracking-wider font-semibold text-[10px]">
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
            <tbody className="divide-y divide-black/5 dark:divide-white/10 font-medium">
              {assignedMembers.map((m) => {
                const memberGroupInst = groupInstallments.filter((ins) => ins.memberId === m.id);
                const mPaid = memberGroupInst.reduce((s, ins) => s + (ins.paidAmount || 0), 0);
                const mPending = memberGroupInst.reduce((s, ins) => s + (ins.remainingAmount || 0), 0);

                return (
                  <tr key={m.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#8E8E93]">{m.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {m.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono">{m.mobileNumber}</td>
                    <td className="px-4 py-3 text-[#8E8E93]">{m.city}</td>
                    <td className="px-4 py-3 font-bold text-[#34C759]">{formatCurrency(mPaid)}</td>
                    <td className="px-4 py-3 font-bold text-[#FF9500]">{formatCurrency(mPending)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/members/${m.id}`)}
                        className="text-xs text-[#007AFF] font-bold hover:underline"
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
        <div className="ios-card overflow-hidden">
          <div className="p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] border-b border-black/5 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Schedule Registry ({groupInstallments.length} total cycles)
            </span>
            <button
              onClick={() => navigate('/collections')}
              className="text-[#007AFF] font-bold hover:underline"
            >
              Open Collections Matrix →
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F2F7]/50 text-[#8E8E93] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Cycle #</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Expected</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 font-medium">
              {groupInstallments.slice(0, 50).map((ins) => {
                const mem = members.find((m) => m.id === ins.memberId);
                return (
                  <tr key={ins.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold">Month {ins.installmentNumber}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {mem?.fullName || ins.memberId}
                    </td>
                    <td className="px-4 py-3 text-[#8E8E93] font-mono">{formatDate(ins.dueDate)}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(ins.expectedAmount)}</td>
                    <td className="px-4 py-3 font-bold text-[#34C759] font-mono">
                      {formatCurrency(ins.paidAmount)}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#FF3B30] font-mono">
                      {formatCurrency(ins.remainingAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ins.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ins.remainingAmount > 0 && (
                        <button
                          onClick={() =>
                            navigate(
                              `/payments?memberId=${ins.memberId}&groupId=${ins.groupId}&installmentId=${ins.id}`
                            )
                          }
                          className="ios-pill-btn px-3 py-1 text-xs text-white bg-[#007AFF] shadow-xs"
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

      {/* Tab 4: Transactions */}
      {activeTab === 'collections' && (
        <div className="ios-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Receipt Number</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Channel & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 font-medium">
              {groupTransactions.map((tx) => {
                const mem = members.find((m) => m.id === tx.memberId);
                return (
                  <tr key={tx.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#007AFF] font-mono">
                      {tx.receiptNumber}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {mem?.fullName || 'Member'}
                    </td>
                    <td className="px-4 py-3">Month #{tx.installmentNumber}</td>
                    <td className="px-4 py-3 text-[#8E8E93] font-mono">{formatDate(tx.paymentDate)}</td>
                    <td className="px-4 py-3 font-bold text-[#34C759] font-mono">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold">{tx.paymentMethod}</span> •{' '}
                      <span className="font-mono text-[#8E8E93]">{tx.referenceNumber}</span>
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
        <div className="ios-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Draw #</th>
                <th className="px-4 py-3">Winner Subscriber</th>
                <th className="px-4 py-3">Gross Pool</th>
                <th className="px-4 py-3">Bid Discount</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Net Disbursed</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 font-medium">
              {groupPayouts.map((po) => (
                <tr key={po.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-bold">Month #{po.installmentNumber}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {po.memberName}
                  </td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(po.grossAmount)}</td>
                  <td className="px-4 py-3 text-[#FF3B30] font-bold font-mono">
                    -{formatCurrency(po.discountBidAmount)}
                  </td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(po.companyCommissionAmount)}</td>
                  <td className="px-4 py-3 font-bold text-[#007AFF] font-mono">
                    {formatCurrency(po.netPayoutAmount)}
                  </td>
                  <td className="px-4 py-3 text-[#8E8E93] font-mono">{formatDate(po.payoutDate)}</td>
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
