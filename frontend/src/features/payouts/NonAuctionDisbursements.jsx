import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ArrowUpRight,
  Plus,
  Download,
  Calendar,
  Layers,
  User,
  CreditCard,
  CheckCircle2,
  X,
  FileText,
  Building2,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { exportToCSV } from '../../utils/export';

export const NonAuctionDisbursements = () => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const nonAuctionPayments = useAppStore((state) => state.nonAuctionPayments || []);
  const addNonAuctionPayment = useAppStore((state) => state.addNonAuctionPayment);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  // Filter groups: Non-Auction payment circles only
  const nonAuctionGroups = groups.filter((g) => {
    if (g.distributionCategory) {
      return g.distributionCategory === 'NON_AUCTION';
    }
    // Fallback for legacy seeds
    return g.planType !== 'MONTHLY_DIFFERENT' && g.id !== 'GRP-2026-002';
  });

  const filteredPayments = nonAuctionPayments.filter((p) => {
    if (selectedGroupFilter !== 'ALL' && p.groupId !== selectedGroupFilter) return false;
    return true;
  });

  const totalGrossDisbursed = filteredPayments.reduce((sum, p) => sum + (Number(p.grossChitAmt) || 0), 0);
  const totalReceiverDisbursed = filteredPayments.reduce((sum, p) => sum + (Number(p.receiverAmt) || 0), 0);

  const handleExportCSV = () => {
    const data = filteredPayments.map((p) => ({
      'Payment ID': p.id,
      'Chit Circle': p.groupName,
      'Receiver Name': p.receiverName,
      'Receiver ID': p.memberId,
      'Month Cycle': p.month,
      'Gross Chit Amount': p.grossChitAmt,
      'Receiver Amount': p.receiverAmt,
      'Disbursement Date': p.disbursementDate,
      'Payment Mode': p.paymentMode,
      'Reference No': p.referenceNumber,
    }));
    exportToCSV(data, `ChitFlow_NonAuction_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Disbursements export ready.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-indigo-600" />
              <span>Non-Auction Chit Payments</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {filteredPayments.length} Disbursed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage maturity and non-auction disbursements for Standard Fixed Chit circles without auction discount deductions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Non-Auction Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Receiver Payouts</span>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
            {formatCurrency(totalReceiverDisbursed)}
          </p>
          <p className="text-[11px] text-slate-500">{filteredPayments.length} payouts confirmed</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gross Chit Value Handled</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
            {formatCurrency(totalGrossDisbursed)}
          </p>
          <p className="text-[11px] text-slate-500">Cumulative chit volume</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Eligible Non-Auction Circles</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            {nonAuctionGroups.length} Active
          </p>
          <p className="text-[11px] text-slate-500">Standard / Fixed plans</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
        <div className="p-3 border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 dark:text-white">
            Disbursement Vouchers (Standard & Fixed Non-Auction)
          </span>
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Non-Auction Circles</option>
            {nonAuctionGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-[#182032] text-[10px] uppercase text-slate-500 dark:text-slate-400 font-mono border-b border-[#e2e4e9] dark:border-[#1e283d]">
              <tr>
                <th className="px-4 py-2.5">Voucher #</th>
                <th className="px-4 py-2.5">Chit Circle</th>
                <th className="px-4 py-2.5">Receiver</th>
                <th className="px-4 py-2.5">Month</th>
                <th className="px-4 py-2.5 text-right">Gross Chit Amt</th>
                <th className="px-4 py-2.5 text-right">Receiver Amt</th>
                <th className="px-4 py-2.5">Disbursement Date</th>
                <th className="px-4 py-2.5">Mode & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9] dark:divide-[#1e283d]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                    No non-auction disbursement records found. Click "Record Non-Auction Payment" to disburse funds.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151c2e]">
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {p.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                      {p.groupName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.receiverName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{p.memberId}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                      {p.month}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                      {formatCurrency(p.grossChitAmt)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(p.receiverAmt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDate(p.disbursementDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {p.paymentMode}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{p.referenceNumber}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Modal */}
      <RecordNonAuctionPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

/**
 * Non-Auction Chit Payment Pop-up
 * Fields:
 * 1. Chit Circle
 * 2. Receiver (filtered based on selected Chit Circle)
 * 3. Month
 * 4. Gross Chit Amt
 * 5. Receiver Amt
 * 6. Disbursement Date
 * 7. Payment Mode
 * 8. Reference
 */
const RecordNonAuctionPaymentModal = ({ isOpen, onClose }) => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const addNonAuctionPayment = useAppStore((state) => state.addNonAuctionPayment);

  // Filter groups strictly to Non-Auction category
  const nonAuctionGroups = groups.filter((g) => {
    if (g.distributionCategory) {
      return g.distributionCategory === 'NON_AUCTION';
    }
    return g.planType !== 'MONTHLY_DIFFERENT' && g.id !== 'GRP-2026-002';
  });

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [grossChitAmt, setGrossChitAmt] = useState('');
  const [receiverAmt, setReceiverAmt] = useState('');
  const [disbursementDate, setDisbursementDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
  const [referenceNumber, setReferenceNumber] = useState('');

  if (!isOpen) return null;

  // Filter members assigned to the chosen Chit Circle
  const circleMembers = selectedGroupId
    ? members.filter((m) => m.assignedGroupIds?.includes(selectedGroupId))
    : [];

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedMemberId('');
    const grp = groups.find((g) => g.id === groupId);
    if (grp) {
      setGrossChitAmt(grp.chitValue || '');
      // Check if standard plan has a designated scheduled payout for the current month
      const scheduledRow = grp.payoutSchedule?.find((row) => row.monthName === month);
      if (scheduledRow && scheduledRow.scheduledPayoutAmount) {
        setReceiverAmt(scheduledRow.scheduledPayoutAmount);
      } else {
        setReceiverAmt(grp.chitValue || '');
      }
    }
  };

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const grp = groups.find((g) => g.id === selectedGroupId);
    if (grp && grp.payoutSchedule) {
      const scheduledRow = grp.payoutSchedule.find((row) => row.monthName === newMonth);
      if (scheduledRow && scheduledRow.scheduledPayoutAmount) {
        setReceiverAmt(scheduledRow.scheduledPayoutAmount);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGroupId || !selectedMemberId) {
      toast.error('Please select both Chit Circle and Receiver');
      return;
    }

    const group = groups.find((g) => g.id === selectedGroupId);
    const member = members.find((m) => m.id === selectedMemberId);

    const record = {
      id: `NAP-${Date.now().toString().slice(-6)}`,
      groupId: selectedGroupId,
      groupName: group?.name || 'Chit Circle',
      memberId: selectedMemberId,
      receiverName: member?.fullName || 'Receiver',
      month,
      grossChitAmt: Number(grossChitAmt),
      receiverAmt: Number(receiverAmt),
      disbursementDate,
      paymentMode,
      referenceNumber: referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    addNonAuctionPayment(record);
    toast.success(`Disbursement of ₹${Number(receiverAmt).toLocaleString('en-IN')} recorded for ${record.receiverName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-indigo-600" />
              <span>Record Non-Auction Chit Payment</span>
            </h3>
            <p className="text-xs text-slate-500">
              Disburse full maturity or fixed installment payout to subscriber
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* 1. Chit Circle */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Chit Circle *
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => handleGroupSelect(e.target.value)}
              required
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            >
              <option value="">-- Choose Non-Auction Chit Circle --</option>
              {nonAuctionGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.id})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Receiver (Subscriber under this Chit Circle) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. Receiver (Subscriber) *
            </label>
            <select
              value={selectedMemberId}
              disabled={!selectedGroupId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white disabled:opacity-50"
            >
              <option value="">
                {selectedGroupId ? '-- Select Receiver from Circle --' : '-- Select Chit Circle First --'}
              </option>
              {circleMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.id} - {m.city})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Month */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                3. Month *
              </label>
              {selectedGroupId && (() => {
                const grp = groups.find((g) => g.id === selectedGroupId);
                const scheduledRow = grp?.payoutSchedule?.find((row) => row.monthName === month);
                if (scheduledRow?.scheduledPayoutAmount) {
                  return (
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      Pre-fixed Payout: ₹{Number(scheduledRow.scheduledPayoutAmount).toLocaleString('en-IN')}
                      {scheduledRow.recipientNote ? ` (${scheduledRow.recipientNote})` : ''}
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
          </div>

          {/* 4 & 5. Gross Chit Amt & Receiver Amt */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                4. Gross Chit Amount (INR) *
              </label>
              <input
                type="number"
                required
                value={grossChitAmt}
                onChange={(e) => setGrossChitAmt(e.target.value)}
                placeholder="Total Chit Value"
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                5. Receiver Amount (INR) *
              </label>
              <input
                type="number"
                required
                value={receiverAmt}
                onChange={(e) => setReceiverAmt(e.target.value)}
                placeholder="Disbursement Amount"
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          {/* 6. Disbursement Date & 7. Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                6. Disbursement Date *
              </label>
              <input
                type="date"
                required
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                7. Payment Mode *
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS)</option>
                <option value="CHEQUE">Cheque / Demand Draft</option>
                <option value="UPI">UPI Direct</option>
                <option value="CASH">Cash Voucher</option>
              </select>
            </div>
          </div>

          {/* 8. Reference */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              8. Reference No / Cheque No *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UTR-982180291 or CHQ-00129"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-[#e2e4e9] dark:border-[#1e283d]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Disburse</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

