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
import { PageHeader } from '../../components/common/PageHeader';
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
        <h2 className="text-xl font-bold">Member Not Found</h2>
        <button
          onClick={() => navigate('/members')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
        >
          Back to Members
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
      <div className="flex items-center space-x-2 text-xs text-slate-500 no-print">
        <button
          onClick={() => navigate('/members')}
          className="hover:underline flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Members
        </button>
      </div>

      {/* Member Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-2xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {member.fullName}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  {member.id}
                </span>
                <StatusBadge status={member.status} />
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
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
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined: {formatDate(member.joiningDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleExportLedgerCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement CSV</span>
            </button>
            <button
              onClick={handlePrintLedger}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ledger</span>
            </button>
            <button
              onClick={() => navigate(`/payments?memberId=${member.id}`)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Payment</span>
            </button>
          </div>
        </div>

        {/* Member Nominee and KYC summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 text-[11px] uppercase font-semibold">Nominee Information</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{member.nomineeName}</p>
            <p className="text-slate-500">{member.nomineeRelationship} • {member.nomineeMobile}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 text-[11px] uppercase font-semibold">Subscribed Chits</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {member.assignedGroupIds?.map((gid) => {
                const grp = groups.find((g) => g.id === gid);
                return (
                  <span
                    key={gid}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                  >
                    {grp ? grp.name : gid}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 text-[11px] uppercase font-semibold">Notes / Remarks</span>
            <p className="text-slate-700 dark:text-slate-300 mt-1 italic">
              {member.notes || 'Clean repayment track record.'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Aggregates Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Obligation</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalExpected)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{memberInstallments.length} scheduled installments</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Paid</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{paidCount} installments settled</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Outstanding Balance</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(totalPending)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{pendingCount} remaining / pending</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Repayment Rate</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {completionRate}%
          </p>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 no-print">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { id: 'ledger', label: `Complete Ledger Schedule (${memberInstallments.length})` },
            { id: 'receipts', label: `Payment History & Receipts (${memberTransactions.length})` },
            { id: 'payouts', label: `Auction Payouts Received (${memberPayouts.length})` },
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
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Expected Amount</th>
                <th className="px-4 py-3">Paid Amount</th>
                <th className="px-4 py-3">Balance Remaining</th>
                <th className="px-4 py-3">Payment Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {memberInstallments.map((ins) => {
                const grp = groups.find((g) => g.id === ins.groupId);
                return (
                  <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {grp?.name || ins.groupId}
                    </td>
                    <td className="px-4 py-3 font-medium">Month {ins.installmentNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(ins.dueDate)}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(ins.expectedAmount)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      {formatCurrency(ins.paidAmount)}
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-600">
                      {formatCurrency(ins.remainingAmount)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {ins.paymentDate ? formatDate(ins.paymentDate) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ins.status} />
                    </td>
                    <td className="px-4 py-3 no-print">
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

      {/* Receipts Tab */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Receipt Number</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount Received</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Reference / Txn ID</th>
                <th className="px-4 py-3">Remaining Balance</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {memberTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {tx.receiptNumber}
                  </td>
                  <td className="px-4 py-3">Month {tx.installmentNumber}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(tx.paymentDate)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(tx.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 font-medium">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">{tx.referenceNumber}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(tx.remainingBalance)}
                  </td>
                  <td className="px-4 py-3">
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

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          {memberPayouts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              This member has not claimed any auction draw prizes yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Chit Group</th>
                  <th className="px-4 py-3">Month Won</th>
                  <th className="px-4 py-3">Gross Chit</th>
                  <th className="px-4 py-3">Bid Discount</th>
                  <th className="px-4 py-3">Foreman Commission</th>
                  <th className="px-4 py-3">Net Disbursed</th>
                  <th className="px-4 py-3">Disbursement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {memberPayouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {po.groupName}
                    </td>
                    <td className="px-4 py-3 font-bold">Month {po.installmentNumber}</td>
                    <td className="px-4 py-3">{formatCurrency(po.grossAmount)}</td>
                    <td className="px-4 py-3 text-rose-600 font-semibold">
                      -{formatCurrency(po.discountBidAmount)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(po.companyCommissionAmount)}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600">{formatCurrency(po.netPayoutAmount)}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(po.payoutDate)}</td>
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

