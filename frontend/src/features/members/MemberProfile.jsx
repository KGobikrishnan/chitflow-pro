import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
  Receipt as ReceiptIcon,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV } from '../../utils/export';

export const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const members = useAppStore((state) => state.members);
  const groups = useAppStore((state) => state.groups);
  const installments = useAppStore((state) => state.installments);
  const transactions = useAppStore((state) => state.transactions);
  const payouts = useAppStore((state) => state.payouts);

  const [activeTab, setActiveTab] = useState('ledger'); // ledger, receipts, payouts

  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-bold">Subscriber Not Found</h2>
        <button
          onClick={() => navigate('/members')}
          className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  // Member-specific data
  const memberInstallments = installments
    .filter((ins) => ins.memberId === member.id)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const memberTransactions = transactions.filter((tx) => tx.memberId === member.id);
  const memberPayouts = payouts.filter((po) => po.memberId === member.id);

  // Financial aggregates
  const totalExpected = memberInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
  const totalPaid = memberInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
  const totalPending = memberInstallments.reduce((sum, ins) => sum + (ins.remainingAmount || 0), 0);
  const paidCount = memberInstallments.filter((ins) => ins.status === 'PAID').length;
  const pendingCount = memberInstallments.filter((ins) => ins.remainingAmount > 0).length;
  const completionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  const handlePrintLedger = () => {
    window.print();
  };

  const handleExportLedgerCSV = () => {
    const data = memberInstallments.map((ins) => {
      const grp = groups.find((g) => g.id === ins.groupId);
      return {
        'Chit Group': grp ? grp.name : ins.groupId,
        'Installment Month': `Month ${ins.installmentNumber}`,
        'Due Date': ins.dueDate,
        'Expected (INR)': ins.expectedAmount,
        'Paid (INR)': ins.paidAmount,
        'Remaining Balance (INR)': ins.remainingAmount,
        'Payment Date': ins.paymentDate || 'Unpaid',
        'Status': ins.status,
      };
    });
    exportToCSV(data, `${member.fullName}_Ledger_Statement.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <button
          onClick={() => navigate('/members')}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </button>
      </div>

      {/* Member Financial Card */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {member.fullName}
                </h1>
                <span className="font-mono text-xs text-slate-400 font-medium">
                  {member.id}
                </span>
                <StatusBadge status={member.status} />
              </div>

              <div className="mt-1 flex flex-wrap gap-3.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.mobileNumber}
                </span>
                {member.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {member.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {member.address}, {member.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleExportLedgerCSV}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Statement</span>
            </button>
            <button
              onClick={handlePrintLedger}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>
            <button
              onClick={() => navigate(`/payments?memberId=${member.id}`)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Payment</span>
            </button>
          </div>
        </div>

        {/* Member Nominee and KYC summary */}
        <div className="mt-4 pt-3.5 border-t border-[#e2e4e9]/70 dark:border-[#1e283d] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-[#182032] rounded border border-[#e2e4e9]/60 dark:border-[#1e283d]">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Nominee Details</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{member.nomineeName}</p>
            <p className="text-slate-500 font-mono text-[11px]">{member.nomineeRelationship} • {member.nomineeMobile}</p>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-[#182032] rounded border border-[#e2e4e9]/60 dark:border-[#1e283d]">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Subscribed Circles</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {member.assignedGroupIds?.map((gid) => {
                const grp = groups.find((g) => g.id === gid);
                return (
                  <span
                    key={gid}
                    className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                  >
                    {grp ? grp.name : gid}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-[#182032] rounded border border-[#e2e4e9]/60 dark:border-[#1e283d]">
            <span className="text-slate-400 text-[10px] uppercase font-mono">KYC Audit Remarks</span>
            <p className="text-slate-700 dark:text-slate-300 mt-0.5 italic text-[11px]">
              {member.notes || 'Verified repayment standing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Aggregates Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Cumulative Target</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
            {formatCurrency(totalExpected)}
          </p>
          <p className="text-[11px] text-slate-500">{memberInstallments.length} scheduled cycles</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Settled</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-[11px] text-slate-500">{paidCount} installments paid</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Current Outstanding</span>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
            {formatCurrency(totalPending)}
          </p>
          <p className="text-[11px] text-slate-500">{pendingCount} remaining cycles</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Repayment Rate</span>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {completionRate}%
          </p>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Ledger Workspace Tabs */}
      <div className="border-b border-[#e2e4e9] dark:border-[#1e283d] no-print">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { id: 'ledger', label: `Scheduled Ledger (${memberInstallments.length})` },
            { id: 'receipts', label: `Transactions & Receipts (${memberTransactions.length})` },
            { id: 'payouts', label: `Auction Draws Won (${memberPayouts.length})` },
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

      {/* Tab 1: Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Chit Group</th>
                <th className="px-4 py-2.5">Installment</th>
                <th className="px-4 py-2.5">Due Date</th>
                <th className="px-4 py-2.5">Expected Due</th>
                <th className="px-4 py-2.5">Paid Inflow</th>
                <th className="px-4 py-2.5">Outstanding Balance</th>
                <th className="px-4 py-2.5">Payment Date</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {memberInstallments.map((ins) => {
                const grp = groups.find((g) => g.id === ins.groupId);
                return (
                  <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                      {grp?.name || ins.groupId}
                    </td>
                    <td className="px-4 py-2.5 font-medium">Month #{ins.installmentNumber}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(ins.dueDate)}</td>
                    <td className="px-4 py-2.5 font-medium font-mono">{formatCurrency(ins.expectedAmount)}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">
                      {formatCurrency(ins.paidAmount)}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-rose-600 font-mono">
                      {formatCurrency(ins.remainingAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">
                      {ins.paymentDate ? formatDate(ins.paymentDate) : '-'}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={ins.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right no-print">
                      {ins.remainingAmount > 0 && (
                        <button
                          onClick={() =>
                            navigate(
                              `/payments?memberId=${member.id}&groupId=${ins.groupId}&installmentId=${ins.id}`
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

      {/* Tab 2: Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Receipt Number</th>
                <th className="px-4 py-2.5">Installment</th>
                <th className="px-4 py-2.5">Payment Date</th>
                <th className="px-4 py-2.5">Amount Received</th>
                <th className="px-4 py-2.5">Payment Method</th>
                <th className="px-4 py-2.5">Transaction Ref</th>
                <th className="px-4 py-2.5">Balance Remaining</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {memberTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {tx.receiptNumber}
                  </td>
                  <td className="px-4 py-2.5">Month #{tx.installmentNumber}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(tx.paymentDate)}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-slate-600 dark:text-slate-300">{tx.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">{tx.referenceNumber}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {formatCurrency(tx.remainingBalance)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => navigate(`/receipts?receiptNumber=${tx.receiptNumber}`)}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Payouts */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
          {memberPayouts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              This subscriber has not claimed any auction draw prizes yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Chit Group</th>
                  <th className="px-4 py-2.5">Month Won</th>
                  <th className="px-4 py-2.5">Gross Pool</th>
                  <th className="px-4 py-2.5">Winning Bid Discount</th>
                  <th className="px-4 py-2.5">Company Commission</th>
                  <th className="px-4 py-2.5">Net Disbursed</th>
                  <th className="px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
                {memberPayouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                      {po.groupName}
                    </td>
                    <td className="px-4 py-2.5 font-bold">Month #{po.installmentNumber}</td>
                    <td className="px-4 py-2.5 font-mono">{formatCurrency(po.grossAmount)}</td>
                    <td className="px-4 py-2.5 text-rose-600 font-semibold font-mono">
                      -{formatCurrency(po.discountBidAmount)}
                    </td>
                    <td className="px-4 py-2.5 font-mono">{formatCurrency(po.companyCommissionAmount)}</td>
                    <td className="px-4 py-2.5 font-bold text-indigo-600 font-mono">
                      {formatCurrency(po.netPayoutAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(po.payoutDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
